import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany
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

import { UserRole } from './UserRole';

@Entity()
export class User {

    @IsOptional()
    @IsUUID()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @IsEmail()
    @Column({ length: 140, unique: true })
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

    @OneToMany(type => UserRole, userRole => userRole.user, {
        cascade: ['insert', 'update'],
        eager: true
    })
    userRoles: UserRole[];

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
        return this.userRoles.some((userRole: UserRole) => {
            return userRole.role.name === name;
        });
    }

    /**
     * Check if this user has a specific privilege.
     */
    hasPrivilege(permission: string): boolean {
        return this.userRoles.some((userRole: UserRole): boolean => {
            return userRole.role.hasPermission(permission);
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
        this.userRoles = data.userRoles;

        if (data.firstName !== '') {
            this.firstName = data.firstName;
        }

        if (data.lastName !== '') {
            this.lastName = data.lastName;
        }
    }

}
