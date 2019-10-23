const mongoose = require("mongoose");
const Usuario = mongoose.model("Usuario");

exports.formularioCrearCuenta = (req, res) => {
    res.render("crearCuenta", {
        nombrePagina: "Crear Cuenta",
        tagline: "Maneja tus presupuestos!"
    });
};
