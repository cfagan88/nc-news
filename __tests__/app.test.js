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

// -------------------------------------------------------------------------

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

// -------------------------------------------------------------------------

describe("POST /api/topics", () => {
  test("201: Responds with the posted comment", () => {
    return request(app)
      .post("/api/topics")
      .send({
        slug: "food",
        description: "Something for us all to get excited about",
      })
      .expect(201)
      .then(({ body: { topic } }) => {
        expect(topic).toMatchObject({
          slug: "food",
          description: "Something for us all to get excited about",
        });
      });
  });

  test("400: Sends an appropriate status and error message when no slug is provided", () => {
    return request(app)
      .post("/api/topics")
      .send({
        description: "Something for us all to get excited about",
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  test("400: Sends an appropriate status and error message when no description is provided", () => {
    return request(app)
      .post("/api/topics")
      .send({
        slug: "food",
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});

// -------------------------------------------------------------------------

describe("GET /api/articles", () => {
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

  test("200: Orders articles by descending date (default)", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("200: Orders articles by ascending date", () => {
    return request(app)
      .get("/api/articles?order=ASC")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: false });
      });
  });

  test("200: Orders articles by descending author name", () => {
    return request(app)
      .get("/api/articles?sort_by=author")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("author", { descending: true });
      });
  });

  test("200: Orders articles by descending votes", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("votes", { descending: true });
      });
  });

  test("200: Orders articles by ascending title with both sort_by and order queries", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=ASC")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("title", { descending: false });
      });
  });

  test("200: Accepts a topic query which filters articles by the given topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(12);
        articles.forEach(({ topic }) => {
          expect(topic).toBe("mitch");
        });
      });
  });

  test("200: Sends an appropriate status when a topic exists but there are no articles for that topic", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toEqual([]);
      });
  });

  test("404: Sends an appropriate status and error message when given a non-existent topic", () => {
    return request(app)
      .get("/api/articles?topic=notATopic")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
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

  test("400: Returns an error if a non-valid sort-by query is entered", () => {
    return request(app)
      .get("/api/articles?sort_by=badSQLCodeGoesHere")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  test("400: Returns an error if a non-valid order query is entered", () => {
    return request(app)
      .get("/api/articles?order=badSQLCodeGoesHere")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});

// -------------------------------------------------------------------------

describe("POST /api/articles", () => {
  test("201: Responds with the posted comment and a default img_url", () => {
    const newArticle = {
      author: "butter_bridge",
      title: "Is it time for a new article yet?",
      body: "Testing our new article functionality - fingers crossed...",
      topic: "mitch",
    };

    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          author: "butter_bridge",
          title: "Is it time for a new article yet?",
          body: "Testing our new article functionality - fingers crossed...",
          topic: "mitch",
          article_img_url: "no img_url",
          article_id: 14,
          votes: 0,
          created_at: expect.any(String),
          comment_count: 0,
        });
      });
  });

  test("404: Responds with an error if the given author does not exist", () => {
    const newArticle = {
      author: "new_author",
      title: "Is it time for a new article yet?",
      body: "Testing our new article functionality - fingers crossed...",
      topic: "mitch",
    };

    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });

  test("404: Responds with an error if the given topic does not exist", () => {
    const newArticle = {
      author: "butter_bridge",
      title: "Is it time for a new article yet?",
      body: "Testing our new article functionality - fingers crossed...",
      topic: "new_topic",
    };

    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });

  test("400: Sends an appropriate status and error message when no author is provided", () => {
    return request(app)
      .post("/api/articles")
      .send({
        title: "Is it time for a new article yet?",
        body: "Testing our new article functionality - fingers crossed...",
        topic: "new_topic",
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  test("400: Sends an appropriate status and error message when author is empty string", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "",
        title: "Is it time for a new article yet?",
        body: "Testing our new article functionality - fingers crossed...",
        topic: "new_topic",
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  test("400: Sends an appropriate status and error message when no title is provided", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "butter_bridge",
        body: "Testing our new article functionality - fingers crossed...",
        topic: "new_topic",
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  test("400: Sends an appropriate status and error message when title is empty string", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "butter_bridge",
        title: "",
        body: "Testing our new article functionality - fingers crossed...",
        topic: "new_topic",
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  test("400: Sends an appropriate status and error message when no body is provided", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "butter_bridge",
        title: "Is it time for a new article yet?",
        topic: "new_topic",
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  test("400: Sends an appropriate status and error message when body is empty string", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "butter_bridge",
        title: "Is it time for a new article yet?",
        body: "",
        topic: "new_topic",
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  test("400: Sends an appropriate status and error message when no topic is provided", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "butter_bridge",
        title: "Is it time for a new article yet?",
        body: "Testing our new article functionality - fingers crossed...",
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  test("400: Sends an appropriate status and error message when topic is empty string", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "butter_bridge",
        title: "Is it time for a new article yet?",
        body: "Testing our new article functionality - fingers crossed...",
        topic: "",
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});

// -------------------------------------------------------------------------

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

  test("200: Includes comment_count within the returned article object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          comment_count: 11,
        });
      });
  });

  test("404: Sends an appropriate status and error message when given a valid but non-existent article_id ", () => {
    return request(app)
      .get("/api/articles/104")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
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

// -------------------------------------------------------------------------

describe("DELETE /api/articles/:article_id", () => {
  test("204: Deletes an article with the provided article_id", () => {
    return request(app)
      .delete("/api/articles/3")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});

        return request(app)
          .delete("/api/articles/3")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Not found");
          });
      });
  });

  test("404: Sends an appropriate status and error message when given a valid but non-existent article_id", () => {
    return request(app)
      .delete("/api/articles/1107")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });

  test("400: Sends an appropriate status and error message when given an invalid article_id", () => {
    return request(app)
      .delete("/api/articles/invalidId")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});

// -------------------------------------------------------------------------

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

  test("404: Sends an appropriate status and error message when given a valid but non-existent article_id", () => {
    return request(app)
      .get("/api/articles/104/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
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

// -------------------------------------------------------------------------

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
        expect(msg).toBe("Bad request");
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
        expect(msg).toBe("Bad request");
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
        expect(msg).toBe("Bad request");
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
        expect(msg).toBe("Bad request");
      });
  });

  test("404: Sends an appropriate status and error message when given a valid but non-existent article_id", () => {
    return request(app)
      .post("/api/articles/200/comments")
      .send(newComment)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });

  test("404: Sends an appropriate status and error message when given user does not exist", () => {
    return request(app)
      .post("/api/articles/7/comments")
      .send({
        username: "nonExistentUser",
        body: "This is a test POST request comment",
      })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });
});

// -----------------------------------------------------------------------

describe("PATCH /api/articles/:article_id", () => {
  test("200: Increments vote property for given article when given a positive number", () => {
    return request(app)
      .patch("/api/articles/4")
      .send({ inc_votes: 20 })
      .expect(200)
      .then(
        ({
          body: {
            updatedArticle: { votes },
          },
        }) => {
          expect(votes).toBe(20);
        }
      );
  });

  test("200: Decrements vote property for given article when given a negative number", () => {
    return request(app)
      .patch("/api/articles/4")
      .send({ inc_votes: -100 })
      .expect(200)
      .then(
        ({
          body: {
            updatedArticle: { votes },
          },
        }) => {
          expect(votes).toBe(-100);
        }
      );
  });

  test("200: Does not mutate or edit any other properties of the specified article", () => {
    return request(app)
      .patch("/api/articles/4")
      .send({ inc_votes: 20 })
      .expect(200)
      .then(({ body: { updatedArticle } }) => {
        expect(updatedArticle).toMatchObject({
          article_id: 4,
          title: "Student SUES Mitch!",
          topic: "mitch",
          author: "rogersop",
          body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
          created_at: "2020-05-06T01:14:00.000Z",
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });

  test("400: Sends an appropriate status and error message when given an invalid article_id", () => {
    return request(app)
      .patch("/api/articles/invalidId")
      .send({ inc_votes: 20 })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  test("400: Sends an appropriate status and error message when new vote count is wrong data type", () => {
    return request(app)
      .patch("/api/articles/4")
      .send({ inc_votes: "invalidType" })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  test("400: Sends an appropriate status and error message when no vote number is provided", () => {
    return request(app)
      .patch("/api/articles/4")
      .send({})
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  test("404: Sends an appropriate status and error message when given a valid but non-existent article_id", () => {
    return request(app)
      .patch("/api/articles/104")
      .send({ inc_votes: 20 })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });
});

// -------------------------------------------------------------------------

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Deletes a comment with the provided comment_id", () => {
    return request(app)
      .delete("/api/comments/3")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});

        return request(app)
          .delete("/api/comments/3")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Not found");
          });
      });
  });

  test("404: Sends an appropriate status and error message when given a valid but non-existent comment_id", () => {
    return request(app)
      .delete("/api/comments/1103")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });

  test("400: Sends an appropriate status and error message when given an invalid comment_id", () => {
    return request(app)
      .delete("/api/comments/invalidId")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});

// -------------------------------------------------------------------------

describe("PATCH /api/comments/:comment_id", () => {
  test("200: Increments vote property for given comment when given a positive number", () => {
    return request(app)
      .patch("/api/comments/2")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(
        ({
          body: {
            updatedComment: { votes },
          },
        }) => {
          expect(votes).toBe(15);
        }
      );
  });

  test("200: Decrements vote property for given comment when given a positive number", () => {
    return request(app)
      .patch("/api/comments/2")
      .send({ inc_votes: -10 })
      .expect(200)
      .then(
        ({
          body: {
            updatedComment: { votes },
          },
        }) => {
          expect(votes).toBe(4);
        }
      );
  });

  test("200: Does not mutate or edit any other properties of the specified comment", () => {
    return request(app)
      .patch("/api/comments/2")
      .send({ inc_votes: 20 })
      .expect(200)
      .then(({ body: { updatedComment } }) => {
        expect(updatedComment).toMatchObject({
          comment_id: 2,
          body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
          article_id: 1,
          author: "butter_bridge",
          votes: 34,
          created_at: "2020-10-31T03:03:00.000Z",
        });
      });
  });

  test("400: Sends an appropriate status and error message when given an invalid comment_id", () => {
    return request(app)
      .patch("/api/comments/invalidID")
      .send({ inc_votes: 20 })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  test("400: Sends an appropriate status and error message when new vote count is wrong data type", () => {
    return request(app)
      .patch("/api/comments/2")
      .send({ inc_votes: "testString" })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  test("400: Sends an appropriate status and error message when no vote number is provided", () => {
    return request(app)
      .patch("/api/comments/2")
      .send({})
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });

  test("404: Sends an appropriate status and error message when given a valid but non-existent comment_id", () => {
    return request(app)
      .patch("/api/comments/104")
      .send({ inc_votes: 20 })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });
});

// -------------------------------------------------------------------------

describe("GET /api/users", () => {
  test("200: Responds with an array of objects, one for each user in the database", () => {
    return request(app)
      .get("/api/users/")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

// -------------------------------------------------------------------------

describe("GET /api/users/:username", () => {
  test("200: Takes a specific username and returns only the relevant user data", () => {
    return request(app)
      .get("/api/users/icellusedkars")
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toMatchObject({
          username: "icellusedkars",
          name: "sam",
          avatar_url:
            "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
        });
      });
  });

  test("404: Sends an appropriate status and error message when given a valid but non-existent username", () => {
    return request(app)
      .get("/api/users/notAUserYet")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });
});
