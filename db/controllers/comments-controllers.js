const { checkArticleExists } = require("../models/articles-models");
const {
  fetchCommentsByArticleID,
  addComment,
  patchComment,
  deleteComment,
} = require("../models/comments-models");

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

exports.updateCommentByID = (req, res, next) => {
  const updatedVotes = req.body.inc_votes;
  const { comment_id } = req.params;

  patchComment(updatedVotes, comment_id)
    .then((updatedComment) => {
      res.status(200).send({ updatedComment });
    })
    .catch(next);
};

exports.deleteCommentByID = (req, res, next) => {
  const { comment_id } = req.params;

  deleteComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
