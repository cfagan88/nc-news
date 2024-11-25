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

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
