const db = require("../connection");

exports.fetchCommentsByArticleID = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.addComment = (newComment, article_id) => {
  const { username, body } = newComment;

  if (!username) {
    return Promise.reject({ status: 400, msg: "Username is required" });
  }

  if (!body) {
    return Promise.reject({ status: 400, msg: "Comment is required" });
  }

  return db
    .query(
      `INSERT INTO comments(author, body, article_id) VALUES ($1, $2, $3) RETURNING *`,
      [username, body, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.patchComment = (updatedVotes, comment_id) => {
  return db
    .query(
      `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *`,
      [updatedVotes, comment_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "comment does not exist" });
      }
      return rows[0];
    });
};

exports.deleteComment = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [
      comment_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      }
    });
};
