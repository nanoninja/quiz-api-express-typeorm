import { Request, Response } from 'express';
import { validate, Validator, ValidationError } from 'class-validator';
import { getCustomRepository } from 'typeorm';
import { Password } from '../library/password';
import { User } from '../entity/User';
import { Role } from '../entity/Role';
import { RoleRepository } from '../repository/RoleRepository';
import { UserRepository } from '../repository/UserRepository';
import { createError, HttpError } from '../app/error';
import { JWT } from '../library/jwt';
import * as httpContext from 'express-http-context';
import { UserRole } from '../entity/UserRole';

/**
 * Authenticates user by its email.
 */
export async function authenticate(request: Request, response: Response): Promise<void> {
    const validator: Validator = new Validator();
    const email: string = request.body.email;
    const password: string = request.body.password;
    const err = createError(401, 'Unauthorized', 'Authentication has failed');

    if (!validator.isEmail(email) || !validator.isNotEmpty(password)) {
        response.status(err.status).json(err);
        return;
    }

    const repo: UserRepository = getCustomRepository(UserRepository);
    const user: User | undefined = await repo.findByEmail(email);

    if (!user) {
        response.status(err.status).json(err);
        return;
    }

    if (!(await Password.verify(password, user.password))) {
        response.status(err.status).json(err);
        return;
    }

    await JWT.sign(user, function (error: Error, token: string) {
        if (!err) {
            const err = createError(500, 'Internal Server Error', 'Unable to create access token');
            response.status(err.status).json(err);
            return;
        }

        response.status(201).json({ access_token: token });
    });
}

/**
 * Gets all users.
 */
export async function getUsers(request: Request, response: Response): Promise<void> {
    const user: User = httpContext.get('user');

    console.log(user.userRoles);
    if (!user.hasPrivilege('UserList')) {
        response.status(403).json({ message: 'Forbidden' });
        return;
    }

    const repo: UserRepository = getCustomRepository(UserRepository);
    const users: User[] = await repo.find();

    response.json(users);
}

/**
 * Gets a user by its email.
 */
export async function getUserByEmail(request: Request, response: Response): Promise<void> {
    const validator: Validator = new Validator();

    if (!validator.isEmail(request.params.email)) {
        const err = createError(400, 'Bad Request', 'Email is invalid');
        response.status(err.status).json(err);
        return;
    }

    const repo: UserRepository = getCustomRepository(UserRepository);
    const user: User | undefined = await repo.findByEmail(request.params.email);

    if (!user) {
        const err = createError(404, 'Not Found', 'User was not found or does not exist');
        response.status(err.status).json(err);
        return;
    }

    response.json(user);
}

/**
 * Gets a user by its id.
 */
export async function getUserById(request: Request, response: Response): Promise<void> {
    const validator: Validator = new Validator();

    if (!validator.isUUID(request.params.id)) {
        const err = createError(400, 'Bad Request', 'Invalid user ID');
        response.status(err.status).json(err);
        return;
    }

    const repo: UserRepository = getCustomRepository(UserRepository);
    const user: User | undefined = await repo.findById(request.params.id);

    if (!user) {
        const err = createError(404, 'Not Found', 'User was not found or does not exist');
        response.status(err.status).json(err);
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
        const err = createError(400, 'Bad Request', 'Data format is invalid');
        response.status(err.status).json(err);
        return;
    }

    const repo: UserRepository = getCustomRepository(UserRepository);
    const user: User = new User();

    user.email = body.email;
    user.password = body.password;

    const errors: ValidationError[] = await validate(user);
    if (errors.length > 0) {
        const err = createError(400, 'Bad Request');
        setErrorConstraints(err, errors);

        response.status(err.status).json(err);
        return;
    }

    await Password.hash(body.password);

    const roleRepo: RoleRepository = getCustomRepository(RoleRepository);
    const role = await roleRepo.findByName(Role.USER);

    if (!role) {
        const err = createError(500, 'Internal Server Error');
        response.status(err.status).json(err);
        return;
    }

    const userRole: UserRole = new UserRole();

    userRole.role = role;
    userRole.user = user;
    user.userRoles = [userRole];

    try {
        await repo.save(user);
        response.status(201).json(user);
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            const err = createError(409, 'Conflict', `${body.email} is already taken`);
            response.status(err.status).json(err);
            return;
        }

        const err = createError(422, 'Unprocessable Entity');
        response.status(err.status).json(err);
    }
}

/**
 * Removes a user by its id.
 */
export async function removeUser(request: Request, response: Response): Promise<void> {
    const validator: Validator = new Validator();

    if (!validator.isUUID(request.params.id)) {
        const err = createError(400, 'Bad Request', 'ID is invalid');
        response.status(err.status).json(err);
        return;
    }

    const repo: UserRepository = getCustomRepository(UserRepository);
    const user: User | undefined = await repo.findById(request.params.id);

    if (!user) {
        const err = createError(404, 'Not Found', 'User was not found or does not exist');
        response.status(err.status).json(err);
        return;
    }

    try {
        await repo.remove(user);
        response.status(204).end();
    } catch (error) {
        const err = createError(500, 'Internal Server Error', 'Unable to remove user');
        response.status(err.status).json(err);
    }
}

/**
 * Updates user entity.
 */
export async function updateUser(request: Request, response: Response): Promise<void> {
    const validator: Validator = new Validator();

    if (!validator.isUUID(request.body.id)) {
        const err = createError(400, 'Bad Request', 'ID is invalid');
        response.status(err.status).json(err);
        return;
    }

    const repo: UserRepository = getCustomRepository(UserRepository);
    const data: User | undefined = await repo.findById(request.body.id);

    if (!data) {
        const err = createError(404, 'Not Found', 'User was not found or does not exist');
        response.status(err.status).json(err);
        return;
    }

    if (!hasObjectProperties(request.body, Object.getOwnPropertyNames(data))) {
        const err = createError(400, 'Bad Request', 'Data format is invalid');
        response.status(err.status).json(err);
        return;
    }

    const body: User = request.body as User;
    const user: User = new User();

    body.createdAt = data.createdAt;
    body.updatedAt = data.createdAt;
    user.hydrate(body);

    const errors: ValidationError[] = await validate(user);

    if (errors.length > 0) {
        const err = createError(400, 'Bad Request');
        setErrorConstraints(err, errors);

        response.status(err.status).json(err);
        return;
    }

    await repo.save(user);
    response.status(204).end();
}

function setErrorConstraints(err: HttpError, errors: ValidationError[]) {
    errors.forEach((error: ValidationError) => {
        for (let [key, value] of Object.entries(error.constraints)) {
            err.addItem('Invalid value', value, key);
        }
    });
}

function hasObjectProperties(obj: any, properties: string[]): boolean {
    const names = Object.getOwnPropertyNames(obj);
    return properties.filter(item => names.indexOf(item) < 0).length === 0;
}
