import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany
} from 'typeorm';

import { IsOptional } from 'class-validator';
import { Category } from './Category';
import { Choice } from './Choice';
import { Quiz } from './Quiz';

@Entity('quiz_question')
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

    @ManyToOne(type => Quiz, quiz => quiz.questions)
    quiz: Quiz;

    @OneToMany(type => Choice, choice => choice.question)
    choices: Choice[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}
