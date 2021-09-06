# Proyecto Peliculas con Express y NodeJs - EJS

Proyecto de Inventario de Peliculas con uso de NodeJS con Express y EJS como motor de vistas,Donde se podran añardir peliculas en el usuario administrador tanto como eliminarnarlas y el usuario puede comprar las peliculas en venta por el andrmistrador todo esto utilizando un archivo json simulando una base de datos.

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
    |    ├── indexUser.ejs
    |    ├── Login.ejs
    |    ├── 404.ejs
    |    ├── newMovie.ejs
    |    └── templates/
    |    		├── header.ejs
    |    		├── navigation.ejs
    |    		├── navigationUser.ejs
    |    		├── headerLogin.ejs
    |    		└── footer.ejs
    └── public/css
    |    	├── main.css
    |    	└── style.css
    └── app.js
    |
    └── index.js
    |
    └── Movies.json.js

```
### Descripción de Carpetas
- `src` contiene los archivos y carpetas de todo el proyecto
- `routes` Contiene el archivo `index.js` que establece el enrutamiento de la aplicación
- `views` Contiene las vistas de la aplicación. Se usa el motor de plantillas EJS  
- `templates` se encuentran las plantillas que se importarán en las diferentes parte de cada página o documento HTML para no repetir código, se utilizo bootstrap5 para los estilos.
- `public\css` estilos, en el archivo `main.css` Se encuentra un archivo css con estilos para el body del html



# Instalacion Y Configuracion
```
npm install
npm run dev

```
> Puerto del Servidor: 5000

```
Admin:
Correo: Astrid@gmail.com   
Contraseña: Dudu123

Cuenta Usuario:
Correo: Usuario@gmail.com
Contraseña: User1

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
const session = require("express-session");
const uuidv4 = require('uuid/v4');

const app = express();

// Settings
app.set('port', 5000);
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(logger('dev'));
app.use(express.urlencoded({extended: false}));

app.use(session({
  secret: uuidv4(), 
  resave: false,
  saveUninitialized: true
}));
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

const  credential = {
  email : "Astrid@gmail.com",
  password : "Dudu123"
}

const  credential2 = {
  email : "Usuario@gmail.com",
  password : "User1"
}

const json_Movies = fs.readFileSync('src/Movies.json', 'utf-8');
let Movies = JSON.parse(json_Movies);

router.get('/', (req, res) =>{
  res.render('Login', { title : "Inicie Sesion"});
})

router.post('/login', (req, res)=>{
  if(req.body.email == credential.email && req.body.password == credential.password){
      req.session.user = req.body.email;
      res.redirect('/index');
  }
  else if(req.body.email == credential2.email && req.body.password == credential2.password){
    req.session.user = req.body.email;
    res.redirect('/indexUser');
    
  }else{
      res.end("Invalid Username")
  }
});
router.get('/index', (req, res) => {
  res.render('index', { Movies});
});

router.get('/indexUser', (req, res) => {
  res.render('indexUser', { Movies});
});

router.get('/newMovie', (req, res) => {
  res.render('newMovie');
});

router.post('/newMovie', (req, res) => {

  const { title, gender, image, Duracion, description } = req.body;

  if (!title || !gender ||  !image  || ! Duracion || !description) {
    res.status(400).send("Entries must have a title and body");
    return;
  }

  var newMovie = {
    id: uuidv4(),
    title,
    gender,
    Duracion,
    image,
    description
  };

  // añadir una nueva pelicula
  Movies.push(newMovie);

  // guardando en un archivo la pelicula
  const json_Movies = JSON.stringify(Movies);
  fs.writeFileSync('src/Movies.json', json_Movies, 'utf-8');

  res.redirect('/index');
});

router.get('/Buy/:id', (req, res) => {
  Movies = Movies.filter(Movies => Movies.id != req.params.id);
  // guardando
  const json_Movies = JSON.stringify(Movies);
  fs.writeFileSync('src/Movies.json', json_Movies, 'utf-8');

  res.redirect('/indexUser')
});

router.get('/delete/:id', (req, res) => {
  Movies = Movies.filter(Movies => Movies.id != req.params.id);
  // guardando
  const json_Movies = JSON.stringify(Movies);
  fs.writeFileSync('src/Movies.json', json_Movies, 'utf-8');

  res.redirect('/index')
});

module.exports = router;

``` 
> Se define un arreglo de Peliculas donde con ayuda de un archivo.json se llenara y ayudara en las vistas de la aplicacion,para gestionar lo datos
