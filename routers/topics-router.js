const topicsRouter = require("express").Router();
const {
  getAllTopics,
  postTopic,
} = require("../db/controllers/topics-controllers");

topicsRouter.route("/").get(getAllTopics).post(postTopic);

module.exports = { topicsRouter };
