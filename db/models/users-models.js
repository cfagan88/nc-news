const db = require("../connection");

exports.fetchAllUsers = () => {
  return db
    .query(
      `SELECT * FROM USERS`
    )
    .then(({ rows }) => {
      return rows;
    });
};