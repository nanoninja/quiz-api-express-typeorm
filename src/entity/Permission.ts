import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn,
    OneToMany,
} from 'typeorm';

import { IsUUID, MaxLength } from 'class-validator';
import { RolePermission } from './RolePermission';

@Entity()
export class Permission {

    @IsUUID()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, length: 60 })
    @MaxLength(60)
    operation: string;

    @Column()
    @MaxLength(255)
    description: string;

    @OneToMany(type => RolePermission, rolePermission => rolePermission.permission, {
        cascade: ['insert', 'update'],
        nullable: false,
        eager: true
    })
    rolePermissions: RolePermission[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
