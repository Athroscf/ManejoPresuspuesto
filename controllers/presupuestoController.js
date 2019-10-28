const mongoose = require("mongoose");
const Presupuesto = mongoose.model("Presupuesto");

exports.formularioNuevoPresupuesto = (req, res) => {
    res.render("nuevoPresupuesto", {
        nombrePagina: "Nuevo Presupuesto",
        tagline: "Define tu presupuesto",
        cerrarSesion: true,
        nombre: req.user.nombre
    });
};
    // "watch": "webpack --w --mode development",
exports.agregarPresupuesto = async (req, res) => {
    const presupuesto = new Presupuesto(req.body);

    presupuesto.gastos[0] = [req.body.nombreGasto];
    presupuesto.gastos[1] = [req.body.cantidad];
    presupuesto.autor = req.user._id;
    
    console.log(presupuesto);
    // Guardar en la BD
    await presupuesto.save(function (err, cb) {
        console.log(err);
    });

    // Redireccionar
    res.redirect(`/presupuesto/${presupuesto.url}`);
}

exports.mostrarPresupuesto = async (req, res, next) => {
    const presupuesto = await Presupuesto.findOne({ url: req.params.url });

    // Si no encuentra el presupuesto
    if (verificarUsuario) {
        res.redirect("/iniciarSesion");
    }

    if (!presupuesto) return next();

    // Si encuentra el presupuesto
    res.render("presupuesto", {
        nombrePagina: presupuesto.titulo,
        cerrarSesion: true,
        nombre: req.user.nombre,
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
        presupuesto,
        cerrarSesion: true,
        nombre: req.user.nombre
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

exports.eliminarPresupuesto = async (req, res) => {
    const { id } = req.params;

    const presupuesto = await Presupuesto.findById(id);

    if(verificarUsuario(presupuesto, req.user)) {
        presupuesto.remove();
        res.status(200).send("Error al eliminar el presupuesto");
    } else {
        res.status(403).send("Error al eliminar el presupuesto");
    }
};

const verificarUsuario = (presupuestos = {}, usuario = {}) => {
    if(!presupuesto.autor.equals(usuario._id)) {
        return false;
    }

    return true;
};