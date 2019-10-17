const mongoose = require("mongoose");
const Presupuesto = mongoose.model("Presupuesto");

exports.formularioNuevoPresupuesto = (req, res) => {
    res.render("nuevoPresupuesto", {
        nombrePagina: "Nuevo Presupuesto",
        tagline: "Define tu presupuesto"
    });
};

exports.agregarPresupuesto = async (req, res) => {
    const presupuesto = new Presupuesto(req.body);
    
    console.log(presupuesto);
    // Guardar en la BD
    await presupuesto.save();

    // Redireccionar
    // res.redirect(`/Presupuesto/${ nuevoPresupuesto.url }`);
}
