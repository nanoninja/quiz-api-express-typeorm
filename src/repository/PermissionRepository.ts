import { Permission } from '../entity/Permission';
import { Repository } from 'typeorm';

export class PermissionRepository extends Repository<Permission> {

    /**
     * Finds a permission by its description.
     */
    async findRoleByName(description: string): Promise<Permission | undefined> {
        return await this.findOne({ where: { description: description } })
    }

}
