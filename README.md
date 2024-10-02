## Installation

npm ci

## To start

npm run dev

## Project Structure

-   project-root/  
     |- bin/  
     |- www  
     |- src/  
     |-config  
     |- constants.js  
     |- ...  
     |- database/  
     |- migrations/  
     |- create-user.js  
     |- ...  
     |- models/  
     |- users.js  
     |- index.js  
     |- ...  
     |- seeders/  
     |- helpers/  
     |- errorHandler.js  
     |- middlewares/  
     |- authentication.js  
     |- validation.js  
     |- ...  
     |-modules/  
     |- users/  
     |-services/  
     |-login.js  
     |- ...  
     |- user.controller.js  
     |- user.repository.js  
     |- user.routes.js  
     |- user.validation.js  
     |- index.js  
     |- ...  
     |- routes/  
     |- index.js  
     |- utils/  
     |- jwt.js  
     |- logger.js  
     |- ...  
     |- .gitignore  
     |- package.json  
     |- package-lock.json  
     |- .env  
     |- app.js

# Manual Migration for Sequelize in Production

This guidess explains how to perform manual migrations with Sequelize for a production environment. Manual migrations allow you to make controlled changes to your database schema without data loss.

## Prerequisites

Make sure you have the Sequelize CLI installed globally:

```bash
npm install -g sequelize-cli
```

### Create a new migration file for create table along with model file, run the following command. Replace modelname (in here User) and attributes as the names and attributes you need.

```bash
sequelize model:generate --name User --attributes firstName:string,lastName:string,email:string
```

#### Create a new migration file using the following command. Replace create-users with a meaningful name for your migration.

```bash
sequelize migration:create --name create-users
```

#### Run the Migration

```bash
sequelize db:migrate
```

### Run a particular migration. Replace migrationName with migration name.

```bash
sequelize db:migrate --name migrationName
```

## Deployment

To run development server

```bash
  npm run dev
```

to run node server

```bash
  npm start
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

```bash
NODE_ENV=
PORT=

DB_USERNAME=
DB_PASSWORD=
DB_NAME=
DB_HOST=
DB_PORT=
DB_DIALECT=

DB_TEST_USERNAME=
DB_TEST_PASSWORD=
DB_TEST_NAME=
DB_TEST_HOST=
DB_TEST_PORT=
TEST_DB_DIALECT=

#SMTP
HOST=
PORT=
USER_NAME=
USER_PASS=
FROM_EMAIL=


```

## Module Structure

Within the Module folder, various modules can be established. Each module includes six JavaScript files alongside a service folder. Controllers within these modules are designated to define routes specific to the module. Functions within the controller files are tasked solely with handling incoming requests and returning appropriate responses. For the actual logical functionality, the service folder houses distinct files catering to different logical operations. Repository files are designated for database queries, while validation files contain functions for validation purposes (Joi package for validation). There is test file for writing unit testing using JEST.

## Docker

To run the project using docker please crate `.env` file first

```sh
cp .env.example .env
```

then build and up the container using

```sh
docker compose up
```

or detach the terminal using

```sh
docker compose up -d
```

## Swagger documentation

```
{{url}}/v1/api-docs
```

## Running Test

Set NODE_ENV in .env file to test

To run test need to add following environmental variables to .env file

```bash
DB_TEST_USERNAME=
DB_TEST_PASSWORD=
DB_TEST_NAME=
DB_TEST_HOST=
DB_TEST_PORT=
TEST_DB_DIALECT=sqlite
```

```sh
npm run test
```
