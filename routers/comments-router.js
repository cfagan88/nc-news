const commentsRouter = require("express").Router();
const {
  updateCommentByID,
  deleteCommentByID,
} = require("../db/controllers/comments-controllers");

commentsRouter
  .route("/:comment_id")
  .patch(updateCommentByID)
  .delete(deleteCommentByID);

module.exports = { commentsRouter };
