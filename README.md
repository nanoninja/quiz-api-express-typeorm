# Node API

Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `ormconfig.json` file
3. Run `npm start` or `npm run dev` command

## Installing dependencies

``` sh
npm i
    body-parser \
    dotenv \
    express \
    mongodb \
    mysql \
    mysql2 \
    pg \
    reflect-metadata \
    typeorm 
```

## Installing developpment dependencies

``` sh
npm i -D
    @types/express \
    @types/node \
    nodemon \
    ts-node \
    typescript 
```

## TypeORM

### Creating a project

``` sh
typeorm init --name my-project --database mysql
```
