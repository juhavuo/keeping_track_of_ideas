'use strict';

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
require('dotenv').config();

const mongoose = require('mongoose');

const fs = require('fs');
const https = require('https');
const cors = require('cors');
const http = require('http');

const session = require('express-session');
const passport = require('passport');

const sslkey = fs.readFileSync('ssl-key.pem');
const sslcert = fs.readFileSync('ssl-cert.pem');


const User = require('./models/user');

const ideaRouter = require('./routes/idearoute');
const userRouter = require('./routes/userroute');

const options = {
  key: sslkey,
  cert: sslcert
};

const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(
  (username, password, done) => {

    User.findOne({
        username: username
      })
      .exec()
      .then(result => {

        if (result != null) { //username exists in database
          console.log(result);
          const hash = result.password
          console.log(hash);
          bcrypt.compare(password, hash).then(bcryptRes => {

            if (bcryptRes) {
              console.log('bcrypt = success');
              console.log(result);
              return done(null, result, {
                message: 'login successful'
              });
              //
            } else {
              console.log('bcryptRes = false');
              done(null, false, {
                message: 'Login failed'
              });

              return;
            }
          }).catch(bcryptError => {
            done(null, false, {
              message: 'Login error'
            });
            return;
          })
        } else { //username doesn't exist in database
          done(null, false, {
            message: 'Login failed'
          });
          return;
        }
      })
      .catch(findError => {
        done(null, false, {
          message: 'Login error'
        });
        return;

      })
  }));

passport.serializeUser((user, done) => {
  console.log("user serialization -begin-")
  console.log(user);
  console.log("user serializetion -end-");
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log('DESERIALIZATION');
  done(null, user);

});

//require('./config/passport')(passport);

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { //secure: true,
    httpOnly: false,
    maxAge: 5 * 60 * 60 * 1000
  } // 2 hours
}));

app.use(passport.initialize());
app.use(passport.session());

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







app.use(bodyParser.json());

app.use('/ideas', ideaRouter);

app.use('/users', userRouter);

app.get('/test', (req, res) => {
  const result = res;
  console.log(result);
  res.status(200).json({
    'message': 'check console'
  });
});

app.get('/', (req, res) => {
  res.send('Is something here?');
});

https.createServer(options, app).listen(3000);
/*
http.createServer((req, res) => {
      res.writeHead(301, { 'Location': 'https://localhost:3000' + req.url });
      res.end();
}).listen(8080);*/
