import { Request, Response } from 'express';
import { validate, Validator, ValidationError } from 'class-validator';
import { getCustomRepository } from 'typeorm';
import { Password } from '../library/password';
import { User } from '../entity/User';
import { Role } from '../entity/Role';
import { RoleRepository } from '../repository/RoleRepository';
import { UserRepository } from '../repository/UserRepository';

/**
 * Authenticates user by its email.
 */
export async function authenticate(request: Request, response: Response): Promise<void> {
    const validator: Validator = new Validator();
    const email: string = request.body.email;
    const password: string = request.body.password;

    if (!validator.isEmail(email) || !validator.isNotEmpty(password)) {
        response.status(400).end();
        return;
    }

    const repo: UserRepository = getCustomRepository(UserRepository);
    const user: User | undefined = await repo.findByEmail(email);

    if (!user) {
        response.status(422).end();
        return;
    }

    if (!Password.verify(password, user.password)) {
        response.status(422).end();
        return;
    }

    response.json(user);
}

/**
 * Gets all users.
 */
export async function getUsers(request: Request, response: Response) {
    const repo: UserRepository = getCustomRepository(UserRepository);
    const users: User[] = await repo.find();

    response.json(users);
}

/**
 * Gets a user by its email.
 */
export async function getUserByEmail(request: Request, response: Response): Promise<void> {
    const repo: UserRepository = getCustomRepository(UserRepository);
    const user: User | undefined = await repo.findByEmail(request.params.email);

    if (!user) {
        response.status(404).end();
        return;
    }

    response.json(user);
}

/**
 * Gets a user by its id.
 */
export async function getUserById(request: Request, response: Response): Promise<void> {
    const repo: UserRepository = getCustomRepository(UserRepository);
    const user: User | undefined = await repo.findById(request.params.id);

    if (!user) {
        response.status(404).end();
        return;
    }

    response.json(user);
}

/**
 * Creates a new user instance.
 */
export async function register(request: Request, response: Response): Promise<void> {
    const body = request.body as User;

    if (!hasObjectProperties(body, ['email', 'password'])) {
        response.status(400).end();
        return;
    }

    const repo: UserRepository = getCustomRepository(UserRepository);
    const user: User = new User();

    user.email = body.email;
    user.password = await Password.hash(body.password);

    const errors: ValidationError[] = await validate(user);
    if (errors.length > 0) {
        response.status(422).json({ message: 'Unprocessable Entity', errors: errors });
        return;
    }

    const roleRepo: RoleRepository = getCustomRepository(RoleRepository);
    const role = await roleRepo.findByName(Role.ROLE_USER);

    if (!role) {
        response.status(422).end();
        return;
    }

    user.roles = [role];

    try {
        await repo.save(user);
        response.status(201).json(user);
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            response.status(409).end();
            return;
        }
        response.status(422).end();
    }
}

/**
 * Removes a user by its id.
 */
export async function removeUser(request: Request, response: Response): Promise<void> {
    const repo: UserRepository = getCustomRepository(UserRepository);
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

    const repo: UserRepository = getCustomRepository(UserRepository);
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
    user.hydrate(body);

    const errors: ValidationError[] = await validate(user);
    if (errors.length > 0) {
        response.status(422).end();
        return;
    }

    await repo.save(user);
    response.status(204).end();
}

function hasObjectProperties(obj: any, properties: string[]): boolean {
    const names = Object.getOwnPropertyNames(obj);
    return properties.filter(item => names.indexOf(item) < 0).length === 0;
}
