const mongoose = require("mongoose");
const Usuario = mongoose.model("Usuario");
const { validationResult } = require("express-validator");

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

    console.log(req.body);
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