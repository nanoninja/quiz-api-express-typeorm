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
        cascade: ['insert', 'update'],
        primary: true,
    })
    role: Role;

    @ManyToOne(type => Permission, role => role.rolePermissions, {
        cascade: ['insert', 'update'],
        primary: true,
        nullable: false
    })
    permission: Permission;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}
