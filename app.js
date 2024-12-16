const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

const {
  customErrorHandler,
  postgresErrorHandler,
  serverErrorHandler,
} = require("./db/errors/error-handling");

const { apiRouter } = require("./routers/api-router");
app.use(express.json());
app.use("/api", apiRouter);

app.use(customErrorHandler);
app.use(postgresErrorHandler);
app.use(serverErrorHandler);

module.exports = app;
