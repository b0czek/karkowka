import { Entity, Property, PrimaryKey, Cascade, Collection, ManyToOne, ManyToMany, OneToMany } from "@mikro-orm/core";
import crypto from "crypto";
import { ExamAnswer } from "./ExamAnswer";
import { ExamParticipation } from "./ExamParticipation";
import { Question } from "./Question";
import { QuestionList } from "./QuestionList";
import { User } from "./User";

@Entity()
export class Exam {
    @PrimaryKey({ type: "string" })
    uuid: string = crypto.randomUUID();

    // name of the exam
    @Property({ type: "string" })
    name: string;

    // date of creation
    @Property({ type: Date })
    created_at?: Date = new Date();

    // date at which the exam should be open for joining
    @Property({ type: Date })
    started_at: Date = new Date();

    // seconds to join the started exam
    @Property({ type: "number" })
    time_to_join: number;

    // time in seconds that the exam should last for
    @Property({ type: "number" })
    duration: number;

    // number of question in the exam
    @Property({ type: "number" })
    questions_count: number;

    // creator of the exam
    @ManyToOne(() => User)
    hosted_by: User;

    // list of questions that utilized_questions are randomly chosen from
    @ManyToOne(() => QuestionList)
    question_list: QuestionList;

    // sublist of question_list including questions_count number of questions
    @ManyToMany(() => Question, (question) => question.utilized_in, { owner: true })
    utilized_questions = new Collection<Question>(this);

    // invited users
    @ManyToMany(() => User, (user) => user.participated_exams, { owner: true })
    participants = new Collection<User>(this);

    // acts of participation
    @OneToMany(() => ExamParticipation, (participation) => participation.exam, { cascade: [Cascade.ALL] })
    participations = new Collection<ExamParticipation>(this);
}
