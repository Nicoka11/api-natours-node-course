const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes.js');
const userRouter = require('./routes/userRoutes.js');
const AppError = require('./utils/appError.js');
const errorGlobal = require('./controllers/errorController');

const app = express();

app.use(express.json());
app.use(morgan('dev'));

/// Requests Handlers

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.path} on the server`, 404));
});

app.use(errorGlobal);
module.exports = app;
