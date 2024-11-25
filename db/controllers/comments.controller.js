const { checkArticleExists } = require("../models/articles.models");
const {
  fetchCommentsByArticleID,
  addComment,
} = require("../models/comments.models");

exports.getCommentsByArticleID = (req, res, next) => {
  const { article_id } = req.params;
  const promises = [
    fetchCommentsByArticleID(article_id),
    checkArticleExists(article_id),
  ];

  Promise.all(promises)
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const newComment = req.body;
  const { article_id } = req.params;
  const promises = [
    checkArticleExists(article_id),
    addComment(newComment, article_id),
  ];

  Promise.all(promises)
    .then(([_, comment]) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
