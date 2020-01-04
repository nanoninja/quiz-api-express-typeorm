import { Request, Response, NextFunction } from 'express';
import * as httpContext from 'express-http-context';
import { JWT } from "../../library/jwt";
import { UnauthorizedError, InternalError } from '../error';
import { User } from '../../entity/User';
import { UserRepository } from '../../repository/UserRepository';
import { getCustomRepository } from 'typeorm';

export async function jwtVerify(request: Request, response: Response, next: NextFunction) {
    const authorisation: string | undefined = request.header('Authorization');

    try {
        if (!authorisation) {
            throw new UnauthorizedError();
        }

        const token: string = authorisation.substr('Bearer '.length);

        try {
            const decoded: any = await JWT.verify(token);

            if (typeof decoded === 'string') {
                throw new InternalError();
            }

            const repo: UserRepository = getCustomRepository(UserRepository);
            const user: User | undefined = await repo.findOne(decoded.id);

            if (!user) {
                throw new UnauthorizedError();
            }

            httpContext.set('user', user);
            next();

        } catch (error) {
            throw new UnauthorizedError();
        }

    } catch (error) {
        next(error);
    }
}
