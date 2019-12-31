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

    public static readonly USER = 'user';
    public static readonly ADMIN = 'admin';

    @IsUUID()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, length: 80 })
    @IsAlpha()
    name: string;

    @OneToMany(type => UserRole, userRole => userRole.role, {
        primary: true,
        cascade: ['insert', 'update'],
        eager: true
    })
    userRoles: UserRole[];

    @OneToMany(type => RolePermission, rolePermission => rolePermission.permission, {
        primary: true,
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
    hasPermission(description: string): boolean {
        return this.rolePermissions.some((rolePermission: RolePermission): boolean => {
            return rolePermission.permission.description === description;
        });
    }

}
