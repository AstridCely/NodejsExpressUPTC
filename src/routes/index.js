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