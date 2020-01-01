import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    ManyToMany,
    JoinTable
} from 'typeorm';

import { IsAlpha, IsUUID } from 'class-validator';
import { Permission } from "./Permission";
import { User } from "./User";

@Entity()
export class Role {

    public static readonly ADMIN = 'Administrator';
    public static readonly USER = 'User';
    public static readonly MANAGER = 'Manager';
    public static readonly MEMBER = 'Member';

    @IsUUID()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, length: 80 })
    @IsAlpha()
    name: string;

    @ManyToMany(type => User, user => user.roles)
    users: User[];

    @ManyToMany(type => Permission, permission => permission.roles, {
        primary: true,
        cascade: true,
        eager: true
    })
    @JoinTable({ name: 'role_has_permission' })
    permissions: Permission[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    /**
     * Check if a permission is set.
     */
    hasPermission(operation: string): boolean {
        return this.permissions.some((permission: Permission) => {
            return permission.operation === operation;
        });
    }

}
