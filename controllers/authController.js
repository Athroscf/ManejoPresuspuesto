const passport = require("passport");
const mongoose = require("mongoose");
const Presupuesto = mongoose.model("Presupuesto");

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

exports.administrarPresupuestos = async (req, res) => {
    const presupuestos = await Presupuesto.find({ autor: req.user._id });

    res.render("administrarPresupuestos", {
        nombrePagina: "Administracion",
        tagline: "Aqui puedes crear y administrar tus presupuestos",
        cerrarSesion: true,
        nombre: req.user.nombre,
        boton: true,
        presupuestos
    });
};