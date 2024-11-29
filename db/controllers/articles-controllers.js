const {
  fetchArticleByID,
  fetchAllArticles,
  patchArticleByID,
  checkArticleExists,
  checkTopicExists,
  addArticle,
} = require("../models/articles-models");

exports.getAllArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;
  const promises = [fetchAllArticles(sort_by, order, topic)];

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

  patchArticleByID(updatedVotes, article_id)
    .then((updatedArticle) => {
      res.status(200).send({ updatedArticle });
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  const {author, title, body, topic, article_img_url} = req.body;

  addArticle(author, title, body, topic, article_img_url)
    .then((article_id) => {
      return fetchArticleByID(article_id)
    })  
  .then((article) => {
      res.status(201).send({article});
    })
    .catch(next);
};
