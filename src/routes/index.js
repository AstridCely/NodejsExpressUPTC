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