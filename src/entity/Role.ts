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

    public static readonly USER = 'user';
    public static readonly ADMIN = 'admin';
    public static readonly EVERYONE = 'everyone';

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
    hasPermission(description: string): boolean {
        return this.permissions.some((permission: Permission) => {
            return permission.description === description;
        });
    }

}
