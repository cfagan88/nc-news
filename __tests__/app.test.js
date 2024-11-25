const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

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
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });

  test("404: Sends an appropriate status and error message when given a valid but non-existent article_id ", () => {
    return request(app)
      .get("/api/articles/104")
      .expect(404)
      .then(({body: {msg}}) => {
        expect(msg).toBe("article does not exist");
      });
  });

  test('400: Sends an appropriate status and error message when given an invalid article_id', () => {
    return request(app)
      .get("/api/articles/invalidId")
      .expect(400)
      .then(({body: {msg}}) => {
        expect(msg).toBe("Bad request");
      });
  });
});
