# TypeORM

* [Summary](README.md)
* [TypeORM CLI Documentation](https://github.com/typeorm/typeorm/blob/master/docs/using-cli.md)

## Project

### Creating basic project

``` sh
typeorm init --name my-project --database mysql
```

### Creating project with User

``` sh
typeorm init --name user-project --database mysql --express
```

## Entity

### Creating an entity

``` sh
typeorm entity:create -n Article
```

or 

``` sh
typeorm entity:create -n Article src/entity
```

