const usersRouter = require("express").Router();
const {
  getAllUsers
} = require("../db/controllers/users.controllers");

usersRouter.route("/")
.get(getAllUsers)


module.exports = {usersRouter}