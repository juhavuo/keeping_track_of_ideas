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

router.post('/',Jwthandler.verifyToken, Ideacontroller.save_idea);

//for testing purposis, needs LOCAL_ADMIN credentials
router.post('/all', Ideacontroller.find_all_ideas);

//view ideas of one user
router.post('/own',Jwthandler.verifyToken, Ideacontroller.find_all_ideas_from_user);

//get all public ideas, this is for all
router.get('/public', Ideacontroller.find_all_public_ideas);

router.get('/public/searchByTag/:t', Ideacontroller.find_public_ideas_by_tag);

//testing to get messages from certain time period
router.post('/public/timetest', Ideacontroller.find_public_ideas_certain_time);


//changing the posted idea form public to private or other way around, needs autohorization of that user added later
router.patch('/:ideaId/changeVisibility', Jwthandler.verifyToken, Ideacontroller.update_publicity_of_idea);

router.patch('/:ideaId/addLike', Jwthandler.verifyToken, Ideacontroller.add_like_to_idea);

//delete the posted // IDEA
router.delete('/:ideaId', Jwthandler.verifyToken, Ideacontroller.delete_idea);

router.patch('/:ideaId/addComment', Jwthandler.verifyToken, Ideacontroller.add_comment_to_idea);

module.exports = router;
