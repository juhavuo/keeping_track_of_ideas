const Ideacontroller = require('../controllers/ideacontroller');

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const session = require('express-session');
const passport = require('passport');

const cors = require('cors');

const Jwthandler = require('../config/jwthandler');

router.use(cors());
/*
const isLoggedIn = (req, res, next) => {
  console.log('inside isLoggedIn-function');
  console.log(req._passport);
  //console.log(req._passport.instance);
  return next();
}*/



router.post('/',Jwthandler.verifyToken, Ideacontroller.save_idea);

//for testing purposis, uses passport
router.post('/all', Ideacontroller.find_all_ideas);

//this should have authentication, but for now it is removed, NOT SECURE
router.post('/own',Jwthandler.verifyToken, Ideacontroller.find_all_ideas_from_user);

//get all public ideas, this is for all
router.get('/public', Ideacontroller.find_all_public_ideas);

router.get('/public/searchByTag/:t', Ideacontroller.find_public_ideas_by_tag);

//testing to get messages from certain time period
router.post('/public/timetest', Ideacontroller.find_public_ideas_certain_time);


//changing the posted idea form public to private or other way around, needs autohorization of that user added later
router.patch('/:ideaId/changeVisibility', Jwthandler.verifyToken, Ideacontroller.update_publicity_of_idea);

//delete the posted // IDEA
router.delete('/:ideaId', Jwthandler.verifyToken, Ideacontroller.delete_idea);

module.exports = router;
