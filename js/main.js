// const { Html5QrcodeScanner } = require("html5-qrcode");

//const { Html5Qrcode } = require("html5-qrcode");

// import {Html5Qrcode} from "html5-qrcode"

const actualizoEstadoPago = (id,nombre,apellido,actividad) =>{
    const usuario = {
        nombre: nombre,
        apellido: apellido,
        actividad: actividad,
        estado_pago: "no deudor",
    }
    const resultado = fetch('http://localhost:8000/clientes/'+id,{
        method:'PUT',
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(usuario)
    })

    resultado
        .then(response=>{
            return response.json();
        })
        .then(producto=>{
            console.log(producto);
        })
        .catch(err=>{
            console.error(err)
        })
}

const listoTodoHistorialAwait = async () =>{
    let historial;
    try {
        const respuesta = await fetch('http://localhost:8000/historial'); 
        const historial = await respuesta.json();
        let tbody = document.querySelector('tbody')
        //console.log(historial);
        historial.forEach(element => {
            let tr = document.createElement('tr')
            console.dir(tr)
            tr.innerHTML = `<td>${element.id}</td>
            <td>${element.nombre}</td>
            <td>${element.actividad}</td>
            <td>${element.fecha}</td>
            `
            tbody.appendChild(tr)
        });
    } catch (error) {
        console.error(error)
    }
    return historial

}

const listoUnUsuario = async qr => {
    try {
        const respuesta = await fetch('http://localhost:8000/clientes/' + qr);
        const resultado = await respuesta.json();
        console.log(resultado);
        return resultado
    } catch (error) {
        console.error(error)
    }
}

const guardoHistorialAwait = async (usuarioObj) => {
    try {
        const resultado = await fetch('http://localhost:8000/historial', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usuarioObj)//El metodo stringify() transforma en un obj de js en un string
        });

        const response = await resultado.json()
        

        console.log(response);
    } catch (error) {
        console.error(error)
    }

}

function onScanSuccess(decodedText, decodedResult) {
    // handle the scanned code as you like, for example:
    console.log(`Code matched = ${decodedText}`, decodedResult);
    //Html5QrcodeScanner.stop()

    // Stop scanning
    html5QrcodeScanner.clear().then(_ => {
        // the UI should be cleared here 
        let reader = document.querySelector('#reader')
        reader.style.display = "none"
        let resultado = listoUnUsuario(decodedText)
        resultado.then(resul => {
            console.log(resul.nombre);
            let tarjeta = document.querySelector('.tarjeta');
            tarjeta.style.display = "grid"
            let nombre = document.querySelector('.nombre')
            nombre.textContent = resul.nombre
            let actividad = document.querySelector('.actividad')
            actividad.textContent = resul.actividad;
            let boton_deuda = document.querySelector('.boton-deuda')
            if (resul.estado_pago === 'deudor') {
                boton_deuda.classList.add('deudor')
                boton_deuda.textContent = "Registrar Asistencia"
                actualizoEstadoPago(resul.id,resul.nombre,resul.apellid,resul.actividad)
            } else {
                boton_deuda.classList.add('no-deudor')
                boton_deuda.textContent = "Cuota al dia"
            }
        })

    }).catch(error => {
        // Could not stop scanning for reasons specified in `error`.
        // This conditions should ideally not happen.
    });

}

function onScanFailure(error) {
    // handle scan failure, usually better to ignore and keep scanning.
    // for example:
    console.warn(`Code scan error = ${error}`);
}

let html5QrcodeScanner = new Html5QrcodeScanner(
    "reader",
    { fps: 10, qrbox: { width: 250, height: 250 } },
    /* verbose= */ false);

html5QrcodeScanner.render(onScanSuccess, onScanFailure);

let boton_deuda = document.querySelector('.boton-deuda')
boton_deuda.addEventListener('click', e => {
    e.preventDefault();
    if (e.textContent === "Cuota al dia") {
        let tarjeta = document.querySelector('.tarjeta');
        tarjeta.style.display = "none"
        let reader = document.querySelector('#reader')
        reader.style.display = "block"
        html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    } else {
        let nombre = document.querySelector('.nombre')
        let actividad = document.querySelector('.actividad')
        guardoHistorialAwait({ nombre: nombre.textContent, actividad: actividad.textContent, fecha: new Date() })
        listoTodoHistorialAwait()
    }
})