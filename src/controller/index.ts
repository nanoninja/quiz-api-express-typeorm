import {
    Request,
    Response
} from 'express';

export async function Home(request: Request, response: Response) {
    response.send('Hello, World');
}