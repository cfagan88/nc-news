const db = require("../connection");

exports.fetchAllArticles = () => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
      COUNT (comment_id) AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      GROUP BY articles.article_id
      ORDER BY created_at DESC;`
    )
    .then(({ rows }) => {
      console.log(rows);
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
