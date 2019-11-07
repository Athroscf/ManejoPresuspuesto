const mongoose = require("mongoose");
const Usuario = mongoose.model("Usuario");
const { validationResult } = require("express-validator");
const multer = require("multer");
const shortid = require("shortid");

exports.formularioCrearCuenta = (req, res) => {
    res.render("crearCuenta", {
        nombrePagina: "Crear Cuenta",
        tagline: "Maneja tus presupuestos!"
    });
};

exports.crearUsuario = async (req, res, next) => {
    //Vrificar que no existan errores
    const errores = validationResult(req);
    const erroresArray = [];

    if (!errores.isEmpty()) {
        errores.array().map(error => erroresArray.push(error.msg));

        //Enviar los errores al usuario
        req.flash("error", erroresArray);

        res.render("crearCuenta", {
            nombrePagina: "Crear cuenta",
            tagline: "Maneja tus presupuestos",
            messages: req.flash()
        });
        return;
    }
    // Crear usuario
    const usuario = Usuario(req.body);
    
    // Tratar almacenar el usuario
    try {
        await usuario.save();
    } catch (error) {
        erroresArray.push(error);
        req.flash("error", erroresArray);

        res.render("crearCuenta", {
            nombrePagina: "Crear cuenta",
            tagline: "Maneja tus presupuestos",
            messages: req.flash()
        });
    }    
};

exports.formularioIniciarSesion = (req, res) => {
    res.render("iniciarSesion", {
        nombrePagina: "Iniciar sesion"
    });
};

exports.formularioEditarPerfil = (req, res) => {
    res.render("editarPerfil", {
        nombrePagina: "Edita tu perfil de usuario",
        usuario: req.user,
        cerrarSesion: true,
        nommbre: req.user.nombre
    });
};

exports.editarPerfil = async (req, res) => {
    const usuario = await Usuario.findById(req.user._id);

    usuario.nombre = req.body.nombre;
    usuario.email = req.body.email;

    if (req.body.password) {
        usuario.password = req.body.password;
    }

    await usuario.save();

    req.flash("correcto", ["Cambios almacenados correctamente"]);

    res.redirect("/administrarPresupuestos");
};

exports.subirImagen = (req, res, next) => {
    upload(req, res, function(error) {
        if (error instanceof multer.MulterError) {
            return next();
        }
    });
    next();
};

// Configuracion multer
const configuracionMulter = {};

const upload = multer(configuracionMulter).single("imagen");