class Calculadora {
    sumar(a, b) { return a + b; }
    restar(a, b) { return a - b; }
    dividir(a, b) { return a / b; }
    multiplicar(a, b) { return a * b; }
    seno(n) { return Math.sin(n * Math.PI / 180); }
    coseno(n) { return Math.cos(n * Math.PI / 180); }
    tangente(n) { return Math.tan(n * Math.PI / 180); }
}

class Display {
    constructor(displayValorAnterior, displayValorActual) {
        this.displayValorActual = displayValorActual;
        this.displayValorAnterior = displayValorAnterior;
        this.calculador = new Calculadora();
        this.tipoOperacion = undefined;
        this.valorActual = '';
        this.valorAnterior = '';
        this.signos = { sumar: '+', restar: '-', multiplicar: 'X', dividir: '/' };
    }

    agregarNumero(numero) {
        if (numero === '.' && this.valorActual.includes('.')) return;
        this.valorActual = this.valorActual.toString() + numero.toString();
        this.imprimirValores();
    }

    borrar() {
        this.valorActual = this.valorActual.toString().slice(0, -1);
        this.imprimirValores();
    }

    borrarTodo() {
        this.valorActual = '';
        this.valorAnterior = '';
        this.tipoOperacion = undefined;
        this.imprimirValores();
    }

    operacionCientifica(tipo) {
        const valor = parseFloat(this.valorActual);
        if (isNaN(valor) && tipo !== 'pi') return;
        
        if (tipo === 'pi') this.valorActual = Math.PI.toFixed(8);
        if (tipo === 'raiz') this.valorActual = Math.sqrt(valor);
        if (tipo === 'seno') this.valorActual = this.calculador.seno(valor);
        if (tipo === 'coseno') this.valorActual = this.calculador.coseno(valor);
        if (tipo === 'tangente') this.valorActual = this.calculador.tangente(valor);
        if (tipo === 'log') this.valorActual = Math.log10(valor);
        if (tipo === 'factorial') {
            let res = 1;
            for (let i = 1; i <= valor; i++) res *= i;
            this.valorActual = res;
        }
        
        this.imprimirValores();
    }

    computar(tipo) {
        if (this.valorActual === '') return;
        if (this.valorAnterior !== '') this.calcular();
        this.tipoOperacion = tipo;
        this.valorAnterior = this.valorActual;
        this.valorActual = '';
        this.imprimirValores();
    }

    calcular() {
        const anterior = parseFloat(this.valorAnterior);
        const actual = parseFloat(this.valorActual);
        if (isNaN(anterior) || isNaN(actual)) return;
        this.valorActual = this.calculador[this.tipoOperacion](anterior, actual);
        this.tipoOperacion = undefined;
        this.valorAnterior = '';
    }

    imprimirValores() {
        this.displayValorActual.textContent = this.valorActual;
        this.displayValorAnterior.textContent = `${this.valorAnterior} ${this.signos[this.tipoOperacion] || ''}`;
        this.displayValorActual.style.fontSize = this.valorActual.length > 10 ? '1.5rem' : '2.5rem';
    }
}

document.addEventListener('DOMContentLoaded', () => {

    const display = new Display(
        document.getElementById('valor-anterior'),
        document.getElementById('valor-actual')
    );


    document.querySelectorAll('button').forEach(boton => {
        boton.addEventListener('click', () => {
            const texto = boton.innerText;

            if (boton.classList.contains('numero') || !isNaN(texto) || texto === '.') {
                display.agregarNumero(texto);
            } else if (boton.classList.contains('operador-cientifico') || boton.getAttribute('value')) {
                display.operacionCientifica(boton.getAttribute('value'));
            } else if (texto === 'C') {
                display.borrarTodo();
            } else if (texto === '←') {
                display.borrar();
            } else if (texto === '=') {
                display.calcular();
                display.imprimirValores();
            } else {
                const mapa = { '+': 'sumar', '-': 'restar', 'X': 'multiplicar', '/': 'dividir' };
                if (mapa[texto]) display.computar(mapa[texto]);
            }
        });
    });

    const btnToggle = document.getElementById('toggle-cientifica');
    const seccionCientifica = document.getElementById('seccion-cientifica');
    if (btnToggle && seccionCientifica) {
        btnToggle.addEventListener('click', () => {
            seccionCientifica.classList.toggle('cientifica-visible');
            seccionCientifica.classList.toggle('cientifica-oculta');
        });
    }

    const loginBtn = document.getElementById('asesor-login-btn');
    const nameInput = document.getElementById('asesor-name-input');
    const overlay = document.getElementById('login-overlay');
    const app = document.getElementById('calculator-app');
    const displayTag = document.getElementById('asesor-name-display');

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const nombre = nameInput.value.trim();
            const soloLetras = /^[a-zA-Z\s]+$/;

            if (!nombre || !soloLetras.test(nombre)) {
                alert("Por favor, ingresa un nombre válido (solo letras).");
                return;
            }

            sessionStorage.setItem('asesorName', nombre);
            const primerNombre = nombre.split(' ')[0];
            displayTag.innerHTML = `<span>Bienvenido, ${primerNombre}</span>`;

            overlay.classList.add('hidden');
            app.classList.remove('hidden');
        });
    }
});
