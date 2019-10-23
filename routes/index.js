const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const homeController = require("../controllers/homeController");
const presupuestoController = require("../controllers/presupuestoController");
const usuarioController = require("../controllers/usuarioController");

module.exports = () => {

    router.get("/", homeController.mostrarPrespuestos);
    
    router.get("/presupuesto/nuevo", presupuestoController.formularioNuevoPresupuesto);
    router.post("/presupuesto/nuevo", presupuestoController.agregarPresupuesto);
    
    router.get("/presupuesto/:url", presupuestoController.mostrarPresupuesto);
    
    router.get("/presupuesto/editar/:url", presupuestoController.formularioEditarPresupuesto);
    router.post("/presupuesto/editar/url", presupuestoController.editarPresupuesto);
    
    // Rutas de usuario
    router.get("/crearCuenta", usuarioController.formularioCrearCuenta);
    router.post(
        "/crearCuenta", 
        [
            check("nombre", "El nombre de usuario es requerido")
                .not()
                .isEmpty()
                .escape(),
            check("email", "El correo electronico es requerido")
                .not()
                .isEmpty(),
            check("email", "El correo electronico no es valido")
                .isEmail()
                .normalizeEmail()
        ],
        usuarioController.formularioCrearCuenta
    );

    return router;
};