const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');


document.addEventListener('DOMContentLoaded', () => {
    formulario.addEventListener('submit', buscarClima);
})

function buscarClima(e) {
    e.preventDefault();

    // Validar los campos
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if (ciudad === '' || pais === '') {
        mostrarError('Ambos campos son obligatorios');
        return
    }

    // Consultar la API
    consultarAPI(ciudad, pais);
}

function mostrarError(mensaje) {
    const alerta = document.querySelector('.bg-red-100');

    if (!alerta) {
        // Crear una alerta
        const alerta = document.createElement('div');
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center');
        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block">${mensaje}</span>
        ` ;
        container.appendChild(alerta);

        // Eliminar alerta
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

function consultarAPI(ciudad, pais) {
    const appId = '8d8ddcc6f2cf50bdf7a54a47b32b9c6d';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;
    fetch(url)
        .then(resultado => resultado.json())
        .then(datos => {
            
            if (datos.cod === '404') {
                mostrarError('Ciudad no encontrada');
                return;
            }

            // Crear spinner
            const spinner = document.querySelector('.spinner');
            spinner.classList.add('block');
            spinner.classList.remove('hidden');

            // Imprime la respuesta en el HTML
            setTimeout(() => {
                spinner.remove();
                mostrarClimaHMTL(datos);
            }, 3000);
        })
}

function mostrarClimaHMTL(datos) {

    limpiarHTML();

    const { main: { temp, temp_max, temp_min }, name } = datos;
    
    const centigrados = kelvinAcentigrados(temp);
    const max = kelvinAcentigrados(temp_max);
    const min = kelvinAcentigrados(temp_min);

    const nombre = document.createElement('P');
    nombre.classList.add('font-bold', 'text-6xl');
    nombre.innerHTML = `${name}`;

    const actual = document.createElement('P');
    actual.classList.add('font-bold', 'text-6xl');
    actual.innerHTML = `${centigrados} &#8451;`;

    const tempMax = document.createElement('P');
    tempMax.classList.add('text-xl');
    tempMax.innerHTML = `Max: ${max} &#8451;`;

    const tempMin = document.createElement('P');
    tempMin.classList.add('text-xl');
    tempMin.innerHTML = `Min: ${min} &#8451;`;

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-white');
    
    resultadoDiv.appendChild(nombre);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(tempMax);
    resultadoDiv.appendChild(tempMin);

    resultado.appendChild(resultadoDiv);
}

const kelvinAcentigrados = grados => parseInt(grados - 273.15); 
// function kelvinAcentigrados(grados) {
//     return parseInt(grados - 273.15);
// }

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}