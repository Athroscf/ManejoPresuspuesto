const mongoose = require("mongoose");
const usuario = mongoose.model("Usuario");
const Presupuesto = mongoose.model("Presupuesto");

exports.formularioNuevoPresupuesto = (req, res) => {
    res.render("nuevoPresupuesto", {
        nombrePagina: "Nuevo Presupuesto",
        tagline: "Define tu presupuesto",
        cerrarSesion: true,
        nombre: req.user.nombre
    });
};

// Este solo funciona agregando un gasto a la vez
exports.agregarPresupuesto = async (req, res) => {
    const presupuesto = new Presupuesto(req.body);
    const gastos = req.body.nombreGasto
    const cantidades = req.body.cantidad
    
    gastos.forEach(gasto => {
        let gastos = {
            nombreGasto: gasto.nombreGasto,
            cantidad: gasto.cantidad
        };
        presupuesto.gastos.push(gastos);
    })
    
    presupuesto.autor = req.user._id;

    // Guardar en la BD
    await presupuesto.save(function (err, cb) {
        console.log(err);
    });

    // Redireccionar
    res.redirect(`/presupuesto/${presupuesto.url}`);
}

exports.mostrarPresupuesto = async (req, res, next) => {
    const presupuesto = await Presupuesto.findOne({ url: req.params.url });

    if (!presupuesto) return next();

    if (!presupuesto.autor.equals(req.user._id)) {
        return next();
    }

    // Si encuentra el presupuesto
    res.render("presupuesto", {
        nombrePagina: presupuesto.titulo,
        barra: false,
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
    // const presupuesto = await Presupuesto.findOneAndDelete(req.params._id);

    // req.flash("success_msg", "El presupuesto fue eliminado correctamente");
    // presupuesto.remove();
    // res.redirect("/administrarPresupuesto");

    const presupuesto = await Presupuesto.findById(id);

    if(verificarUsuario(presupuesto, req.user)) {
        presupuesto.remove();
        res.status(200).send("Error al eliminar el presupuesto");
    } else {
        res.status(403).send("Error al eliminar el presupuesto");
    }
};

const verificarUsuario = (presupuestos = {}, usuario = {}) => {
    if(!presupuestos.autor.equals(usuario._id)) {
        return false;
    }

    return true;
};

exports.buscarPresupuesto = async (req, res) => {
    // Buscador
    const presupuesto = await Presupuesto.find({
        $text: {
            $search: req.body.equals
        }
    });

    // Mostrar presupuestos
    res.render("home", {
        nombrePagina: `Resultados para la busqueda: ${req.body.q}`,
        barra: true,
        presupuesto
    });
};