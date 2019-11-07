const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
require("./config/db");
const express = require("express");
const expresshbs = require("express-handlebars");
const path = require("path");
const router = require("./routes/index");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const passport = require("./config/passport");
const createError = require("http-errors");

// Habilitando el archivo de variables de entorno
require("dotenv").config({ path: "variables.env" });

const app = express();

// Habilitar body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Habilitar handlebars como template engine
app.engine(
    "handlebars",
    expresshbs({
        defaultLayout: "layout",
        helpers: require("./helpers/handlebars")
    })
);

app.set("view engine", "handlebars");

// Definir ruta para archivos estaticos
app.use(express.static(path.join(__dirname, "public")));

// Creacion de la sesion y de la cookie
app.use(cookieParser());

app.use(
    session({
        secret: process.env.SECRET,
        key: process.env.KEY,
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({ mongooseConnection: mongoose.connection })
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
    res.locals.messages = req.flash();
    next();
});

app.use("/", router());

app.use((req, res, next) => {
    next(createError(404, "La pagina que has solicitado no existe"));
});

app.use((error, req, res, next) => {
    const status = error.status || 500;

    res.locals.status = status;
    res.status(status);

    res.render("error", {
        status,
        messages: "No encontrado",
        layout: "errorcito"
    });
});

app.listen(process.env.PORT);
