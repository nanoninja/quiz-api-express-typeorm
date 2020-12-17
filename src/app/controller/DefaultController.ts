import { Request, Response } from 'express';
import { BaseController } from './BaseController';

export class DefaultController extends BaseController {

    async hello(request: Request, response: Response) {
        return { message: 'Hello, World' };
    }

}