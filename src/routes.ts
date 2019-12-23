import { Route } from './internal/router/Route';
import { Home } from './controller';

export const AppRoutes: Route[] = [
    {
        path: "/",
        method: 'get',
        action: Home
    }
];