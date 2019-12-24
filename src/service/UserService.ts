import { getManager } from 'typeorm';
import { User } from '../entity/User';

export class UserService
{
    async all(): Promise<User[]> {
        const repo = getManager().getRepository(User);
        return await repo.find();
    }

    async save(user: User) {
        
    }
}