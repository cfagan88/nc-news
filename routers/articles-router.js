const articlesRouter = require("express").Router();
const {
  getArticleByID,
  getAllArticles,
  updateArticleByID,
  postArticle,
  deleteArticleByID,
} = require("../db/controllers/articles-controllers");
const {
  getCommentsByArticleID,
  postComment,
} = require("../db/controllers/comments-controllers");

articlesRouter.route("/").get(getAllArticles).post(postArticle);

articlesRouter
  .route("/:article_id")
  .get(getArticleByID)
  .patch(updateArticleByID)
  .delete(deleteArticleByID);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleID)
  .post(postComment);

module.exports = { articlesRouter };
