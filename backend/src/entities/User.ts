import { Entity, Property, PrimaryKey, OneToMany, Cascade, Collection, ManyToMany } from "@mikro-orm/core";
import crypto from "crypto";
import { ExamAnswer } from "./ExamAnswer";
import { Exam } from "./Exam";
import { QuestionList } from "./QuestionList";
import { ExamParticipation } from "./ExamParticipation";

@Entity()
export class User {
    @PrimaryKey({ type: "string" })
    uuid: string = crypto.randomUUID();

    @Property({ type: Date })
    created_at?: Date = new Date();

    @Property({ type: "string" })
    password_hash: string;

    @Property({ type: "string", unique: true })
    username: string;

    @Property({ type: "string" })
    name: string;

    @OneToMany(() => QuestionList, (question_list) => question_list.owned_by, { cascade: [Cascade.ALL] })
    question_lists = new Collection<QuestionList>(this);

    @OneToMany(() => Exam, (exam) => exam.hosted_by, { cascade: [Cascade.ALL] })
    hosted_exams = new Collection<QuestionList>(this);

    @ManyToMany(() => Exam, (exam) => exam.participants)
    participated_exams = new Collection<Exam>(this);

    @OneToMany(() => ExamParticipation, (participations) => participations.participant, { cascade: [Cascade.ALL] })
    exam_participations = new Collection<ExamParticipation>(this);
}
