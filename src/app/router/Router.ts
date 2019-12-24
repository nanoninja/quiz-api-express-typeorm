import * as express from 'express';
import { Request, Response, NextFunction } from 'express';
import { Route } from "./Route";

export class Router {

    /**
     * @param routes
     * @return express.Router
     */
    load(routes: Route[]): express.Router {
        const router = express.Router();

        routes.forEach((route: Route) => {
            router[route.method](route.path, (request: Request, response: Response, next: NextFunction) => {
                route.action(request, response)
                    .then(() => next)
                    .catch((err: Error) => next(err));
            });
        });

        return router;
    }
}
