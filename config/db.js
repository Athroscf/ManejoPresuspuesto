const mongoose = require("mongoose");
require("dotenv").config({ path: "variables.env" });

// Configuracion de Mongoose
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on("error", error => {
    console.log(error);
});

// Importando modelos
require("../models/Presupuesto");
require("../models/Usuario");
