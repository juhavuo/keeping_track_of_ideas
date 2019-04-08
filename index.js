'use strict';

const express = require('express');
const app = express();

require('dotenv').config();

const mongoose = require('mongoose');

mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}:${process.env.DB_PORT}/ideas`, {
  useNewUrlParser: true
}).then(() => {
  console.log('Connected successfully.');
}, err => {
  console.log('Connection to db failed: ' + err);
});

app.get('/test', (req,res) =>{
  res.send('Hello world')
});

app.listen(process.env.APP_PORT);
