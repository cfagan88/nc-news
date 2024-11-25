# Northcoders News API

## Setup Instructions

This repo contains two databases - one for developer demo data, and another for a smaller set of test data. In order to set the correct environment (either test or developer), you will need to create two separate `.env` files in the root folder:
`.env.test` - in this file, add `PGDATABASE=nc_news_test`
`.env.development` - in this file, add `PGDATABASE=nc_news`

Once this is done, the following scripts can be run in order to create and seed databases:
`npm run setup-dbs`
then
`npm run seed`

---

## Available Endpoints:

### /api

- responds with a list of all available endpoints

### /api/topics

- responds with a list of all topics
- example response:
  {"topics": [{
  description: "The man, the Mitch, the legend",
  slug: "mitch",
  },
  {
  description: "Not dogs",
  slug: "cats",
  }]}

### /api/articles/:article_id

- responds with a specific article based on the id provided in the endpoint
- example response:
  {"article_id": 4,
  "title": "Student SUES Mitch!",
  "topic": "mitch",
  "author": "rogersop",
  "body": "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
  "created_at": "2020-05-06T01:14:00.000Z",
  "votes": 0,
  "article_img_url": "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"}

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
