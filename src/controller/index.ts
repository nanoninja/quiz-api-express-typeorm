import {
    Request,
    Response,
} from 'express';

import { getCustomRepository } from 'typeorm';
import { User } from "../entity/User";
import { UserRepository } from '../repository/UserRepository';

export async function Home(request: Request, response: Response) {
    const repo: UserRepository = getCustomRepository(UserRepository);

    // const user = new User();
    // user.email = 'saw.timber16@gmail.com';
    // user.password = '1234';
    // user.firstName = "Timber";
    // user.lastName = "Saw";
    // user.age = 25;

    const user = repo.findByEmail('saw.timber11@gmail.com')

    user.then(
        (user: User | undefined) => console.log(user),
        (err: Error) => console.log(err.message)
    );

    repo.all().then(
        (users: User[]) => response.json(users),
        (err: Error) => console.log(err)
    );
    // await repo.create(user).then(
    //     () => {
    //         const users = repo.all();
    //         console.log(users);
    //         response.json(users);
    //     },
    //     (err: Error) => {
    //         response.json(err);
    //     }
    // );
}