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

  //Note to tutors - I had to split the below and chain the promises rather than use promise.all, but I can't quite work out why the promise.all route would not also throw an error? Perhaps you could kindly help me figure this out, if not I will check in my next 1:1!

  return checkArticleExists(article_id)
    .then(() => {
      return addComment(newComment, article_id);
    })
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
