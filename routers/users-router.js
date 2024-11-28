const usersRouter = require("express").Router();
const {
  getAllUsers,
  getUserByID
} = require("../db/controllers/users-controllers");

usersRouter.route("/")
.get(getAllUsers)

usersRouter.route("/:username")
.get(getUserByID)


module.exports = {usersRouter}