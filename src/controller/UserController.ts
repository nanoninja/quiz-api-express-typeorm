import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { validate, Validator, ValidationError } from 'class-validator';
import { getCustomRepository } from 'typeorm';
import { Password } from '../library/password';
import { User } from '../entity/User';
import { Role } from '../entity/Role';
import { RoleRepository } from '../repository/RoleRepository';
import { UserRepository } from '../repository/UserRepository';
import { UnauthorizedError, InternalError, NotFoundError, ForbidenError, BadRequestError, ConflictError, UnprocessableEntity } from '../app/error';
import { JWT } from '../library/jwt';

export class UserController extends BaseController {

    /**
     * User repository.
     */
    private userRepository: UserRepository = getCustomRepository(UserRepository);

    /**
     * Authenticates user by its email.
     */
    async authenticate(request: Request, response: Response) {
        const validator: Validator = new Validator();
        const email: string = request.body.email;
        const password: string = request.body.password;

        if (!validator.isEmail(email) || !validator.isNotEmpty(password)) {
            throw new NotFoundError('Authentication has failed');
        }

        const user: User | undefined = await this.userRepository.findByEmail(email);

        if (!user || !(await Password.verify(password, user.password))) {
            throw new UnauthorizedError('Authentication has failed');
        }

        const token: string = await JWT.sign(user);
        if (token === '') {
            throw new InternalError('Unable to create token');
        }

        response.status(201);
        return { access_token: token };
    }

    /**
     * Gets all users.
     */
    async getUsers(request: Request, response: Response) {
        if (!this.hasPrivilege('UserList')) {
            throw new ForbidenError();
        }

        return await this.userRepository.find();
    }

    /**
     * Gets a user by its email.
     */
    async getUserByEmail(request: Request, response: Response) {
        if (!this.hasPrivilege('UserView')) {
            throw new ForbidenError();
        }

        const validator: Validator = new Validator();
        if (!validator.isEmail(request.params.email)) {
            throw new BadRequestError();
        }

        const user: User | undefined = await this.userRepository.findByEmail(request.params.email);
        if (!user) {
            throw new NotFoundError('user');
        }

        return user;
    }

    /**
     * Gets a user by its id.
     */
    async getUserById(request: Request, response: Response) {
        if (!this.hasPrivilege('UserView')) {
            throw new ForbidenError();
        }

        if (!(new Validator()).isUUID(request.params.id)) {
            throw new BadRequestError();
        }

        const user: User | undefined = await this.userRepository.findOne(request.params.id);
        if (!user) {
            throw new NotFoundError('user');
        }

        return user;
    }

    /**
     * Creates a new user instance.
     */
    async register(request: Request, response: Response) {
        const body = request.body as User;

        if (!this.hasObjectProperties(body, ['email', 'password'])) {
            throw new BadRequestError('Data format is invalid');
        }

        const user: User = new User();
        user.email = body.email;
        user.password = body.password;

        const errors: ValidationError[] = await validate(user);
        if (errors.length > 0) {
            throw new BadRequestError('Input error', errors);
        }

        await Password.hash(body.password);

        const roleRepo: RoleRepository = getCustomRepository(RoleRepository);
        const role = await roleRepo.findByName(Role.USER);

        if (!role) {
            throw new InternalError();
        }

        user.roles = [role];

        try {
            return await this.userRepository.save(user);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new ConflictError(`${body.email} is already taken`);
            }
            throw new UnprocessableEntity();
        }
    }

    /**
     * Removes a user by its id.
     */
    async removeUser(request: Request, response: Response) {
        const owner: User = this.getContextUser();

        if (!this.hasPrivilege('UserDelete')) {
            throw new ForbidenError();
        }

        if (!(new Validator()).isUUID(request.params.id)) {
            throw new BadRequestError('ID is invalid');
        }

        const user: User | undefined = await this.userRepository.findOne(request.params.id);
        if (!user) {
            throw new NotFoundError('user');
        }

        if (owner.id === user.id) {
            throw new UnauthorizedError('Unable to delete your own user');
        }

        try {
            response.status(204);
            return await this.userRepository.remove(user);
        } catch (error) {
            throw new InternalError('Unable to remove user');
        }
    }

    /**
     * Updates user entity.
     */
    async updateUser(request: Request, response: Response) {
        if (!this.hasPrivilege('UserEdit')) {
            throw new ForbidenError();
        }

        if (!(new Validator()).isUUID(request.body.id)) {
            throw new BadRequestError('ID is invalid');
        }

        const data: User | undefined = await this.userRepository.findOne(request.body.id);
        if (!data) {
            throw new NotFoundError('User was not found or does not exist');
        }

        if (!this.hasObjectProperties(request.body, Object.getOwnPropertyNames(data))) {
            throw new BadRequestError('Data format is invalid');
        }

        const body: User = request.body as User;
        const user: User = new User();

        body.createdAt = data.createdAt;
        body.updatedAt = data.createdAt;
        user.hydrate(body);

        const errors: ValidationError[] = await validate(user);

        if (errors.length > 0) {
            throw new BadRequestError('Data format is invalid', errors);
        }

        try {
            response.status(204);
            return await this.userRepository.save(user);
        } catch (error) {
            throw new InternalError();
        }
    }

    hasObjectProperties(obj: any, properties: string[]): boolean {
        const names = Object.getOwnPropertyNames(obj);
        return properties.filter(item => names.indexOf(item) < 0).length === 0;
    }

}
