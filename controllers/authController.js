const passport = require("passport");
const mongoose = require("mongoose");
const Presupuesto = mongoose.model("Presupuesto");
const Usuario = mongoose.model("Usuario");
const crypto = require("crypto");
const enviarEmail = require("../handlers/email");

exports.autenticarUsuario = passport.authenticate("local", {
    successRedirect: "/administrarPresupuestos",
    failureRedirect: "/iniciarSesion",
    failureFlash: true,
    badRequestMessage: ["Debes ingresar ambos campos"]
});

exports.cerrarSesion = (req, res) => {
    // Cerrar Sesion
    req.logout();

    req.flash("correcto", [
        "Cerraste sesion. Te esperamos!"
    ]);
    
    return res.redirect("/iniciarSesion");
};

exports.verificarUsuario = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect("/iniciarSesion");
};

exports.formularioReestablecerPassword = (req, res) => {
    res.render("reestablecerPassword", {
        nombrePagina: "Reestablece tu contrasena",
        tagline: "Si olvidaste tu contrasena, danos tu correo para poder cambiarla"
    });
};

exports.enviarToken = async (req, res) => {
    // Verificar correo electronico
    const usuario = await Usuario.findOne({ email: req.body.email });

    // Si no existe el usuario
    if (!usuario) {
        req.flash("error", ["No existe el correo electronico"]);
        return res.redirect("/reestablecerPassword");
    }

    // El usuario existe
    usuario.token = crypto.randomBytes(20).toString("hex");
    usuario.expiration = Date.now() + 3600000;

    await usuario.save();

    const resetUrl = `http://${req.headers.host}/reestablecerPassword/${usuario.token}`;

    await enviarEmail.enviar({
        usuario,
        subject: "Reestablece tu contrasena",
        template: "resetPassword",
        resetUrl
    });

    req.flash("correcto", [
        "Verifica tu correo y sigue las intrucciones"
    ]);
    res.redirect("/iniciarSesion");
};

exports.formularioNuevaPassword = async (req, res) => {
    const usuario = await Usuario.findOne({
        token: req.params.token,
        expiration: { $gt: Date.now() }
    });

    if (!usuario) {
        req.flash("error", [
            "La solicitud expiró. Solicite el cambio de contraseña de nuevo"
        ]);
        return res.redirect("/reestablecerPassword");
    }

    res.render("nuevaPassword", {
        nombrePagina: "Ingresa tu nueva contrasena",
        tagline: "Asegurate de utilizar una contrasena segura"
    });
};

exports.administrarPresupuestos = async (req, res) => {
    const presupuestos = await Presupuesto.find({ autor: req.user._id });

    res.render("administrarPresupuestos", {
        nombrePagina: "Administracion",
        tagline: "Aqui puedes crear y administrar tus presupuestos",
        cerrarSesion: true,
        barra: false,
        nombre: req.user.nombre,
        boton: true,
        presupuestos
    });
};

exports.guardarNuevaPassword = async (req, res) => {
    const usuario = await Usuario.findOne({
        token: req.params.token,
        expiration: { $gt: Date.now() }
    });

    if (!usuario) {
        req.flash("error", [
            "Solicitud expirada. Solicita el cambio de constraseña de nuevo."
        ]);

        return res.redirect("/reestablecerPassword");
    }

    // Obtener nueva password
    usuario.password = req.body.password;

    // Limpiar valor que no son requeridos
    usuario.token = undefined;
    usuario.expiration = undefined;

    await usuario.save();

    req.flash("correcto", ["Contraseña modificada correctamente"]);
    res.redirect("/iniciarSesion");
};
