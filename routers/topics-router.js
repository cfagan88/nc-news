const topicsRouter = require("express").Router();
const {getAllTopics} = require("../db/controllers/topics-controllers")

topicsRouter.get("/", getAllTopics)

module.exports = {topicsRouter}