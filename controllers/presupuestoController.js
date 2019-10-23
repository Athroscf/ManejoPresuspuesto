const mongoose = require("mongoose");
const Presupuesto = mongoose.model("Presupuesto");

exports.formularioNuevoPresupuesto = (req, res) => {
    res.render("nuevoPresupuesto", {
        nombrePagina: "Nuevo Presupuesto",
        tagline: "Define tu presupuesto"
    });
};
    // "watch": "webpack --w --mode development",
exports.agregarPresupuesto = async (req, res) => {
    const presupuesto = new Presupuesto(req.body);

    const nombreGasto = [req.body.nombreGasto];
    const cantidad = [req.body.cantidad];

    presupuesto.gastos[0] = nombreGasto;
    presupuesto.gastos[1] = cantidad;

    console.log(presupuesto);
    console.log(req.body);
    // Guardar en la BD
    await presupuesto.save();

    // Redireccionar
    res.redirect(`/Presupuesto/${ presupuesto.url }`);
}

exports.mostrarPresupuesto = async (req, res, next) => {
    const presupuesto = await Presupuesto.findOne({ url: req.params.url });

    // Si no encuentra el presupuesto
    if (!presupuesto) return next();

    // Si encuentra el presupuesto
    res.render("presupuesto", {
        nombrePagina: presupuesto.titulo,
        barra: true,
        presupuesto
    });
};

// Mostrar formulario de Editar
exports.formularioEditarPresupuesto = async (req, res, next) => {
    const presupuesto = await Presupuesto.findOne({ url: req.params.url });

    // Si no existe
    if (!presupuesto) return next();

    // Si existe
    res.render("editarPresupuesto", {
        nombrePagina: `Editar ${presupuesto.titulo}`,
        barra: true,
        presupuesto
    });
};

// Guardar lo que se edito en el presupuesto
exports.editarPresupuesto = async (req, res, next) => {
    const presupuestoEditado = req.body;

    console.log(presupuestoEditado);

    const presupuesto = await Presupuesto.findOneAndUpdate(
        { url: req.params.url },
        presupuestoEditado,
        {
            new: true,
            runValidators: true
        }
    );

    res.redirect(`/presupuesto/${presupuesto.url}`);
};
