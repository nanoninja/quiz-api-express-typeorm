import { User } from '../entity/User';
import { EntityRepository, AbstractRepository } from 'typeorm';

@EntityRepository(User)
export class UserRepository extends AbstractRepository<User> {

    async findByEmail(email: string): Promise<User | undefined> {
        return await this.repository.findOne({ where: { email: email } })
    }

    async all(): Promise<User[]> {
        return await this.repository.find();
    }

    async create(user: User): Promise<User> {
        return this.manager.save(user);
    }

    async update(user: User): Promise<User> {
        return await this.manager.save(user);
    }

    async remove(user: User): Promise<User> {
        return await this.manager.remove(user);
    }

}