import { Route } from './app/router/Route';
import { Home } from './controller';

export const routes: Route[] = [
    {
        path: "/",
        method: 'get',
        action: Home
    }
];