const {
  fetchArticleByID,
  fetchAllArticles,
  patchArticleByID,
  checkArticleExists,
  checkTopicExists,
} = require("../models/articles.models");

exports.getAllArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;
  const promises = [
    fetchAllArticles(sort_by, order, topic),
  ];

  if (topic) {
    promises.push(checkTopicExists(topic));
  }
  
  Promise.all(promises)
    .then(([articles]) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleByID = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleByID(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.updateArticleByID = (req, res, next) => {
  const updatedVotes = req.body.inc_votes;
  const { article_id } = req.params;

  const promises = [
    checkArticleExists(article_id),
    patchArticleByID(updatedVotes, article_id),
  ];

  Promise.all(promises)
    .then(([_, updatedArticle]) => {
      res.status(200).send({ updatedArticle });
    })
    .catch(next);
};
