import Axios from "axios";
import Swal from "sweetalert2";

document.addEventListener("DOMContentLoaded", () => {
    // Limpiar alertas
    let alertas = document.querySelector(".alertas");

    if (alertas) {
        limpiarAlertas(alertas);
    }

    console.log("----------------------------------------");
    console.log("Entro a DOMLoaded");
    console.log("----------------------------------------");

    const presupuestoListado = document.querySelector(".panel-administracion");

    if (presupuestoListado) {
        presupuestoListado.addEventListener("click", accionesListado);
    }
});

const limpiarAlertas = alertas => {
    // Verificar si hay alertas
    const interval = setInterval(() => {
        if (alertas.children.length > 0) {
            alertas.removeChild(alertas.children[0]);
        } else {
            alertas.parentElement.removeChild(alertas);
            clearInterval(interval);
        }
    }, 3000);
};

const accionesListado = e => {
    console.log("----------------------------------------");
    console.log("Entro a accionesListado");
    console.log("----------------------------------------");

    e.preventDefault();
    
    if (e.target.dataset.eliminar) {
        console.log(e);
        Swal.fire({
            title: 'Estas seguro de eliminar este presupuesto?',
            text: "No podras deshacer esta accion!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Eliminar',
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.value) {
                const url = `${location.origin}/presupuesto/eliminar/${e.target.dataset.eliminar}`;

                Axios
                    .delete(url, {
                        params: url
                    })
                    .then(function (resupesta) {
                        if (resupesta.status == 200) {
                            Swal.fire(
                                "Eliminado!",
                                resupesta.data,
                                "success"
                            );

                            e.target.parentElement.parentElement.parentElement.removeChild(
                                e.target.parentElement.parentElement
                            );
                        }
                    })
                    .catch(() =>
                        Swal.fire({
                            type: "error",
                            title: "Error",
                            text: "Hubo un error al eliminar el presupuesto"
                        })
                    );
            }
        });
    } else if (e.target.tagName === "A") {
        window.location.href = e.target.href;
    }
};