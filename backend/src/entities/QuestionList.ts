import { Entity, Property, PrimaryKey, OneToMany, ManyToOne, Cascade, Collection } from "@mikro-orm/core";
import crypto from "crypto";
import { User } from "./User";
import { Question } from "./Question";
import { Exam } from "./Exam";

@Entity()
export class QuestionList {
    @PrimaryKey({ type: "string" })
    uuid: string = crypto.randomUUID();

    @ManyToOne(() => User)
    owned_by: User;

    @Property({ type: Date })
    created_at?: Date = new Date();

    @Property({ type: "string" })
    name: string;

    @OneToMany(() => Question, (question) => question.belongs_to, { cascade: [Cascade.ALL] })
    questions = new Collection<Question>(this);

    @OneToMany(() => Exam, (exam) => exam.question_list, { cascade: [Cascade.ALL] })
    utilized_in = new Collection<Exam>(this);

    @Property({ type: "boolean" })
    deleted?: boolean = false;
}
