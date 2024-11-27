const db = require("../connection");

exports.fetchAllArticles = (sort_by = "created_at", order = "DESC") => {

  const validSortBy = ["author", "title", "article_id", "topic", "created_at", "votes", "article_img_url", "comment_count"];
  const validOrder = ["ASC", "DESC"];

  if (!validSortBy.includes(sort_by) || !validOrder.includes(order)) {
    return Promise.reject({ status: 404, msg: "Invalid Input" });
  }
  
  let sqlQuery = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
  CAST (COUNT (comment_id) AS INT) AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id
  GROUP BY articles.article_id
  ORDER BY ${sort_by} ${order};`
  
  return db
    .query(sqlQuery)
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchArticleByID = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article does not exist" });
      }
      return rows[0];
    });
};

exports.checkArticleExists = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article does not exist" });
      }
    });
};

exports.patchArticleByID = (updatedVotes, article_id) => {
  return db
    .query(`UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *`, [
      updatedVotes,
      article_id,
    ])
    .then(({ rows }) => {
      return rows[0];
    })
};
