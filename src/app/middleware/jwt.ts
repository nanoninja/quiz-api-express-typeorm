import { Request, Response, NextFunction } from 'express';
import { JWT } from "../../library/jwt";
import { createError } from '../error';

export async function jwtVerify(request: Request, response: Response, next: NextFunction): Promise<void> {
    const authorisation: string | undefined = request.header('Authorization');

    if (!authorisation) {
        const err = createError(401, 'Unauthorized');
        response.status(err.status).json(err);
        return;
    }

    const token: string = authorisation.substr('Bearer '.length);

    JWT.verify(token, (err: Error) => {
        if (err) {
            const err = createError(401, 'Unauthorized');
            response.status(err.status).json(err);
            return;
        }
        next();
    });
}
