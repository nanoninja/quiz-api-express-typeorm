import {
    Request,
    Response
} from 'express';

import { getManager } from 'typeorm';
import { User } from "../entity/User";

export async function Home(request: Request, response: Response) {
    const repo = getManager().getRepository(User);

    console.log("Inserting a new user into the database...");
    const user = new User();
    user.email = 'saw.timber11@gmail.com';
    user.password = '1234';
    user.firstName = "Timber";
    user.lastName = "Saw";
    user.age = 25;
    await repo.save(user);
    console.log("Saved a new user with id: " + user.id);

    console.log("Loading users from the database...");
    const users = await repo.find(user);
    console.log("Loaded users: ", users);

    response.send('Hello, World');
}