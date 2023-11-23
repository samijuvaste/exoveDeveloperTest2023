# This is my solution to Exove Developer test's task 3A (for trainee application 2023).
# For 1A, 2B, and 3C see: https://github.com/samijuvaste/exoveDeveloperTest2022

This script starts Docker container that fetches data from an URL, saves the data to a
PostgreSQL database in another Docker container, and finally prints all the data in the
database. You can run this script with:

```
./run.sh
```

or for Windows users (you have to be in the docker/ directory):

```
docker compose up app
```

Requirements: [Docker](https://docs.docker.com/engine/install/)

Here are the steps I took in this task:
- Decided the tables for the database. I just drew a traditional UML diagram. I used
  PostgreSQL as I am familiar with it, and I knew that it had JSON type for variations.
- Made the base for the app/script. I decided to use TypeScript since I thought that
  typing the data would be smart for parsing. I also added ESLint and EditorConfig rules
  that I'm comfortable with.
- Implemented fetching and typing the data. I found two libraries from npm for currency
  and language codes.
- Decided to run the database in a Docker container as I have previosly done. I decided
  also to use Flyway to help with migrations during the development. I also added a
  container for the app/script, so that everything would run neatly with Docker
  Compose.
- After I got the dabase running, I finally wrote the queries that the app/script would
  use. I also wrote a query that gets all the data from all the tables, so that I can
  show all the saved data.
