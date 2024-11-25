const express = require("express");
const app = express();
const { getApi } = require("./db/controllers/api.controller");
const { getAllTopics } = require("./db/controllers/topics.controllers");
const { getArticleByID } = require("./db/controllers/articles.controller");
const { customErrorHandler, postgresErrorHandler, serverErrorHandler } = require("./db/errors/error-handling");

app.get("/api", getApi);

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticleByID);

app.use(customErrorHandler);
app.use(postgresErrorHandler);
app.use(serverErrorHandler);

module.exports = app;
