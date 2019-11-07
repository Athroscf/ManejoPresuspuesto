const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const homeController = require("../controllers/homeController");
const presupuestoController = require("../controllers/presupuestoController");
const usuarioController = require("../controllers/usuarioController");
const authController = require("../controllers/authController");

module.exports = () => {

    router.get(
        "/",
        authController.verificarUsuario,
        homeController.mostrarPrespuestos);
    
    router.get(
        "/presupuesto/nuevo",
        authController.verificarUsuario,
        presupuestoController.formularioNuevoPresupuesto
    );
    router.post(
        "/presupuesto/nuevo",
        authController.verificarUsuario,
        presupuestoController.agregarPresupuesto);
    
    router.get("/presupuesto/:url", presupuestoController.mostrarPresupuesto);
    
    router.get(
        "/presupuesto/editar/:url",
        authController.verificarUsuario,
        presupuestoController.formularioEditarPresupuesto);
    router.post(
        "/presupuesto/editar/:url",
        authController.verificarUsuario,
        presupuestoController.editarPresupuesto);

    router.delete(
        "/presupuesto/eliminar/:id",
        presupuestoController.eliminarPresupuesto);
    
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
                .normalizeEmail(),
            check("password", "La contraseña es requerida.")
                .not()
                .isEmpty(),
            check("confirmarPassword", "Debes confirmar tu contraseña")
                .not()
                .isEmpty(),
            check("confirmarPassword", "Las contraseñas no coinciden")
                .custom((value, {
                    req
                }) => value === req.body.password)
        ],
        usuarioController.crearUsuario
    );

    // Iniciar Sesion
    router.get("/iniciarSesion", usuarioController.formularioIniciarSesion);
    router.post("/iniciarSesion", authController.autenticarUsuario);

    //Cerrar Sesion
    router.get("/cerrarSesion", authController.cerrarSesion);
    
    // Reestablecer password del usuario
    router.get(
        "/reestablecerPassword",
        authController.formularioReestablecerPassword
    );
    router.post(
        "/reestablecerPassword",
        authController.enviarToken);

    router.get(
        "/reestablecerPassword/:token",
        authController.formularioNuevaPassword
    );
    router.post(
        "/reestablecerPassword/:token",
        authController.guardarNuevaPassword
    );

    // Buscador
    router.post("/buscador", presupuestoController.buscarPresupuesto);

    // Editar perfil
    router.get(
        "/editarPerfil",
        authController.verificarUsuario,
        usuarioController.formularioEditarPerfil
    );
    router.post(
        "/editarPerfil",
        authController.verificarUsuario,
        usuarioController.subirImagen,
        usuarioController.editarPerfil
    );

    //Administracion
    router.get(
        "/administrarPresupuestos",
        authController.verificarUsuario,
        authController.administrarPresupuestos
    );
    
    return router;
};