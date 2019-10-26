const passport = require("passport");
const mongoose = require("mongoose");
const Presupuesto = mongoose.model("Presupuesto");

exports.autenticarUsuario = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/iniciarSesion",
    failureFlash: true,
    badRequestMessage: ["Debes ingresar ambos campos"]
});