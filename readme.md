# Proyecto Peliculas con Express y Notejs - EJS

Proyecto de Peliculas con uso de NodeJS con Express y EJS como motor de vistas,Donde se podran añardir peliculas y eliminar utilizando un archivo json simulando una base de datos 

# Extructura del Proyecto

```bash
├── readme.md
├── package-lock.json
├── package.json
└── src
    └── routes/
    | 	    ├── index.js
    └── views/
    |    ├── index.ejs
    |    ├── 404.ejs
    |    ├── newMovie.ejs
    |    └── templates/
    |    		├── header.ejs
    |    		├── navigation.ejs
    |    		└── footer.ejs
    └── public/css
    |    	└── main.css
    └── app.js

```
### Descripción de Carpetas
- `src` contiene los archivos y carpetas de todo el proyecto
- `routes` Contiene el archivo `index.js` que establece el enrutamiento de la aplicación
- `views` Contiene las vistas de la aplicación. Se usa el motor de plantillas EJS  
- `templates` se encuentran las plantillas que se importarán en las diferentes parte de cada página o documento HTML para no repetir código, se utilizo bootstrap5 para los estilos.
- `public\css` estilos, en el archivo `main.css` Se encuentra un archivo css con estilos para el body del html



# Instalacion Y Configuracion
```
npm init
npm i express --save
npm i ejs --save
npm i nodemon --save-dev
npm i morgan
npm i uuidv4

```

### Archivo index.js

El Archivo `index.js` es donde se inicia el servidor tiene el siguiente contenido:

```javascript

const app = require('./app');

async function main() {
    await app.listen(app.get('port'));
    console.log('Server on port', app.get('port'));
}

main();

``` 
### Archivo app.js

El Archivo `app.js` es donde se configura la aplicación, tiene el siguiente contenido:


```javascript

const express = require('express');
const path    = require('path');
const logger  = require('morgan');

const app = express();

// Settings
app.set('port', 5000);
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(logger('dev'));
app.use(express.urlencoded({extended: false}));

// Routes
app.use(require('./routes/index'));

app.use(express.static(path.join(__dirname, 'public')));

// 404 
app.use((req, res, next) => {
  res.status(404).render('404');
});

module.exports = app;

``` 
### Archivo routes/index.js

Es el archivo en donde se configuran las rutas, tiene el siguiente conrtenido

```javascript

const express = require('express');
const router = express.Router();
const fs = require('fs');
const uuidv4 = require('uuid/v4');

const json_Movies = fs.readFileSync('src/Movies.json', 'utf-8');
let Movies = JSON.parse(json_Movies);

router.get('/', (req, res) => {
  res.render('index', { Movies});
});

router.get('/newMovie', (req, res) => {
  res.render('newMovie');
});

router.post('/newMovie', (req, res) => {

  const { title, author, image, description } = req.body;

  if (!title || !author || !image || !description) {
    res.status(400).send("Entries must have a title and body");
    return;
  }

  var newMovie = {
    id: uuidv4(),
    title,
    author,
    image,
    description
  };

  // añadir una nueva pelicula
  Movies.push(newMovie);

  // guardando en un archivo la pelicula
  const json_Movies = JSON.stringify(Movies);
  fs.writeFileSync('src/Movies.json', json_Movies, 'utf-8');

  res.redirect('/');
});

router.get('/delete/:id', (req, res) => {
  Movies = Movies.filter(Movies => Movies.id != req.params.id);

  // guardando
  const json_Movies = JSON.stringify(Movies);
  fs.writeFileSync('src/Movies.json', json_Movies, 'utf-8');

  res.redirect('/')
});

module.exports = router;

``` 
> Se define un arreglo de Peliculas donde con ayuda de un archivo.json se llenara y ayudara en las vistas de la aplicacion,para gestionar lo datos
