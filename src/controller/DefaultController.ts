import { Request, Response } from 'express';

export class DefaultController {

    async hello(request: Request, response: Response) {
        response.json({ message: 'Hello, World!' });
    }

}