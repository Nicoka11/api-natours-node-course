const fs = require('fs');

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
);

exports.getUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
};

exports.addUser = (req, res) => {
  // console.log(req.body);
};

exports.getUser = (req, res) => {};
exports.modifyUser = (req, res) => {};
exports.deleteUser = (req, res) => {};
