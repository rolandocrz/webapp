const http = require('http');
const express = require('express');
const fs = require('fs');
const path = require('path');

const { log } = require('console');
const { title, send } = require('process');
const { render } = require('ejs');

// Generar Objeto Principal
const app = express();
app.set("view engine", "ejs");

// Usar directorios publicos
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Declarar un array de Objetos
let datos = JSON.parse(fs.readFileSync('datos.json', 'utf-8'));

// Primer Peticion
app.get('/', (req, res) => {
    res.render('index', { titulo: "Listado de alumnos", listado: datos });
});


// Peticiones de las paginas
app.get('/practica1', (req, res) => {
    res.render('practica01', { numero: "" });
})
app.get('/practica2', (req, res) => {
    res.render('practica02');
})
app.get('/practica3', (req, res) => {
    res.render('practica03');
})

app.get('/cotizacion', (req, res) => {
    const params = {
        valorAuto: req.query.valorAuto,
        pinicial: req.query.pinicial,
        plazos: req.query.plazos
    }
    res.render('practica02', params);
})

app.post('/cotizacion', (req, res) => {
    const params = {
        valorAuto: req.body.valorAuto,
        pinicial: req.body.pinicial,
        plazos: req.body.plazos
    }
    res.render('practica02', params);
})

// Metodos practica 3 - pre examen
app.get('/nomina', (req, res) => {
    res.render('practica03', {
        numRecibo: '',
        nombre: '',
        puesto: '',
        nivel: '',
        diasTrabajados: '',
        calculoPago: '',
        calculoImpuesto: '',
        calculoTotal: ''
    });
});

app.post('/nomina', (req, res) => {
    const { numRecibo, nombre, puesto, nivel, diasTrabajados } = req.body;
    let sueldoBase;
    if (puesto === '1') sueldoBase = 100;
    else if (puesto === '2') sueldoBase = 200;
    else sueldoBase = 300;

    const pago = sueldoBase * diasTrabajados;
    let impuestoRate = nivel === '2' ? 0.03 : 0.05;
    const impuesto = pago * impuestoRate;
    const total = pago - impuesto;

    const params = {
        numRecibo,
        nombre,
        puesto,
        nivel,
        diasTrabajados,
        calculoPago: pago,
        calculoImpuesto: impuesto,
        calculoTotal: total
    };

    res.render('practica03', params);
});






// Metodo Post (p01)
app.post('/p01', (req, res) => {
    // Parametros para recibir datos del form
    const params = {
        numero: req.body.numero
    }

    // Body: Cuando los datos viene de un form por el metodo post
    // Usa libreria

    res.render('practica01', params)
});

const puerto = 3000;
app.listen(puerto, () => {
    console.log(`El servidor esta funcionando en el puerto ${puerto}`);
});
