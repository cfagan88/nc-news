const express = require("express");
const app = express();
const { getApi } = require("./db/controllers/api.controllers");
const { getAllTopics } = require("./db/controllers/topics.controllers");
const {
  getArticleByID,
  getAllArticles,
  updateArticleByID,
} = require("./db/controllers/articles.controllers");
const {
  getCommentsByArticleID,
  postComment,
  deleteCommentByID,
} = require("./db/controllers/comments.controllers");
const {
  getAllUsers
} = require("./db/controllers/users.controllers");
const {
  customErrorHandler,
  postgresErrorHandler,
  serverErrorHandler,
} = require("./db/errors/error-handling");

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/users", getAllUsers);

app.get("/api/articles/:article_id", getArticleByID);

app.get("/api/articles/:article_id/comments", getCommentsByArticleID);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", updateArticleByID);

app.delete("/api/comments/:comment_id", deleteCommentByID);

app.use(customErrorHandler);
app.use(postgresErrorHandler);
app.use(serverErrorHandler);

module.exports = app;
