const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

const users = require('./routes/users'); 
app.use('/users', users); 

const libraryRoutes = require('./routes/library');
app.use('/library', libraryRoutes);

module.exports = app;






