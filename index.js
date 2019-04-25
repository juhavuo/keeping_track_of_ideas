'use strict';

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const ideaRouter = require('./routes/idearoute');
const userRouter = require('./routes/userroute');

const mongoose = require('mongoose');

const fs = require('fs');
const https =require('https');
const cors = require('cors');
//const http = require('http');

const session = require('express-session');
const passport = require('passport');

const sslkey = fs.readFileSync('ssl-key.pem');
const sslcert = fs.readFileSync('ssl-cert.pem');

const User = require('./models/user');

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
//app.use(cors);
/*
app.use((req, res, next) => {
console.log('am I doing something');
res.header("Access-Control-Allow-Origin", "http://localhost:4200");
res.header("Access-Control-Allow-Credentials", true);
res.header(
"Access-Control-Allow-Headers",
"Origin, X-Requested-With, Content-Type, Accept"
);
next();
});*/

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { //secure: true,
    maxAge: 2 * 60 * 60 * 1000} // 2 hours
}));
app.use(passport.initialize());
app.use(passport.session());



passport.serializeUser((user, done) => {
  console.log("user serialization -begin-")
  console.log(user.user);
  console.log("user serializetion -end-");
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log('DESERIALIZATION');
  done(null, user);

});



/*
app.use(bodyParser.urlencoded({
    extended: true
}));*/
//app.use(bodyParser.raw({type: 'text/json' }));
app.use(bodyParser.json());

app.use('/ideas', ideaRouter);

app.use('/users', userRouter);

app.get('/test', (req,res) =>{
  const result = res;
  console.log(result);
  res.status(200).json({'message':'check console'});
});

app.get('/', (req,res) =>{
  res.send('Is something here?');
});

https.createServer(options, app).listen(3000);
/*
http.createServer((req, res) => {
      res.writeHead(301, { 'Location': 'https://localhost:3000' + req.url });
      res.end();
}).listen(8080);*/
