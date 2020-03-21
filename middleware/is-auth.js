const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) { // if no Authorization
    req.isAuth = false;
    return next();
  }
  const token = authHeader.split(' ')[1]; // authHeader = Bearer sfsf => token = sfsf
  if (!token || token === '') {
    req.isAuth = false;
    return next();
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'supersecretkey'); // verify jwt token
  } catch (err) { throw err }

  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }
  req.isAuth = true;
  req.userId = decodedToken.userId;
  return next();
}