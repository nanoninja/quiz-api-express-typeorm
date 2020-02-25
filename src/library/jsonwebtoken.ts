import { Request, Response, NextFunction } from 'express';
import { getCustomRepository } from 'typeorm';
import * as httpContext from 'express-http-context';

import { User } from '../entity/User';
import { UnauthorizedError, InternalError } from '../app/error';
import { UserRepository } from '../repository/UserRepository';

export class JsonWebToken {

    async verify(request: Request, response: Response, next: NextFunction) {
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
}