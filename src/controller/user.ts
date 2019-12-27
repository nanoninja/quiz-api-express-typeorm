import {
    Request,
    Response,
} from 'express';

import { validate, Validator, ValidationError } from 'class-validator';
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
    const body = request.body;

    if (!hasObjectProperties(body, ['email', 'password'])) {
        response.status(400).end();
        return;
    }

    const repo: UserRepository = getRepository();
    const user: User = new User();

    user.email = body.email;
    user.password = body.password;

    const errors: ValidationError[] = await validate(user);
    if (errors.length > 0) {
        response.status(422).json({ message: 'Unprocessable Entity', errors: errors });
        return;
    }

    try {
        await repo.save(user);
        response.status(201).json(user);
    } catch (err) {
        response.status(422).end();
    }
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
    const validator: Validator = new Validator();

    if (!validator.isUUID(request.body.id)) {
        response.status(400).end();
    }

    const repo: UserRepository = getRepository();
    const data: User | undefined = await repo.findById(request.body.id);

    if (!data) {
        response.status(404).end();
        return;
    }

    if (!hasObjectProperties(request.body, Object.getOwnPropertyNames(data))) {
        response.status(400).end();
        return;
    }

    const body: User = request.body as User;
    const user: User = new User();

    body.createdAt = data.createdAt;
    body.updatedAt = data.createdAt;
    map(user, body);

    const errors: ValidationError[] = await validate(user);
    if (errors.length > 0) {
        response.status(422).end();
        return;
    }

    await repo.save(user);
    response.status(204).end();
}

function map(user: User, body: User): void {
    user.id = body.id;
    user.email = body.email;
    user.password = body.password;
    user.isActive = body.isActive;
    user.createdAt = body.createdAt;
    user.updatedAt = body.updatedAt;

    if (body.firstName !== '') {
        user.firstName = body.firstName;
    }

    if (body.lastName !== '') {
        user.lastName = body.lastName;
    }
}

function hasObjectProperties(obj: any, properties: string[]): boolean {
    const names = Object.getOwnPropertyNames(obj);
    return properties.filter(item => names.indexOf(item) < 0).length === 0;
}
