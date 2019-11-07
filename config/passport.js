const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const Usuario = mongoose.model("Usuario");

// Configuracion de la estrategia
passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password"
        },
        async (email, password, done) => {
            const usuario = await Usuario.findOne({ email });

            // Si no existe el usuario
            if (!usuario) {
                return done(null, false, {
                    message: ["El correo electronico no es valido"]
                });
            }

            // El usuario existe
            // Verificar contrasena
            const verificarPassword = usuario.compararPassword(password);

            // Si password es correcto
            if (!verificarPassword) {
                return done(null, false, {
                    message: ["La contrasena es incorrecta"]
                });
            }

            // Si existe el usuario y la contrasena es correcta
            return done(null, usuario);
        }
    )
);

// Serializar el usuario
passport.serializeUser((usuario, done) => done(null, usuario._id));

passport.deserializeUser(async (id, done) => {
    const usuario = await Usuario.findById(id);

    return done(null, usuario);
});

module.exports = passport;
