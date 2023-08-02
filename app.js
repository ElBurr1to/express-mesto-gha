const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const signinRouter = require('./routes/signin');
const signupRouter = require('./routes/signup');
const errorHandler = require('./middlewares/errorHandler');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');

const { PORT } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {});

app.use('/signin', signinRouter);
app.use('/signup', signupRouter);
app.use(auth);
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use('*', (req, res, next) => {
  next(new NotFoundError('Неправильный путь'));
});
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {});
