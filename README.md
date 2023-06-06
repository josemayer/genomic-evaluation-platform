# genomic-evaluation-platform
Personalized genomics platform that provides users with information about their family history, genetic conditions and health risks based on their DNA sequences.

## Running application

To run this application, you must:

1. Clone this repository
2. Create `.env` file from `/src/.env.sample` in the same directory
3. Create all `.env` files from `/src/dbs/{postgres, neo4j, redis}/.env.sample` in the same directories

Then you can start it in two modes — development or production.

### Development mode 

To run the application in development mode with Docker Compose or NPM, execute:
  - `$ docker compose --profile dev up`
  - `$ npm install && npm run dev`

This mode uses [nodemon](https://www.npmjs.com/package/nodemon), which has hot-reloading mecanism.

### Production mode

To run the application in production mode with Docker Compose or NPM, execute:
  - `$ docker compose --profile prod up`
  - `$ npm ci --omit=dev && npm start`

**NOTE:** Both development and production modes, with NPM, require you pass the environment variables of `/src/env` to NodeJS. Docker Compose does that automatically.

## Running tests

To run tests of this application, you need to be in development mode. You can use either NPM or Docker:
  - `$ docker compose exec app-dev npm test`
  - `$ npm [run] test`

## TO-DOs:

- [ ] Add automated tests package
- [x] Add other NoSQL database containers and networks (and theirs respective packages, configs and environment variables)
- [ ] Create schema to relational model of database
- [ ] Create schemas to NoSQL models of databases
- [ ] Create functions and procedures that will fit application into requirements
- [ ] Add data persistance to all databases (in second phase, after development)
