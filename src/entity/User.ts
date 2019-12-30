import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany,
    JoinTable
} from 'typeorm';

import {
    IsAlpha,
    IsDate,
    IsEmail,
    MaxLength,
    IsOptional,
    IsUUID,
    IsNotEmpty,
    IsBoolean,
    IsString,
    MinLength
} from 'class-validator';
import { Role } from './Role';

@Entity()
export class User {

    @IsOptional()
    @IsUUID()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @IsEmail()
    @Column({
        length: 140,
        unique: true
    })
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(255)
    @Column()
    password: string;

    @IsOptional()
    @IsAlpha()
    @Column({ default: '' })
    firstName: string;

    @IsOptional()
    @IsAlpha()
    @Column({ default: '' })
    lastName: string;

    @IsOptional()
    @IsBoolean()
    @Column({ default: false })
    isActive: boolean;

    @ManyToMany(type => Role, role => role.users, {
        primary: true,
        eager: true,
        cascade: ['insert', 'update']
    })
    @JoinTable({ name: 'user_has_role' })
    roles: Role[];

    @IsOptional()
    @IsDate()
    @CreateDateColumn()
    createdAt: Date;

    @IsOptional()
    @IsDate()
    @UpdateDateColumn()
    updatedAt: Date;

    /**
     * Check if a permission is set.
     */
    hasRole(name: string): boolean {
        const result = this.roles.find((role: Role) => {
            return role.name === name;
        });

        return result !== undefined;
    }

    /**
     * Check if this user has a specific privilege.
     */
    hasPrivilege(permission: string): boolean {
        return this.roles.some((role: Role) => {
            return role.hasPermission(permission);
        });
    }

    /**
     * Hydrates this user from data.
     */
    hydrate(data: User) {
        this.id = data.id;
        this.email = data.email;
        this.password = data.password;
        this.isActive = data.isActive;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.roles = data.roles;

        if (data.firstName !== '') {
            this.firstName = data.firstName;
        }

        if (data.lastName !== '') {
            this.lastName = data.lastName;
        }
    }
}
