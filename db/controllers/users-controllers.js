const { fetchAllUsers, fetchUserByID } = require("../models/users-models");

exports.getAllUsers = (req, res, next) => {
  fetchAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUserByID = (req, res, next) => {
  const { username } = req.params;
  fetchUserByID(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};
