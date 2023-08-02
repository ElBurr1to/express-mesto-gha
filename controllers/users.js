const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const AuthorizationError = require('../errors/AuthorizationError');
const AlreadyExistsError = require('../errors/AlreadyExistsError');

function getUsers(req, res, next) {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
}

function createUser(req, res, next) {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        next(new AlreadyExistsError('Пользователь с такой почтой уже существует'));
      }
    });

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      password: hash,
      email,
    }))
    .then((user) => {
      res.status(201).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      });
    })
    .catch(next);
}

function getUserById(req, res, next) {
  const { userId } = req.params;
  if (!mongoose.isValidObjectId(userId)) {
    next(new ValidationError('Некорректный Id'));
  }

  User.findById(userId)
    .orFail(new NotFoundError('Указанный Id пользователя не найден'))
    .then((user) => {
      res.send(user);
    })
    .catch(next);
}

function getSelf(req, res, next) {
  const userId = req.user._id;
  if (!mongoose.isValidObjectId(userId)) {
    next(new ValidationError(JSON.stringify(req)));
  }

  User.findById(userId)
    .orFail(new NotFoundError('Указанный Id пользователя не найден'))
    .then((user) => {
      res.send(user);
    })
    .catch(next);
}

function updateProfile(req, res, next) {
  const userId = req.user._id;
  const { name, about } = req.body;
  if (!mongoose.isValidObjectId(userId)) {
    next(new ValidationError('Некорректный Id'));
  }

  User.findByIdAndUpdate(
    userId,
    {
      name,
      about,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new NotFoundError('Указанный Id пользователя не найден'))
    .then((user) => {
      res.send(user);
    })
    .catch(next);
}

function updateAvatar(req, res, next) {
  const userId = req.user._id;
  const { avatar } = req.body;
  if (!mongoose.isValidObjectId(userId)) {
    next(new ValidationError('Некорректный Id'));
  }

  User.findByIdAndUpdate(
    userId,
    {
      avatar,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new NotFoundError('Указанный Id пользователя не найден'))
    .then((user) => {
      res.send(user);
    })
    .catch(next);
}

function login(req, res, next) {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user.userId }, 'key', {
        expiresIn: '7d',
      });

      res
        .cookie('token', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .send({
          _id: user._id,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        });
    })
    .catch(() => {
      next(new AuthorizationError('При авторизации произошла ошибка'));
    });
}

module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateProfile,
  updateAvatar,
  login,
  getSelf,
};
