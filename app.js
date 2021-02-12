const express = require('express');
const fs = require('fs');
const { get } = require('http');
const { dirname } = require('path');
const tourRouter = require('./routes/tourRoutes.js');

const app = express();

app.use(express.json());

const port = 3000;

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/users.json`)
);

/// Requests Handlers

const getUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
};

const addUser = (req, res) => {
  console.log(req.body);
};

const getUser = (req, res) => {};
const modifyUser = (req, res) => {};
const deleteUser = (req, res) => {};
/// Routes

const userRouter = express.Router();

userRouter.route('/').get(getUsers).post(addUser);

userRouter.route('/:id').get(getUser).patch(modifyUser).delete(deleteUser);

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
