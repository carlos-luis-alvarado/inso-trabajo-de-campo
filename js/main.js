// const { Html5QrcodeScanner } = require("html5-qrcode");

//const { Html5Qrcode } = require("html5-qrcode");

// import {Html5Qrcode} from "html5-qrcode"

const listoUnUsuario= async qr =>{
    try {
        const respuesta = await fetch('http://localhost:8000/clientes/'+qr);
        const resultado = await respuesta.json();
        console.log(resultado);
        return resultado
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
        let resultado =listoUnUsuario(decodedText)
        resultado.then(resul=>{
            console.log(resul.nombre);
            let reader =document.querySelector('#reader');
            let div = document.createElement('div');
            let contenedorTarjeta = `<p>Nombre : ${resul.nombre} ${resul.apellido}</p>
            <p>Actividad: ${resul.actividad}</p>
            <p>Estado : ${resul.estado_pago}</p>
            `
            if(resul.estado_pago==='deudor'){
                div.classList.add('deudor')
            }else{
                div.classList.add('no-deudor')
            }
            div.innerHTML = contenedorTarjeta
    
            div.style.color="#000";
            reader.appendChild(div)  
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