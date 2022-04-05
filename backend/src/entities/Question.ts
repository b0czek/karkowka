import { Entity, Property, PrimaryKey, ManyToOne, ArrayType, ManyToMany, Collection, OneToMany, Cascade } from "@mikro-orm/core";
import crypto from "crypto";
import { User } from "./User";
import { QuestionList } from "./QuestionList";
import { Exam } from "./Exam";
import { ExamAnswer } from "./ExamAnswer";

@Entity()
export class Question {
    @PrimaryKey({ type: "string" })
    uuid: string = crypto.randomUUID();

    @Property({ type: Date })
    created_at? = new Date();

    @Property({ type: ArrayType, nullable: false })
    answers: string[];

    @Property({ type: "string" })
    question: string;

    @ManyToOne(() => QuestionList)
    belongs_to: QuestionList;

    @ManyToMany(() => Exam, (exam) => exam.utilized_questions)
    utilized_in = new Collection<Exam>(this);

    @OneToMany(() => ExamAnswer, (answer) => answer.question, { cascade: [Cascade.ALL] })
    user_answers = new Collection<ExamAnswer>(this);

    @Property({ type: "boolean" })
    deleted?: boolean = false;
}
