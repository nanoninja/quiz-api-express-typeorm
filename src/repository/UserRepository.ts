import {
    AbstractRepository,
    EntityRepository,
    FindConditions,
    FindManyOptions,
    ObjectID,
    RemoveOptions
} from 'typeorm';

import { User } from '../entity/User';

@EntityRepository(User)
export class UserRepository extends AbstractRepository<User> {

    /**
     * Finds entities by ids.
     * Optionally find options can be applied.
     */
    async find(options?: FindManyOptions): Promise<User[]> {
        return await this.repository.find(options);
    }

    /**
     * Counts entities that match given conditions.
     */
    async count(conditions?: FindConditions<User>): Promise<number> {
        return this.repository.count(conditions);
    }

    /**
     * Finds entities by its email.
     */
    async findByEmail(email: string): Promise<User | undefined> {
        return await this.repository.findOne({ where: { email: email } })
    }

    /**
     * Finds entities by ids.
     */
    async findById(id: string | number | ObjectID): Promise<User | undefined> {
        return await this.repository.findOne(id);
    }

    /**
     * Removes a given entity from the database.
     */
    async remove(user: User, options?: RemoveOptions): Promise<User> {
        return await this.manager.remove(user);
    }

    /**
     * Creates a new entity instance.
     */
    async save(user: User): Promise<User> {
        return await this.manager.save(user);
    }

}