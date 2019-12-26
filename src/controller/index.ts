import {
    Request,
    Response,
} from 'express';

export async function hello(request: Request, response: Response) {
    response.json({ message: 'Hello, World!' })
}
