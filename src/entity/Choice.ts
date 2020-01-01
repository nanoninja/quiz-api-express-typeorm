import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
    ManyToOne
} from 'typeorm';

import { MaxLength, IsUUID } from 'class-validator';
import { Question } from './Question';

@Entity('quiz_question_choice')
export class Choice {

    @IsUUID()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @MaxLength(255)
    @Column()
    text: string;

    @Column({ default: false })
    isCorrect: boolean;

    // One choice (self) for many questions
    @ManyToOne(type => Question, question => question.choices)
    question: Question;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}
