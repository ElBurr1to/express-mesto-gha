const User = require('../models/user');

function getUsers(req, res) {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

function createUser(req, res) {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      switch (err.name) {
        case 'ValidationError':
          res.status(400).send('Переданы некорректные данные присозданиие пользователя');
          break;
        default:
          res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
}

function getUserById(req, res) {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => res.send(user))
    .catch((err) => {
      switch (err.name) {
        case 'CastError':
          res.status(404).send({ message: 'Пользователь по указанному id не найден' });
          break;
        default:
          res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
}

function updateProfile(req, res) {
  const userId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    userId,
    {
      name,
      about,
    },
    {
      new: true,
    },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      switch (err.name) {
        case 'ValidationError':
          res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
          break;
        case 'CastError':
          res.status(404).send({ message: 'Пользователь по указанному id не найден' });
          break;
        default:
          res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
}

function updateAvatar(req, res) {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    userId,
    {
      avatar,
    },
    {
      new: true,
    },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      switch (err.name) {
        case 'ValidationError':
          res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
          break;
        case 'CastError':
          res.status(404).send({ message: 'Пользователь по указанному id не найден' });
          break;
        default:
          res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
}

module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateProfile,
  updateAvatar,
};
