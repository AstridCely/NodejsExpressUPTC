const express = require('express');
const path    = require('path');
const logger  = require('morgan');
const session = require("express-session");
const uuidv4 = require('uuid/v4');
const Swal = require('sweetalert2');

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