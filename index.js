const express = require("express");
const expresshbs = require("express-handlebars");
const router = require("./routes/index");
const path = require("path");

const app = express();

// Habilitar handlebars como template engine
app.engine(
    "handlebars",
    expresshbs({
        defaultLayout: "layout"
    })
);

app.set("view engine", "handlebars");

// Definir ruta para archivos estaticos
app.use(express.static(path.join(__dirname, "public")));

app.use("/", router());

app.listen(3000);