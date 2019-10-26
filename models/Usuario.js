const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const bcrypt = require("bcrypt");

// Definicion del schema
const usuarioSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true
    },
    nombre: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    token: String,
    expiration: Date
});

usuarioSchema.pre("save", function(next) {
    const user = this;

    // Si ya se hasheo el password
    if (!user.isModified("password")) {
        return next();
    }

    // Generar el salt
    bcrypt.genSalt(10, (err, salt) => {

        if (err) return (next(err));

        bcrypt.hash(user.password, salt, (err, hash) => {
            
            if(err) return(next(err));

            user.password = hash;

            next();
        });
    });
});

usuarioSchema.post("save", function(error, doc, next) {
    if(error.name === "MongoError" && error.code === 1000) {
        next(
            "El correo electronico ya esta registrado en una cuenta"
        );
    } else {
        next(error);
    }
});

usuarioSchema.methods.compararPassword = function(candidatePassword) {
    return bcrypt.compareSync(candidatePassword, this.password);
};

usuarioSchema.methods.comparePassword = function(candidatePassword) {
    const user = this;

    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
            if (err) {
                return reject(err);
            }

            if (!isMatch) {
                return reject(false);
            }

            resolve(true);
        });
    }).catch();
};

module.exports = mongoose.model("Usuario", usuarioSchema);
