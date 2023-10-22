const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

const users = require('./routes/users'); // Requer as rotas de usuários
app.use('/users', users); // Usa as rotas de usuários

const libraryRoutes = require('./routes/library');
app.use('/library', libraryRoutes);

module.exports = app;






