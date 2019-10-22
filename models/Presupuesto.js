const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const slug = require("slug");
const shortid = require("shortid");

// Definicion del schema
const presupuestoSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: "El titulo del nuevo presupuesto es requerido",
        trim: true
    },
    ingresos: {
        type: Number,
        required: "Los ingresos son requeridos"
    },
    ahorrosEsperados: {
        type: Number,
        required: "Es necesario ingresar la cantidad que espera ahorrar"
    },
    gastos: [
        {
            nombreGasto: String,
            cantidad: Number
        }
    ],
    resultadoFinDeMes: {
        type: Number
    },
    url: {
        type: String,
        lowercase: true
    }
});

// Hooks para generar la URL
presupuestoSchema.pre("save", function (next) {
    // Crear la url
    const url = slug(this.titulo);
    this.url = `${url}-${shortid.generate()}`;

    next();
});

module.exports = mongoose.model("Presupuesto", presupuestoSchema);
