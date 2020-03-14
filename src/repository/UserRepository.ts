import { Repository, EntityRepository } from 'typeorm';
import { User } from '../entity/User';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    /**
     * Finds entities by its email.
     *
     * @param {string} email
     * @return {Promise} User|undefined
     */
    async findByEmail(email: string): Promise<User | undefined> {
        return await this.findOne({ where: { email: email } })
    }

}
