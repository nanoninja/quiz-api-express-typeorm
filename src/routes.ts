import { jwtVerify } from './app/middleware/jwt.middleware';
import { DefaultController } from './controller/DefaultController';
import { UserController } from './controller/UserController';

export interface Route {
    method: string;
    route: string;
    controller: any;
    action: string;
    middlewares?: Function | Function[]
}

export const routes: Route[] = [
    {
        method: 'get',
        route: '/',
        controller: DefaultController,
        action: 'hello'
    },
    {
        method: 'post',
        route: '/users/authenticate',
        controller: UserController,
        action: 'authenticate'
    },
    {
        method: 'post',
        route: '/users/register',
        controller: UserController,
        action: 'register'
    },
    {
        method: 'get',
        route: '/users',
        controller: UserController,
        action: 'getUsers',
        middlewares: jwtVerify
    },
    {
        method: 'put',
        route: '/users',
        controller: UserController,
        action: 'updateUser',
        middlewares: jwtVerify
    },
    {
        method: 'get',
        route: '/users/:id',
        controller: UserController,
        action: 'getUserById',
        middlewares: jwtVerify
    },
    {
        method: 'delete',
        route: '/users/:id',
        controller: UserController,
        action: 'removeUser',
        middlewares: jwtVerify
    },
    {
        method: 'get',
        route: '/users/email/:email',
        controller: UserController,
        action: 'getUserByEmail',
        middlewares: jwtVerify
    },
];
