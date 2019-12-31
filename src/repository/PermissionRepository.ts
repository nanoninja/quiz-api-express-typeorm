import { Permission } from '../entity/Permission';
import { Repository } from 'typeorm';

export class PermissionRepository extends Repository<Permission> {

    /**
     * Finds a permission by its name.
     */
    async findRoleByName(name: string): Promise<Permission | undefined> {
        return await this.findOne({ where: { name: name } })
    }

}
