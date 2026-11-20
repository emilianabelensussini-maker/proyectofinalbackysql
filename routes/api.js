var express = require('express');
var router = express.Router();
var galeriaModel = require('../models/galeriaModel');
var cloudinary = require('cloudinary').v2;
var nodemailer = require('nodemailer');

// GET /api/galeria  ->  lista de fotos para el sitio React
router.get('/galeria', async function (req, res, next) {
  try {
    var fotos = await galeriaModel.getFotos();

    fotos = fotos.map(foto => {
      return {
        id: foto.id,
        titulo: foto.titulo,
        // URL de la imagen: ancho máximo 1000px, sin deformarla
        imagen: cloudinary.url(foto.img_id, {
          width: 1000,
          crop: 'limit',
          secure: true
        })
      };
    });

    res.json(fotos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: 'No se pudo obtener la galería' });
  }
});

// POST /api/contacto  ->  recibe el formulario de contacto y envía un mail
router.post('/contacto', async (req, res) => {
  try {
    var { nombre, email, telefono, mensaje } = req.body;

    if (!nombre || !email || !mensaje) {
      return res.status(400).json({
        error: true,
        message: 'Completá al menos nombre, correo y mensaje'
      });
    }

    var mail = {
      to: process.env.MAIL_TO,
      replyTo: email,
      subject: 'Contacto web',
      text: nombre + ' se contactó a través de la web.\n' +
            'Correo: ' + email + '\n' +
            'Teléfono: ' + (telefono || 'no informado') + '\n' +
            'Comentario: ' + mensaje
    };

    var transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transport.sendMail(mail);

    res.status(201).json({ error: false, message: 'Mensaje enviado' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: 'No se pudo enviar el mensaje' });
  }
});

module.exports = router;