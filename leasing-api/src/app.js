const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
const debugLog = require('debug');
const routeDefinitions = require('./routes/definitions');
const connectMongodb = require('./db');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

function handleAppListening() {
  connectMongodb()
    .then(() => {
      // eslint-disable-nextline
      debugLog('Mongodb Connected');
    })
    .catch((err) => {
      debugLog('Mongodb Connected');
    });
}

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

routeDefinitions(app);

app.on('listening', handleAppListening);

module.exports = app;
