const express = require("express");
const app = express();
const { getApi } = require("./db/controllers/api.controller");
const { getAllTopics } = require("./db/controllers/topics.controllers");
const {serverErrorHandler} = require("./db/errors/error-handling")

app.get("/api", getApi);

app.get("/api/topics", getAllTopics);

app.use(serverErrorHandler);

module.exports = app;
