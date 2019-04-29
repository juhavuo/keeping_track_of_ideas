const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');


module.exports = (passport) => {
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
                return done(null, result, {message: 'login successful'});
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
}
