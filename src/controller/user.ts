import {
    Request,
    Response,
} from 'express';

import { validate } from 'class-validator';
import { getCustomRepository } from 'typeorm';
import { User } from "../entity/User";
import { UserRepository } from '../repository/UserRepository';

function getRepository(): UserRepository {
    return getCustomRepository(UserRepository);
}

/**
 * Creates a new user instance.
 */
export async function createUser(request: Request, response: Response) {
    const repo: UserRepository = getRepository();
    const data = request.body;
    const user = new User();

    user.email = data.email;
    user.password = data.password;

    const errors = await validate(user);

    if (errors.length > 0) {
        response.status(422).json({ message: 'Unprocessable Entity', errors: errors });
    } else {
        await repo.save(user)
            .then(
                (user: User) => response.json(user),
                (err: any) => {
                    if (err.code && err.code === 'ER_DUP_ENTRY') {
                        response.status(422).json({ message: 'Unprocessable Entity' });
                        return;
                    }
                    response.status(500).json('Internal Server Error');
                }
            );
    }
}

/**
 * Gets all users.
 */
export async function getUsers(request: Request, response: Response) {
    const repo: UserRepository = getRepository();

    await repo.find()
        .then(
            (users: User[]) => response.json(users),
            (err: Error) => response.status(500).json({ message: 'Internal Server Error' })
        );
}

/**
 * Gets an user by its id.
 */
export async function getUserById(request: Request, response: Response) {
    const repo: UserRepository = getRepository();
    const id = request.params.id;

    await repo.findById(id)
        .then(
            (user: User | undefined) => {
                if (!user) {
                    response.status(404).json({ message: 'Not Found' });
                    return;
                }
                response.json(user);
            },
            (err: Error) => {
                response.status(500).json({ message: 'Internal Server Error' })
            }
        );
}

/**
 * Gets an user by its email.
 */
export async function getUserByEmail(request: Request, response: Response) {
    const repo: UserRepository = getRepository();
    const email = request.params.email;

    if (!email) {
        response.status(400).json({ message: 'Bad Request' });
    }

    await repo.findByEmail(email)
        .then(
            (user: User | undefined) => {
                if (!user) {
                    response.status(404).json({ message: 'Not Found' });
                    return;
                }
                response.json(user);
            },
            (err: Error) => response.status(500).json({ message: 'Internal Server Error' })
        );
}

/**
 * Removes an user by its id.
 */
export async function removeUser(request: Request, response: Response) {
    const repo: UserRepository = getRepository();
    const id = request.params.id;

    if (!id) {
        response.status(400).json({ message: 'Bad Request' });
    }

    await repo.findById(id)
        .then(
            (user: User | undefined) => {
                if (!user) {
                    response.status(404).json({ message: 'Not Found' });
                    return;
                }
                repo.remove(user)
                    .then(
                        (user: User) => response.status(204).json({}),
                        (err: Error) => response.status(500).json({ message: 'Internal Server Error' })
                    );
            },
            (err: Error) => response.status(500).json({ message: 'Internal Server Error' })
        );

}

/**
 * Updates a user entity.
 */
export async function updateUser(request: Request, response: Response) {
    const repo: UserRepository = getRepository();
    const body = request.body;
    const id = body.id;
    const user = await repo.findById(id);

    if (!user) {
        response.status(422).json({ message: 'Unprocessable Entity' });
    } else {
        if (!hasObjectProperties(body, ['id', 'firstName', 'lastName'])) {
            response.status(400).json('Bad Request');
        } else {
            user.id = body.id;
            user.email = body.email;
            user.firstName = body.firstName;
            user.lastName = body.lastName;
            user.isActive = body.isActive;

            const errors = await validate(user);

            if (errors.length > 0) {
                response.status(422).json({ message: 'Unprocessable Entity' });
            } else {
                repo.save(user)
                    .then(
                        (user: User) => response.status(204).json({}),
                        (err: any) => response.status(422).json({ message: 'Unprocessable Entity' })
                    );
            }
        }
    }
}

function hasObjectProperties(o: any, properties: string[]): boolean {
    const names = Object.getOwnPropertyNames(o);
    return properties.filter(item => names.indexOf(item) < 0).length === 0;
}
