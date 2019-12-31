import {
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn,
    Entity
} from 'typeorm';

import { IsUUID } from 'class-validator';
import { User } from './User';
import { Role } from './Role';

@Entity()
export class UserRole {

    @IsUUID()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(type => User, user => user.userRoles, {
        cascade: ['insert', 'update']
    })
    user: User;

    @ManyToOne(type => Role, role => role.userRoles, {
        cascade: ['insert', 'update']
    })
    role: Role;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}