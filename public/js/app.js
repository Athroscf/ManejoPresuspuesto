document.addEventListener("DOMContentLoaded", () => {
    // Limpiar alertas
    let alertas = document.querySelector(".alertas");

    if (alertas) {
        limpiarAlertas(alertas);
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
