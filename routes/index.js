const router = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');
const usersRouter = require('./users/users');
const cardsRouter = require('./cards/cards');
const signinRouter = require('./signin/signin');
const signupRouter = require('./signup/signup');
const auth = require('../middlewares/auth');

router.use('/signin', signinRouter);
router.use('/signup', signupRouter);
router.use(auth);
router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('*', (req, res, next) => {
  next(new NotFoundError('Неправильный путь'));
});

module.exports = router;
