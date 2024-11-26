const express = require("express");
const app = express();
const { getApi } = require("./db/controllers/api.controller");
const { getAllTopics } = require("./db/controllers/topics.controllers");
const {
  getArticleByID,
  getAllArticles
} = require("./db/controllers/articles.controller");
const {
  customErrorHandler,
  postgresErrorHandler,
  serverErrorHandler
} = require("./db/errors/error-handling");
const {
  getCommentsByArticleID
} = require("./db/controllers/comments.controller");

app.get("/api", getApi);

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticleByID);

app.get("/api/articles/:article_id/comments", getCommentsByArticleID);

app.use(customErrorHandler);
app.use(postgresErrorHandler);
app.use(serverErrorHandler);

module.exports = app;
