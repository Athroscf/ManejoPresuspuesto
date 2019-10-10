const express = require("express");
const expresshbs = require("express-handlebars");
const router = require("./routes/index");

const app = express();

// Habilitar handlebarse como template engine
app.engine(
    "Handlebars",
    expresshbs({
        defaultLayout: "layout"
    })
);

app.set("view engine", "handlebars");

app.use("/", router());

app.listen(3000);