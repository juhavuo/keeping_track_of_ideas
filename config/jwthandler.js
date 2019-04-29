const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  // Get auth header value
  console.log(req.headers['authorization']);
  const bearerHeader = req.headers['authorization'];
  console.log('header');
  console.log(bearerHeader);
  // Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }

}
