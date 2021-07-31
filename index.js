require('./src/config/server');
require('./src/config/database');
require('colors');
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views')

app.use(cors());

app.options('*', cors());

app.use(require('./src/routes/main'));

app.use(express.static(path.resolve(__dirname, 'public')));

app.listen(process.env.PORT, () => {
    console.log(`Listo dev ${process.env.PORT}`.blue);
});