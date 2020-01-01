import { Route } from './router';
import { hello } from '../controller';
import { jwtVerify } from './middleware/jwt';

import {
    register,
    getUserByEmail,
    getUserById,
    getUsers,
    removeUser,
    updateUser,
    authenticate
} from '../controller/user';

export const routes: Route[] = [
    {
        path: '/',
        method: 'get',
        action: hello
    },
    {
        path: '/users/authenticate',
        method: 'post',
        action: authenticate
    },
    {
        path: '/users/register',
        method: 'post',
        action: register
    },
    {
        path: '/users',
        method: 'get',
        action: getUsers,
        middlewares: jwtVerify
    },
    {
        path: '/users',
        method: 'put',
        action: updateUser,
        middlewares: jwtVerify
    },
    {
        path: '/users/:id',
        method: 'get',
        action: getUserById,
        middlewares: jwtVerify
    },
    {
        path: '/users/:id',
        method: 'delete',
        action: removeUser,
        middlewares: jwtVerify
    },
    {
        path: '/users/email/:email',
        method: 'get',
        action: getUserByEmail,
        middlewares: jwtVerify
    },
];
