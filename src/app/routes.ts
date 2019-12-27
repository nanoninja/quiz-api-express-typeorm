import { Route } from './router';
import { hello } from '../controller';

import {
    createUser,
    getUserByEmail,
    getUserById,
    getUsers,
    removeUser,
    updateUser
} from '../controller/user';

export const routes: Route[] = [
    {
        path: '/',
        method: 'get',
        action: hello
    },
    {
        path: '/users',
        method: 'get',
        action: getUsers,
    },
    {
        path: '/users',
        method: 'post',
        action: createUser,
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
