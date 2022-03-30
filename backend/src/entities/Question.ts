import { Entity, Property, PrimaryKey, ManyToOne, ArrayType, ManyToMany, Collection } from "@mikro-orm/core";
import crypto from "crypto";
import { User } from "./User";
import { QuestionList } from "./QuestionList";
import { Exam } from "./Exam";

@Entity()
export class Question {
    @PrimaryKey({ type: "string" })
    uuid: string = crypto.randomUUID();

    @Property({ type: ArrayType, nullable: false })
    answer: string[];

    @Property({ type: "string" })
    question: string;

    @ManyToOne(() => QuestionList)
    belongs_to: QuestionList;

    @ManyToMany(() => Exam, (exam) => exam.utilized_questions)
    utilized_in = new Collection<Exam>(this);
}
