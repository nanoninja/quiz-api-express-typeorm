import { Request, Response } from 'express';

export async function hello(request: Request, response: Response): Promise<void> {
    response.json({ message: 'Hello, World!' })
}
