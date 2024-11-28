const commentsRouter = require("express").Router();
const {
  deleteCommentByID,
} = require("../db/controllers/comments.controllers");


commentsRouter.route("/:comment_id")
.delete(deleteCommentByID)


module.exports = {commentsRouter}