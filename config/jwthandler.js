const jwt = require('jsonwebtoken');

//needed, when using token to verify user
exports.verifyToken = (req, res, next) => {

  const authToken = req.headers['token'];

  if(typeof authToken !== 'undefined') {
    req.token = authToken;
    next();
  } else {
    res.sendStatus(403);
  }

}
