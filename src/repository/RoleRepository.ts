
import { EntityRepository, Repository } from 'typeorm';
import { Role } from '../entity/Role';

@EntityRepository(Role)
export class RoleRepository extends Repository<Role> {

    /**
     * Finds a role by its name.
     */
    async findByName(name: string): Promise<Role | undefined> {
        return await this.findOne({ where: { name: name } })
    }

}
