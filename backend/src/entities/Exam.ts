import { Entity, Property, PrimaryKey, Cascade, Collection, ManyToOne, ManyToMany } from "@mikro-orm/core";
import crypto from "crypto";
import { Question } from "./Question";
import { QuestionList } from "./QuestionList";
import { User } from "./User";

@Entity()
export class Exam {
    @PrimaryKey({ type: "string" })
    uuid: string = crypto.randomUUID();

    @Property({ type: "string" })
    name: string;

    @ManyToOne(() => User)
    hosted_by: User;

    @ManyToOne(() => QuestionList)
    question_list: QuestionList;

    @ManyToMany(() => Question, (question) => question.utilized_in, { owner: true, cascade: [Cascade.ALL] })
    utilized_questions = new Collection<Question>(this);

    @ManyToMany(() => User, (user) => user.participated_exams, { owner: true, cascade: [Cascade.ALL] })
    participants = new Collection<User>(this);
}
