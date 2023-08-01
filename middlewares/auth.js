const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationError');

module.exports = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    next(new AuthorizationError('Необходима авторизация'));
  }

  let payload;
  try {
    payload = jwt.verify(token, 'key');
  } catch (err) {
    next(new AuthorizationError('Необходима авторизация'));
  }

  req.user = payload;
  next();
};
