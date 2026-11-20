var express = require('express');
var router = express.Router();
var usuariosModel = require('../../models/usuariosModel');

// Muestra el formulario de login
router.get('/', function (req, res, next) {
  res.render('admin/login', {
    layout: 'admin/layout'
  });
});

// Cierra la sesión
router.get('/logout', function (req, res, next) {
  req.session.destroy();
  res.redirect('/admin/login');
});

// Recibe usuario y contraseña del formulario
router.post('/', async (req, res, next) => {
  try {
    var usuario = req.body.usuario;
    var password = req.body.password;

    var data = await usuariosModel.getUserByUsernameAndPassword(usuario, password);

    if (data != undefined) {
      req.session.id_usuario = data.id;
      req.session.nombre = data.usuario;
      res.redirect('/admin/galeria');
    } else {
      res.render('admin/login', {
        layout: 'admin/layout',
        error: true
      });
    }
  } catch (error) {
    console.log(error);
    res.render('admin/login', {
      layout: 'admin/layout',
      error: true
    });
  }
});

module.exports = router;