const express = require('express');
const app = express();

// Files routes
const auth = require('./app/auth/index');
const profile = require('./app/profile/index');
const home = require('./app/home/index');
const postings = require('./app/postings/index');

// Routes here
app.use('/auth', auth);
app.use('/profile', profile);
app.use('/home', home);
app.use('/postings', postings);

module.exports = app;