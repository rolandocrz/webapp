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


const puerto = 3000;
app.listen(puerto, () => {
    console.log(`El servidor esta funcionando en el puerto ${puerto}`);
});
