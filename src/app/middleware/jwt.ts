import { Request, Response, NextFunction } from 'express';
import * as httpContext from 'express-http-context';
import { JWT } from "../../library/jwt";
import { createError } from '../error';
import { User } from '../../entity/User';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../../repository/UserRepository';

export async function jwtVerify(request: Request, response: Response, next: NextFunction): Promise<void> {
    const authorisation: string | undefined = request.header('Authorization');

    if (!authorisation) {
        const err = createError(401, 'Unauthorized');
        response.status(err.status).json(err);
        return;
    }

    const token: string = authorisation.substr('Bearer '.length);

    JWT.verify(token, async (err: Error, encoded: { [key: string]: any } | string) => {
        if (err) {
            const err = createError(401, 'Unauthorized');
            response.status(err.status).json(err);
            return;
        }

        if (typeof encoded === 'string') {
            const err = createError(500, 'Internal Server Error');
            response.status(err.status).json(err);
            return;
        }
 
        const repo: UserRepository = getCustomRepository(UserRepository);
        const user: User | undefined = await repo.findById(encoded.id);

        if (!user) {
            const err = createError(401, 'Unauthorized');
            response.status(err.status).json(err);
            return;
        }

        httpContext.set('user', user);
        next();
    });
}