# Northcoders News API

## Project Summary

NC News is my first solo project at Northcoders, bringing together my knowledge of back-end programming so far!

This API enables you to search through a PostgreSQL database of news articles, topics, authors and associated comments. Functionality includes (please seen "endpoints.json" for a detailed list):

- Requesting all articles, topics or users
- Requesting individual articles by id
- Posting or deleting comments
- Updating properties for a specified article

## Hosted Version

Please find the hosted version [here](https://nc-news-6eit.onrender.com)

## Setup Instructions

### Minimum Requirements

- Node v20.18.0
- PSQL v12.20

### Initial Setup

This repo contains two databases - one for developer demo data, and another for a smaller set of test data. In order to set the correct environment (either test or developer), you will need to create two separate `.env` files in the root folder:

`.env.test` - in this file, add `PGDATABASE=database_name_test`

`.env.development` - in this file, add `PGDATABASE=database_name`

Once this is done, the following scripts can be run in order to create and seed databases:
`npm run setup-dbs`
then
`npm run seed`

### Running Tests

To run tests:
`npm test app`

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
