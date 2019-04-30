const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  // Get auth header value

  const authToken = req.headers['token'];
  // Check if token is undefined
  if(typeof authToken !== 'undefined') {

    req.token = authToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }

}
