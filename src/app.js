const express = require("express");

const { auth } = require("express-oauth2-jwt-bearer");
const errorHandler = require("./middlewares/errorHandler");


require('dotenv').config();

// Configuracion Middleware con el Servidor de Autorización 
const autenticacion = auth({
  audience: "http://localhost:3000/api/biblioteca",
  issuerBaseURL: "https://dev-utn-frc-iaew.auth0.com/",
  tokenSigningAlg: "RS256",
});


const app = express();
app.use(express.json());

// Importamos el Router de Libros
const librosRouter = require("./routes/libros");

//Configuramos el middleware de autenticacion
app.use("/api/libros", autenticacion,  librosRouter);

// Datos de ejemplo para simular una lista de usuarios
const usuarios = [
  { id: 1, nombre: 'Usuario 1' },
  { id: 2, nombre: 'Usuario 2' },
  { id: 3, nombre: 'Usuario 3' }
];

// Ruta GET para obtener la lista de usuarios
app.get('/usuarios', (req, res) => {
  res.json(usuarios);
});

// Ruta GET para obtener los detalles de un usuario específico según su ID
app.get('/usuarios/:id', (req, res) => {
  const idUsuario = parseInt(req.params.id);
  const usuario = usuarios.find(user => user.id === idUsuario);

  if (usuario) {
    res.json(usuario);
  } else {
    res.status(404).json({ mensaje: 'Usuario no encontrado' });
  }
});

// Ruta POST para crear un nuevo usuario
app.post('/usuarios', (req, res) => {
  const nuevoUsuario = req.body;
  usuarios.push(nuevoUsuario);
  res.status(201).json(nuevoUsuario);
});

// Ruta PUT para actualizar la información de un usuario según su ID
app.put('/usuarios/:id', (req, res) => {
  const idUsuario = parseInt(req.params.id);
  const usuarioActualizado = req.body;

  usuarios = usuarios.map(user => {
    if (user.id === idUsuario) {
      return { ...user, ...usuarioActualizado };
    }
    return user;
  });

  res.json(usuarioActualizado);
});

// Ruta DELETE para eliminar un usuario según su ID
app.delete('/usuarios/:id', (req, res) => {
  const idUsuario = parseInt(req.params.id);
  usuarios = usuarios.filter(user => user.id !== idUsuario);
  res.json({ mensaje: 'Usuario eliminado exitosamente' });
});


app.use(errorHandler);

app.listen(3000, () => {
  console.log("Servidor iniciado en el puerto 3000");
});

module.exports = app;