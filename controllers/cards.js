const mongoose = require('mongoose');
const Card = require('../models/card');

function getCards(req, res) {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

function createCard(req, res) {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => card.populate('owner'))
    .then((card) => res.send(card))
    .catch((err) => {
      switch (err.name) {
        case 'ValidationError':
          res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
          break;
        default:
          res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
}

function deleteCard(req, res) {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .populate('owner')
    .then((card) => res.send(card))
    .catch((err) => {
      if (!mongoose.isValidObjectId(userId)) {
        res.status(400).send({ message: 'Некорректный Id' });
      }
      switch (err.name) {
        case 'CastError':
          res.status(404).send({ message: 'Карточка по указанному id не найдена' });
          break;
        default:
          res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
}

function likeCard(req, res) {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    {
      $addToSet: { likes: userId },
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((card) => res.send(card))
    .catch((err) => {
      if (!mongoose.isValidObjectId(userId)) {
        res.status(400).send({ message: 'Некорректный Id' });
      }
      switch (err.name) {
        case 'ValidationError':
          res.status(400).send({ message: 'Переданы некорректные данные при постановке лайка' });
          break;
        case 'CastError':
          res.status(404).send({ message: 'Карточка по указанному id не найдена' });
          break;
        default:
          res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
}

function dislikeCard(req, res) {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    {
      $pull: { likes: userId },
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((card) => res.send(card))
    .catch((err) => {
      if (!mongoose.isValidObjectId(userId)) {
        res.status(400).send({ message: 'Некорректный Id' });
      }
      switch (err.name) {
        case 'ValidationError':
          res.status(400).send({ message: 'Переданы некорректные данные при снятии лайка' });
          break;
        case 'CastError':
          res.status(404).send({ message: 'Карточка по указанному id не найдена' });
          break;
        default:
          res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
