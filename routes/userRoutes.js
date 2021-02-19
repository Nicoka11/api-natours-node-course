const express = require('express');
const {
  getUsers,
  getUser,
  addUser,
  modifyUser,
  deleteUser,
} = require('../controllers/userController');

const router = express.Router();

router.route('/').get(getUsers).post(addUser);

router.route('/:id').get(getUser).patch(modifyUser).delete(deleteUser);

module.exports = router;
