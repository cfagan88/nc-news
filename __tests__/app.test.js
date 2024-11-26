const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
require("jest-sorted");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of objects, one for each topic in the database", () => {
    return request(app)
      .get("/api/topics/")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Takes a specific article_id and returns only the relevant article", () => {
    return request(app)
      .get("/api/articles/4")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: 4,
          title: "Student SUES Mitch!",
          topic: "mitch",
          author: "rogersop",
          body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
          created_at: "2020-05-06T01:14:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });

  test("404: Sends an appropriate status and error message when given a valid but non-existent article_id ", () => {
    return request(app)
      .get("/api/articles/104")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("article does not exist");
      });
  });

  test("400: Sends an appropriate status and error message when given an invalid article_id", () => {
    return request(app)
      .get("/api/articles/invalidId")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});

describe('"GET /api/articles', () => {
  test("200: Returns an array of all articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(13);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });

  test("200: Returned array is sorted by descending date by default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("200: Returned article objects do not contain a property for body", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(13);
        articles.forEach((article) => {
          expect(article).not.toHaveProperty("body");
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Returns an array containing all comments for specified article", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toMatchObject([
          {
            comment_id: 11,
            body: "Ambidextrous marsupial",
            article_id: 3,
            author: "icellusedkars",
            votes: 0,
            created_at: "2020-09-19T23:10:00.000Z",
          },
          {
            comment_id: 10,
            body: "git push origin master",
            article_id: 3,
            author: "icellusedkars",
            votes: 0,
            created_at: "2020-06-20T07:24:00.000Z",
          },
        ]);
      });
  });

  test("200: Returned array is sorted by descending date by default", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("200: Send an appropriate response when article exists, but no there are no associated comments", () => {
    return request(app)
      .get("/api/articles/7/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toEqual([]);
      });
  });

  test("404: Sends an appropriate status and error message when given a valid but non-existent article_id ", () => {
    return request(app)
      .get("/api/articles/104/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("article does not exist");
      });
  });

  test("400: Sends an appropriate status and error message when given an invalid article_id", () => {
    return request(app)
      .get("/api/articles/invalidId/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});

describe("POST api/articles/:article_id/comments", () => {
  const newComment = {
    username: "icellusedkars",
    body: "This is a test POST request comment",
  };

  test("201: Responds with the posted comment", () => {
    return request(app)
      .post("/api/articles/7/comments")
      .send(newComment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          body: "This is a test POST request comment",
          article_id: 7,
          author: "icellusedkars",
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });

  test("404: Sends an appropriate status and error message when given a valid but non-existent article_id ", () => {
    return request(app)
      .post("/api/articles/200/comments")
      .send(newComment)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("article does not exist");
      });
  });

  test("400: Sends an appropriate status and error message when given an invalid article_id", () => {
    return request(app)
      .post("/api/articles/invalidId/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  test("400: Sends an appropriate status and error message when no username is provided", () => {
    return request(app)
      .post("/api/articles/7/comments")
      .send({
        body: "This is a test POST request comment",
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Username is required");
      });
  });

  test("400: Sends an appropriate status and error message when username provided is an empty string", () => {
    return request(app)
      .post("/api/articles/7/comments")
      .send({
        user: "",
        body: "This is a test POST request comment",
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Username is required");
      });
  });

  test("400: Sends an appropriate status and error message when no body/comment provided in post request", () => {
    return request(app)
      .post("/api/articles/7/comments")
      .send({
        username: "icellusedkars",
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Comment is required");
      });
  });

  test("400: Sends an appropriate status and error message when body/comment provided in post request is an empty string", () => {
    return request(app)
      .post("/api/articles/7/comments")
      .send({
        username: "icellusedkars",
        body: "",
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Comment is required");
      });
  });
});
