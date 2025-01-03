const db = require("../connection");

exports.fetchAllArticles = (sort_by = "created_at", order = "DESC", topic) => {
  const validSortBy = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];
  const validOrder = ["ASC", "DESC"];

  if (!validSortBy.includes(sort_by) || !validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  let sqlQuery = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
  CAST (COUNT (comment_id) AS INT) AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id `;
  const queryValues = [];

  if (topic) {
    sqlQuery += `WHERE topic = $1 `;
    queryValues.push(topic);
  }

  sqlQuery += `GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`;
  return db.query(sqlQuery, queryValues).then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticleByID = (article_id) => {
  return db
    .query(
      `SELECT articles.*, CAST (COUNT (comment_id) AS INT) AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows[0];
    });
};

exports.checkArticleExists = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
    });
};

exports.checkTopicExists = (topic) => {
  return db
    .query(`SELECT * FROM topics WHERE slug = $1`, [topic])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
    });
};

exports.patchArticleByID = (updatedVotes, article_id) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
      [updatedVotes, article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows[0];
    });
};

exports.addArticle = (
  author,
  title,
  body,
  topic,
  article_img_url = "no img_url"
) => {
  if (!author || !title || !body || !topic) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  return db
    .query(`SELECT * FROM users WHERE username = $1;`, [author])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
    })
    .then(() => {
      return db
        .query(`SELECT * FROM topics WHERE slug = $1;`, [topic])
        .then(({ rows }) => {
          if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Not found" });
          }
        });
    })
    .then(() => {
      return db
        .query(
          `INSERT INTO articles(author, title, body, topic, article_img_url) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
          [author, title, body, topic, article_img_url]
        )
        .then(({ rows: [{ article_id }] }) => {
          return article_id;
        });
    });
};

exports.deleteArticle = (article_id) => {
  return db
    .query(`DELETE FROM articles WHERE article_id = $1 RETURNING *`, [
      article_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
    });
};
