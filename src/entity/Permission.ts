import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
import { IsUUID } from 'class-validator';
import { Role } from './Role';

@Entity()
export class Permission {

    @IsUUID()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, length: 80 })
    operation: string;

    @Column({ length: 255 })
    description: string;

    @ManyToMany(type => Role, role => role.permissions)
    roles: Role[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
