import { Route } from './router';
import { hello } from '../controller';

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
        path: '/users',
        method: 'get',
        action: getUsers,
    },
    {
        path: '/users/register',
        method: 'post',
        action: register,
    },
    {
        path: '/users',
        method: 'put',
        action: updateUser
    },
    {
        path: '/users/:id',
        method: 'get',
        action: getUserById
    },
    {
        path: '/users/:id',
        method: 'delete',
        action: removeUser
    },
    {
        path: '/users/email/:email',
        method: 'get',
        action: getUserByEmail
    },
];
