const { requestAllTopics } = require("../models/topics.models");

exports.getAllTopics = (req, res, next) => {
  requestAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};
