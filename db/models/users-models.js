const db = require("../connection");

exports.fetchAllUsers = () => {
  return db.query(`SELECT * FROM USERS`).then(({ rows }) => {
    return rows;
  });
};

exports.fetchUserByID = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "user does not exist" });
      }
      return rows[0];
    });
};
