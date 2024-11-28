const articlesRouter = require("express").Router();
const {
  getArticleByID,
  getAllArticles,
  updateArticleByID,
} = require("../db/controllers/articles-controllers");
const {
  getCommentsByArticleID,
  postComment,
} = require("../db/controllers/comments-controllers");


articlesRouter.route("/")
.get(getAllArticles)

articlesRouter.route("/:article_id")
.get(getArticleByID)
.patch(updateArticleByID)

articlesRouter.route("/:article_id/comments")
.get(getCommentsByArticleID)
.post(postComment)

module.exports = {articlesRouter}