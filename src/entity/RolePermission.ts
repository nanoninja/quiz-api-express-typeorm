import {
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn,
    Entity
} from 'typeorm';

import { IsUUID } from 'class-validator';
import { Role } from './Role';
import { Permission } from './Permission';

@Entity()
export class RolePermission {

    @IsUUID()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(type => Role, user => user.rolePermissions, {
        cascade: ['insert', 'update']
    })
    role: Role;

    @ManyToOne(type => Permission, role => role.rolePermissions, {
        cascade: ['insert', 'update'],
        nullable: false
    })
    permission: Permission;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}
