exports.mostrarHome = (req, res) => {
    res.render("home", {
        nombrePagina: "BugetManager",
        tagline: "Maneja tu presupuesto personal",
        barra: true,
        boton: true
    });
};