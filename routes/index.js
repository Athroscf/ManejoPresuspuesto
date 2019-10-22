const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
const presupuestoController = require('../controllers/presupuestoController');

module.exports = () => {

    router.get("/", homeController.mostrarHome);
    
    router.get("/presupuesto/nuevo", presupuestoController.formularioNuevoPresupuesto);
    router.post("/presupuesto/nuevo", presupuestoController.agregarPresupuesto);
    
    router.get("/presupuesto/:url", presupuestoController.mostrarPresupuesto);
    
    return router;
};