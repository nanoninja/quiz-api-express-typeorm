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
export async function createUser(request: Request, response: Response): Promise<void> {
    const repo: UserRepository = getRepository();
    const body = request.body;
    const user = new User();

    if (!hasObjectProperties(body, ['email', 'password'])) {
        response.status(400).end();
        return;
    }

    user.email = body.email;
    user.password = body.password;

    const errors = await validate(user);

    if (errors.length > 0) {
        response.status(422).json({ message: 'Unprocessable Entity', errors: errors });
        return;
    }

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

/**
 * Gets all users.
 */
export async function getUsers(request: Request, response: Response) {
    const repo: UserRepository = getRepository();
    const users: User[] = await repo.find();

    response.json(users);
}

/**
 * Gets a user by its id.
 */
export async function getUserById(request: Request, response: Response): Promise<void> {
    const repo: UserRepository = getRepository();
    const user: User | undefined = await repo.findById(request.params.id);

    if (!user) {
        response.status(404).end();
        return;
    }

    response.json(user);
}

/**
 * Gets a user by its email.
 */
export async function getUserByEmail(request: Request, response: Response): Promise<void> {
    const repo: UserRepository = getRepository();
    const user: User | undefined = await repo.findByEmail(request.params.email);

    if (!user) {
        response.status(404).end();
        return;
    }

    response.json(user);
}

/**
 * Removes a user by its id.
 */
export async function removeUser(request: Request, response: Response): Promise<void> {
    const repo: UserRepository = getRepository();
    const user: User | undefined = await repo.findById(request.params.id);

    if (!user) {
        response.status(404).end();
        return;
    }

    try {
        await repo.remove(user);
        response.status(204).end();
    } catch (err) {
        response.status(500).end();
    }
}

/**
 * Updates user entity.
 */
export async function updateUser(request: Request, response: Response): Promise<void> {
    const repo: UserRepository = getRepository();
    const body = request.body;

    if (!hasObjectProperties(body, ['id', 'email', 'firstName', 'lastName'])) {
        response.status(400).json('Bad Request');
        return;
    }

    let user: User | undefined = await repo.findById(body.id);

    if (!user) {
        response.status(404).json({ message: 'Unprocessable Entity' });
        return;
    }

    user.id = body.id;
    user.email = body.email;
    user.firstName = body.firstName;
    user.lastName = body.lastName;
    user.isActive = body.isActive;

    const errors = await validate(user);

    if (errors.length > 0) {
        response.status(422).json({ message: 'Unprocessable Entity' });
        return;
    }

    await repo.save(user);
    response.status(204);
}

function hasObjectProperties(o: any, properties: string[]): boolean {
    const names = Object.getOwnPropertyNames(o);
    return properties.filter(item => names.indexOf(item) < 0).length === 0;
}
