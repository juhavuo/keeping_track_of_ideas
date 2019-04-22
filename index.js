'use strict';

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
//const cookieParser = require('cookie-parser');

require('dotenv').config();

const ideaRouter = require('./routes/idearoute');
const userRouter = require('./routes/userroute');

const mongoose = require('mongoose');

const fs = require('fs');
const https =require('https');
//const http = require('http');

const session = require('express-session');
const passport = require('passport');

const sslkey = fs.readFileSync('ssl-key.pem');
const sslcert = fs.readFileSync('ssl-cert.pem')

const options = {
      key: sslkey,
      cert: sslcert
};

mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}:${process.env.DB_PORT}/ideas`, {
  useNewUrlParser: true
}).then(() => {
  console.log('Connected successfully.');
}, err => {
  console.log('Connection to db failed: ' + err);
});

mongoose.set('useCreateIndex', true);

//app.use(cookieParser);

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: false,
  cookie: { secure: true,
    maxAge: 2 * 60 * 60 * 1000} // 2 hours
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((u, done) => {
  console.log("user")
  console.log(u.user);
  done(null, u.user);
});

passport.deserializeUser((u, done) => {
  console.log('deserializing user: ' + u.user);
  done(null, u.user);

});

app.get('/test', (req,res) =>{
  res.send('Hello world')
});

app.get('/', (req,res) =>{
  res.send('Is something here?');
});
/*
app.use(bodyParser.urlencoded({
    extended: true
}));*/
//app.use(bodyParser.raw({type: 'text/json' }));
app.use(bodyParser.json());

app.use('/ideas', ideaRouter);

app.use('/users', userRouter);

https.createServer(options, app).listen(3000);
/*
http.createServer((req, res) => {
      res.writeHead(301, { 'Location': 'https://localhost:3000' + req.url });
      res.end();
}).listen(8080);*/
