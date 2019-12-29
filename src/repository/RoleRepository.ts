
import { AbstractRepository, EntityRepository } from 'typeorm';
import { Role } from '../entity/Role';

@EntityRepository(Role)
export class RoleRepository extends AbstractRepository<Role> {

    /**
     * Finds a role by its name.
     */
    async findByName(name: string): Promise<Role | undefined> {
        return await this.repository.findOne({ where: { name: name } })
    }

}
