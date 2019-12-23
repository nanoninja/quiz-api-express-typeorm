import 'reflect-metadata';

import { createConnection, Connection } from "typeorm";
import * as express from 'express';
import * as bodyParser from 'body-parser';

import {
    Application,
    Request,
    Response,
    NextFunction,
} from 'express';

import './internal/env';
import { AppRoutes } from './routes';
import { Route } from './internal/router/Route';
import { User } from "./entity/User";

// Environnment
const PORT = Number(process.env.PORT);
const HOST = String(process.env.HOST);

// Application
createConnection().then(async (connection: Connection) => {

    console.log("Inserting a new user into the database...");
    const user = new User();
    user.email = 'saw.timber9@gmail.com';
    user.password = '1234';
    user.firstName = "Timber";
    user.lastName = "Saw";
    user.age = 25;
    await connection.manager.save(user);
    console.log("Saved a new user with id: " + user.id);

    console.log("Loading users from the database...");
    const users = await connection.manager.find(User);
    console.log("Loaded users: ", users);

    // Create express app.
    const app: Application = express();
    app.use(bodyParser.json());

    // Register all application routes.
    AppRoutes.forEach((route: Route) => {
        app[route.method](route.path, (request: Request, response: Response, next: NextFunction) => {
            route.action(request, response)
                .then(() => next)
                .catch((err: Error) => next(err));
        });
    });

    app.listen(PORT, HOST, () => {
        console.log(`[Express] is listenning on ${HOST}:${PORT}`);
    });

}).catch((err: Error) => console.log(`[TypeORM] connection error: ${err}`));
