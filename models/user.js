const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Минимальная длина поля "name" - 2 символа'],
    maxlength: [30, 'Максимальная длина поля "name" - 30 символа'],
    required: [true, 'Поле "name" обязательно'],
  },
  about: {
    type: String,
    minlength: [2, 'Минимальная длина поля "about" - 2 символа'],
    maxlength: [30, 'Максимальная длина поля "about" - 30 символа'],
    required: [true, 'Поле "about" обязательно'],
  },
  avatar: {
    type: String,
    required: [true, 'Поле "avatar" обязательно'],
    validate: {
      validator: (link) => validator.isURL(link),
      message: 'Некорректный URL',
    },
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
