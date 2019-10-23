const mongoose = require("mongoose");
const Usuario = mongoose.model("Usuario");

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
    }    
    // Crear usuario
    const usuario = Usuario(req.body);

    await usuario.save();

    res.redirect("/crearCuenta");
    
};