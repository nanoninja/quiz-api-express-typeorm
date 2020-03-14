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
import { Password } from '../library/password';

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
        cascade: ['insert', 'update'],
        primary: true,
        eager: true
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
     * Sets and hashes password.
     *
     * @param {string} password
     * @return {void}
     */
    setPassword(password: string): void {
        this.password = Password.hash(password);
    }

    /**
     * Checks if a permission is set.
     *
     * @param {string} name
     * @return {boolean}
     */
    hasRole(name: string): boolean {
        const result = this.roles.find((role: Role) => {
            return role.name === name;
        });

        return result !== undefined;
    }

    /**
     * Check if this user has a specific privilege.
     *
     * @param {string} operation
     * @return {boolean}
     */
    hasPrivilege(operation: string): boolean {
        return this.roles.some((role: Role) => {
            return role.hasPermission(operation);
        });
    }

    /**
     * Hydrates this user from data.
     *
     * @param {User} data
     * @return {void}
     */
    hydrate(data: User): void {
        this.id = data.id;
        this.email = data.email;
        this.password = data.password;
        this.isActive = data.isActive;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.roles = data.roles;

        if (data.password) {
            this.setPassword(data.password);
        }

        if (data.firstName !== '') {
            this.firstName = data.firstName;
        }

        if (data.lastName !== '') {
            this.lastName = data.lastName;
        }
    }
}
