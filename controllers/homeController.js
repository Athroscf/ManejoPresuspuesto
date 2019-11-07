const mongoose = require("mongoose");
const Presupuesto = mongoose.model("Presupuesto");

exports.mostrarPrespuestos = async (req, res) => {
    //Obtener los presupuestos
    const presupuesto = await Presupuesto.find();

    // Si no se encuentra prespuestos
    if (!presupuesto) return next();

    // Si encuentra presupuestos

    res.render("home", {
        nombrePagina: "BugetManager",
        tagline: "Maneja tu presupuesto personal",
        barra: true,
        boton: true,
        presupuesto
    });
};