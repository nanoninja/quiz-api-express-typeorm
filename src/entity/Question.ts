import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne
} from 'typeorm';

import { IsOptional } from 'class-validator';
import { Category } from './Category';

@Entity()
export class Question {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    type: string;

    @Column({ type: 'text' })
    text: string;

    @Column({ default: true })
    isVisble: boolean

    @IsOptional()
    @Column({ type: 'text' })
    explainAnswer: string

    @ManyToOne(type => Category, category => category.questions)
    category: Category;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}
