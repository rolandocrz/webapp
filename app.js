const http = require("http");
const express = require("express");
const fs = require("fs");
const path = require("path");

const { log } = require("console");
const { title, send } = require("process");
const { render } = require("ejs");

// Generar Objeto Principal
const app = express();
app.set("view engine", "ejs");

// Usar directorios publicos
app.use(
  "/bootstrap",
  express.static(__dirname + "/node_modules/bootstrap/dist")
);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Declarar un array de Objetos
let datos = JSON.parse(fs.readFileSync("datos.json", "utf-8"));
let productos = JSON.parse(fs.readFileSync("productos.json", "utf-8"));
let alumnos = JSON.parse(fs.readFileSync("alumnos.json", "utf-8"));

// Primer Peticion
app.get("/", (req, res) => {
  res.render("index", { titulo: "Listado de alumnos", listado: datos });
});

// Peticiones de las paginas
app.get("/practica1", (req, res) => {
  res.render("practica01", { numero: "" });
});
app.get("/practica2", (req, res) => {
  res.render("practica02");
});
app.get("/practica3", (req, res) => {
  res.render("practica03");
});

app.get("/cotizacion", (req, res) => {
  const params = {
    valorAuto: req.query.valorAuto,
    pinicial: req.query.pinicial,
    plazos: req.query.plazos,
  };
  res.render("practica02", params);
});

app.post("/cotizacion", (req, res) => {
  const params = {
    valorAuto: req.body.valorAuto,
    pinicial: req.body.pinicial,
    plazos: req.body.plazos,
  };
  res.render("practica02", params);
});

// Metodos practica 3 - pre examen
app.get("/nomina", (req, res) => {
  res.render("practica03", {
    numRecibo: "",
    nombre: "",
    puesto: "",
    nivel: "",
    diasTrabajados: "",
    calculoPago: "",
    calculoImpuesto: "",
    calculoTotal: "",
  });
});

app.post("/nomina", (req, res) => {
  const { numRecibo, nombre, puesto, nivel, diasTrabajados } = req.body;
  let sueldoBase;
  if (puesto === "1") sueldoBase = 100;
  else if (puesto === "2") sueldoBase = 200;
  else sueldoBase = 300;

  const pago = sueldoBase * diasTrabajados;
  let impuestoRate = nivel === "2" ? 0.03 : 0.05;
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
    calculoTotal: total,
  };

  res.render("practica03", params);
});

// Metodos preExamen
app.get("/preexamen", (req, res) => {
  res.render("preexamen", {
    titulo: "Filtrar Productos por Tipo",
    productos: [],
    totalCosto: 0,
    totalCostoVenta: 0,
    totalCantidad: 0,
    ganancia: 0,
  });
});

// funcion filtrar
app.get("/filtrar", (req, res) => {
  let tipoSeleccionado = parseInt(req.query.tipo);
  let productosFiltrados = productos.filter((p) => p.tipo === tipoSeleccionado);

  let totalCosto = productosFiltrados.reduce(
    (sum, p) => sum + p.costo * p.cantidad,
    0
  );
  let totalCostoVenta = productosFiltrados.reduce(
    (sum, p) => sum + p.costo * 1.15 * p.cantidad,
    0
  );
  let totalCantidad = productosFiltrados.reduce(
    (sum, p) => sum + p.cantidad,
    0
  );
  let ganancia = totalCostoVenta - totalCosto;

  res.render("preexamen", {
    titulo: "Filtrar Productos por Tipo",
    productos: productosFiltrados,
    totalCosto,
    totalCostoVenta,
    totalCantidad,
    ganancia,
  });
});

// METODOS EXAMEN
app.get("/examen", (req, res) => {
  res.render("examen", {
    alumnos: alumnos,
    filtrarAlumnos: [],
    nivel: "Todos",
    turno: "Todos",
    tipoVista: "Resumen",
    mostrarDatos: false,
  });
});

app.get("/alumnos", (req, res) => {
  const { nivel, turno, tipoVista } = req.query;

  let filtrarAlumnos = alumnos;

  if (nivel !== "Todos") {
    filtrarAlumnos = filtrarAlumnos.filter((alumno) => alumno.nivel == nivel);
  }

  if (turno !== "Todos") {
    filtrarAlumnos = filtrarAlumnos.filter((alumno) => alumno.turno == turno);
  }

  // Mostrar
  res.render("examen", {
    alumnos: alumnos,
    filtrarAlumnos: filtrarAlumnos,
    nivel,
    turno,
    tipoVista,
    mostrarDatos: true,
  });
});

// Metodo Post (p01)
app.post("/p01", (req, res) => {
  // Parametros para recibir datos del form
  const params = {
    numero: req.body.numero,
  };

  // Body: Cuando los datos viene de un form por el metodo post
  // Usa libreria

  res.render("practica01", params);
});

const puerto = 3000;
app.listen(puerto, () => {
  console.log(`El servidor esta funcionando en el puerto ${puerto}`);
});
