import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn,
    OneToMany
} from 'typeorm';

import { IsAlpha, IsUUID } from 'class-validator';
import { RolePermission } from './RolePermission';

@Entity()
export class Permission {

    @IsUUID()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, length: 80 })
    @IsAlpha()
    description: string;

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
}
