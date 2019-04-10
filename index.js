'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

require('dotenv').config();

const ideaRouter = require('./routes/idearoute');
const userRouter = require('./routes/userroute');

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
/*
app.use(bodyParser.urlencoded({
    extended: true
}));*/
//app.use(bodyParser.raw({type: 'text/json' }));
app.use(bodyParser.json());

app.use('/ideas', ideaRouter);

app.use('/users', userRouter);

app.listen(3000);
