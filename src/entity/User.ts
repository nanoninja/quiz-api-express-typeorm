import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';

import {
    IsAlpha,
    IsDate,
    IsEmail,
    MaxLength,
    IsOptional,
    IsUUID,
    IsNotEmpty,
    IsBoolean
} from 'class-validator';

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
    @MaxLength(255)
    @Column()
    password: string;

    @IsOptional()
    @IsNotEmpty()
    @IsAlpha()
    @Column({ default: '' })
    firstName: string;

    @IsOptional()
    @IsNotEmpty()
    @IsAlpha()
    @Column({ default: '' })
    lastName: string;

    @IsOptional()
    @IsBoolean()
    @Column({ default: false })
    isActive: boolean;

    @IsOptional()
    @IsDate()
    @CreateDateColumn()
    createdAt: Date;

    @IsOptional()
    @IsDate()
    @UpdateDateColumn()
    updatedAt: Date;
}
