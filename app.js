const express = require("express");
const app = express();
const { getApi } = require("./db/controllers/api.controller");
const { getAllTopics } = require("./db/controllers/topics.controllers");
const {
  getArticleByID,
  getAllArticles,
  updateArticleByID,
} = require("./db/controllers/articles.controller");
const {
  getCommentsByArticleID,
  postComment,
  deleteCommentByID,
} = require("./db/controllers/comments.controller");
const {
  customErrorHandler,
  postgresErrorHandler,
  serverErrorHandler,
} = require("./db/errors/error-handling");

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticleByID);

app.get("/api/articles/:article_id/comments", getCommentsByArticleID);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", updateArticleByID);

app.delete("/api/comments/:comment_id", deleteCommentByID);

app.use(customErrorHandler);
app.use(postgresErrorHandler);
app.use(serverErrorHandler);

module.exports = app;
