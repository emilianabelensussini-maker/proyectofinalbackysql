# Hospedaje Güemes

Sitio web de un hospedaje, con una parte pública para los huéspedes y un panel de administración para cargar las fotos de la galería.

**Trabajo final – Práctica II**
**Carrera:** Desarrollo de Software
**Alumna:** Emiliana Belén Sussini

---

## Descripción

**Tema del proyecto:** sitio web institucional para el _Hospedaje Güemes_, que ofrece alojamiento con desayuno y cochera.

El sitio público (React) tiene cuatro secciones:

| Sección      | Qué muestra                                                                            |
| ------------ | -------------------------------------------------------------------------------------- |
| **Home**     | Foto de portada del hospedaje, condiciones de reserva y horarios de ingreso y egreso.  |
| **Precios**  | Tarifas según la cantidad de personas (de 1 a 6) y formas de pago.                     |
| **Galería**  | Fotos del departamento y del monoambiente, cargadas desde la base de datos.            |
| **Contacto** | Formulario de contacto que envía un mail al hospedaje, y otros medios de comunicación. |

El panel de administración (Node + Handlebars) permite iniciar sesión y gestionar las fotos de la galería, que se almacenan en Cloudinary.

El diseño es responsive: se adapta a celular, tablet y computadora.

## Tecnologías utilizadas

**Frontend**

- React 19 (Create React App)
- React Router DOM 7
- Axios
- CSS puro (diseño responsive con Grid y Flexbox)

**Backend**

- Node.js y Express
- Handlebars (hbs) para las vistas del panel de administración
- MySQL / MariaDB (paquete `mysql`)
- express-session (sesiones del login)
- Cloudinary y express-fileupload (subida de imágenes)
- Nodemailer (envío de mails del formulario de contacto)
- CORS, dotenv, md5

## Estructura del proyecto

```
proyecto-final/
├── frontend/          → aplicación React
├── backend/           → servidor Node
    ├──database/
       └── proyecto.sql   → script de la base de datos
    └── README.md          → descripción, instalación y usuario de prueba
```

## Requisitos previos

- [Node.js](https://nodejs.org/) (versión 18 o superior) y npm
- MySQL o MariaDB (por ejemplo, con XAMPP y phpMyAdmin)
- Una cuenta gratuita de [Cloudinary](https://cloudinary.com/) (para subir fotos desde el panel)
- Una cuenta de correo con acceso SMTP (para que funcione el formulario de contacto)

## 1. Importar la base de datos

El archivo `database/proyecto.sql` crea las tablas `galeria` y `usuarios` con datos de ejemplo.

**Con phpMyAdmin**

1. Crear una base de datos nueva llamada `hguemes` (cotejamiento `utf8_unicode_ci`).
2. Seleccionarla y entrar en la pestaña **Importar**.
3. Elegir el archivo `database/proyecto.sql` y presionar **Importar**.

**Con la terminal**

```bash
mysql -u root -p -e "CREATE DATABASE hguemes CHARACTER SET utf8 COLLATE utf8_unicode_ci;"
mysql -u root -p hguemes < database/proyecto.sql
```

## 2. Instalar y ejecutar el Backend

```bash
cd backend
npm install
```

Crear un archivo `.env` dentro de `backend/` (se puede copiar de `.env.example`) con estas variables:

```env
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DB_NAME=hguemes

SESSION_SECRET=un_texto_secreto_cualquiera

CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME

SMTP_HOST=smtp.ejemplo.com
SMTP_PORT=587
SMTP_USER=usuario@ejemplo.com
SMTP_PASS=clave_smtp
MAIL_TO=correo_que_recibe_los_mensajes@ejemplo.com
```

Iniciar el servidor:

```bash
npm start
```

El backend queda corriendo en **http://localhost:3000**.

## 3. Instalar y ejecutar el Frontend

En otra terminal:

```bash
cd frontend
npm install
```

Crear un archivo `.env` dentro de `frontend/` (se puede copiar de `.env.example`):

```env
REACT_APP_API_URL=http://localhost:3000
PORT=3001
```

Iniciar la aplicación:

```bash
npm start
```

El sitio se abre en **http://localhost:3001**.

> Importante: el backend debe estar corriendo para que funcionen la **Galería** y el formulario de **Contacto**. Si se modifica el archivo `.env`, hay que reiniciar el servidor correspondiente.

Para generar la versión de producción del frontend:

```bash
npm run build
```

## Usuario de prueba para el login

El panel de administración se abre en **http://localhost:3000/admin/login**.

| Usuario | Contraseña |
| ------- | ---------- |
| `admin` | `sussini`  |

Después de iniciar sesión se accede a la gestión de la galería, donde se pueden ver, agregar, modificar y eliminar fotos. Para cerrar la sesión se usa la opción _Cerrar sesión_ del panel.

## Endpoints de la API

| Método | Ruta            | Descripción                                                                     |
| ------ | --------------- | ------------------------------------------------------------------------------- |
| `GET`  | `/api/galeria`  | Devuelve la lista de fotos (id, título y URL de la imagen).                     |
| `POST` | `/api/contacto` | Recibe `nombre`, `email`, `telefono` y `mensaje`, y envía el mail al hospedaje. |

## Autora

Emiliana Belén Sussini – Trabajo final de Práctica II, carrera Desarrollo de Software.
