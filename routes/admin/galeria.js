var express = require('express');
var router = express.Router();
var galeriaModel = require('../../models/galeriaModel');
var cloudinary = require('cloudinary').v2;

// ---------- LISTADO ----------
router.get('/', async function (req, res, next) {
  var fotos = await galeriaModel.getFotos();

  // A cada foto le agregamos una miniatura (etiqueta <img> completa de Cloudinary)
  fotos = fotos.map(foto => {
    return {
      ...foto,
      imagen: cloudinary.image(foto.img_id, {
        width: 80,
        height: 80,
        crop: 'fill',
        secure: true
      })
    };
  });

  res.render('admin/galeria', {
    layout: 'admin/layout',
    usuario: req.session.nombre,
    fotos
  });
});

// ---------- AGREGAR ----------
router.get('/agregar', (req, res, next) => {
  res.render('admin/agregar', {
    layout: 'admin/layout'
  });
});

router.post('/agregar', async (req, res, next) => {
  try {
    var titulo = (req.body.titulo || '').trim();
    var archivo = req.files && req.files.imagen;

    if (titulo !== '' && archivo && archivo.mimetype.startsWith('image/')) {
      // Subimos la imagen a Cloudinary y guardamos el id público que nos devuelve
      var resultado = await cloudinary.uploader.upload(archivo.tempFilePath);
      await galeriaModel.insertFoto({
        titulo: titulo,
        img_id: resultado.public_id
      });
      res.redirect('/admin/galeria');
    } else {
      res.render('admin/agregar', {
        layout: 'admin/layout',
        error: true,
        message: 'Completá el título y elegí una imagen (JPG, PNG, etc.)'
      });
    }
  } catch (error) {
    console.log(error);
    res.render('admin/agregar', {
      layout: 'admin/layout',
      error: true,
      message: 'No se pudo cargar la foto'
    });
  }
});

// ---------- ELIMINAR ----------
router.get('/eliminar/:id', async (req, res, next) => {
  var id = req.params.id;
  var foto = await galeriaModel.getFotoById(id);

  if (foto) {
    // Borramos la foto de la base y también de Cloudinary
    await galeriaModel.deleteFotoById(id);
    await cloudinary.uploader.destroy(foto.img_id);
  }
  res.redirect('/admin/galeria');
});

// ---------- MODIFICAR ----------
router.get('/modificar/:id', async (req, res, next) => {
  var id = req.params.id;
  var foto = await galeriaModel.getFotoById(id);

  if (!foto) {
    return res.redirect('/admin/galeria');
  }

  foto.imagen = cloudinary.image(foto.img_id, {
    width: 200,
    crop: 'limit',
    secure: true
  });

  res.render('admin/modificar', {
    layout: 'admin/layout',
    foto
  });
});

router.post('/modificar', async (req, res, next) => {
  try {
    var titulo = (req.body.titulo || '').trim();
    var img_id = req.body.img_original;      // id de la imagen actual (campo oculto)
    var archivo = req.files && req.files.imagen;
    var borrar_img_vieja = false;

    if (titulo === '') {
      throw new Error('El título es obligatorio');
    }

    // Si eligieron una imagen nueva, la subimos y la anterior se borrará
    if (archivo && archivo.mimetype.startsWith('image/')) {
      var resultado = await cloudinary.uploader.upload(archivo.tempFilePath);
      img_id = resultado.public_id;
      borrar_img_vieja = true;
    }

    await galeriaModel.modificarFotoById({ titulo, img_id }, req.body.id);

    if (borrar_img_vieja && req.body.img_original) {
      await cloudinary.uploader.destroy(req.body.img_original);
    }

    res.redirect('/admin/galeria');
  } catch (error) {
    console.log(error);
    var foto = await galeriaModel.getFotoById(req.body.id);
    if (foto) {
      foto.imagen = cloudinary.image(foto.img_id, { width: 200, crop: 'limit', secure: true });
    }
    res.render('admin/modificar', {
      layout: 'admin/layout',
      foto,
      error: true,
      message: 'No se modificó la foto. Revisá que el título no esté vacío.'
    });
  }
});

module.exports = router;