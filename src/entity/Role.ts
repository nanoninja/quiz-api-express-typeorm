import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    OneToMany
} from 'typeorm';

import { IsAlpha, IsUUID } from 'class-validator';
import { UserRole } from './UserRole';
import { RolePermission } from './RolePermission';

@Entity()
export class Role {

    public static readonly ADMIN = 'Administrator';
    public static readonly MANAGER = 'Manager';
    public static readonly MEMBER = 'Member';
    public static readonly USER = 'User';

    @IsUUID()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, length: 80 })
    @IsAlpha()
    name: string;

    @OneToMany(type => UserRole, userRole => userRole.role, {
        cascade: ['insert', 'update'],
        nullable: false
    })
    userRoles: UserRole[];

    @OneToMany(type => RolePermission, rolePermission => rolePermission.permission, {
        cascade: ['insert', 'update'],
        eager: true
    })
    rolePermissions: RolePermission[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    /**
     * Check if a permission is set.
     */
    hasPermission(operation: string): boolean {
        if (this.rolePermissions && this.rolePermissions.length === 0) {
            return false;
        }

        return this.rolePermissions.some((rolePermission: RolePermission): boolean => {
            return rolePermission.permission.operation === operation;
        });
    }

}
