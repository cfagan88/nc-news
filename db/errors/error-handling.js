exports.customErrorHandler = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.postgresErrorHandler = (err, req, res, next) => {
  switch (err.code) {
    case "22P02":
      res.status(400).send({ msg: "Bad request" });
      break;
    default:
      next(err);
      break;
  }
};

exports.serverErrorHandler = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error" });
};
