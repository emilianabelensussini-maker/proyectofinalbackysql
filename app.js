// Carga las variables del archivo .env (debe ser lo PRIMERO)
require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var os = require('os');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var fileUpload = require('express-fileupload');
var cors = require('cors');

var loginRouter = require('./routes/admin/login');
var adminGaleriaRouter = require('./routes/admin/galeria');
var apiRouter = require('./routes/api');

var app = express();

// Motor de vistas (Handlebars)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Sesiones (para el login del administrador)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

// Subida de archivos (se guardan temporalmente y de ahí se envían a Cloudinary)
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: os.tmpdir()
}));

// Middleware que protege rutas: solo deja pasar si hay un usuario logueado
const secured = (req, res, next) => {
  if (req.session.id_usuario) {
    next();
  } else {
    res.redirect('/admin/login');
  }
};

// Rutas
app.get('/', (req, res) => res.redirect('/admin/login'));
app.use('/admin/login', loginRouter);
app.use('/admin/galeria', secured, adminGaleriaRouter);
app.use('/api', cors(), apiRouter);

// 404
app.use(function (req, res, next) {
  next(createError(404));
});

// Manejo de errores
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;