const mongoose = require("mongoose");
const Usuario = mongoose.model("Usuario");

exports.formularioCrearCuenta = (req, res) => {
    res.render("crearCuenta", {
        nombrePagina: "Crear Cuenta",
        tagline: "Maneja tus presupuestos!"
    });
};

exports.crearUsuario = async (req, res, next) => {
    // Crear usuario
    const usuario = Usuario(req.body);

    await usuario.save();

    res.redirect("/crearCuenta");
};