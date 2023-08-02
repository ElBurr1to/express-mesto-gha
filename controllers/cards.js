const mongoose = require('mongoose');
const NotAuthorizedError = require('../errors/NotAuthorizedError');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const Card = require('../models/card');

function getCards(req, res, next) {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch(next);
}

function createCard(req, res, next) {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => card.populate('owner'))
    .then((card) => res.status(201).send(card))
    .catch(next);
}

function deleteCard(req, res, next) {
  const { cardId } = req.params;
  const userId = req.user._id;

  if (!mongoose.isValidObjectId(cardId)) {
    next(new ValidationError('Некорректный Id'));
  }

  Card.findById(cardId)
    .orFail(new NotFoundError('Указанный Id карточки не найден'))
    .then((card) => {
      if (card.owner.valueOf() !== userId) {
        throw new NotAuthorizedError('Невозможно удалить чужую карточку');
      }
    })
    .deleteOne()
    .then((card) => {
      res.send(card);
    })
    .catch(next);
}

function likeCard(req, res, next) {
  const { cardId } = req.params;
  const userId = req.user._id;
  if (!mongoose.isValidObjectId(cardId)) {
    next(new ValidationError('Некорректный Id'));
  }

  Card.findByIdAndUpdate(
    cardId,
    {
      $addToSet: { likes: userId },
    },
    {
      new: true,
    },
  )
    .orFail(new NotFoundError('Указанный Id карточки не найден'))
    .then((card) => {
      res.send(card);
    })
    .catch(next);
}

function dislikeCard(req, res, next) {
  const { cardId } = req.params;
  const userId = req.user._id;
  if (!mongoose.isValidObjectId(cardId)) {
    next(new ValidationError('Некорректный Id'));
  }

  Card.findByIdAndUpdate(
    cardId,
    {
      $pull: { likes: userId },
    },
    {
      new: true,
    },
  )
    .orFail(new NotFoundError('Указанный Id карточки не найден'))
    .then((card) => {
      res.send(card);
    })
    .catch(next);
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
