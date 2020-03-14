import { Permission } from '../entity/Permission';
import { Repository } from 'typeorm';

export class PermissionRepository extends Repository<Permission> {

    /**
     * Finds a permission by its description.
     *
     * @param {string} operation
     */
    async findByOperation(operation: string): Promise<Permission | undefined> {
        return await this.findOne({ where: { operation: operation } })
    }

}
