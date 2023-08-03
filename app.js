const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const router = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');

const { PORT } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {});

app.use('/', router);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {});
