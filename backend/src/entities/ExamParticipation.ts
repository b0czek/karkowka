import { Entity, Property, PrimaryKey, Cascade, Collection, ManyToOne, ManyToMany, OneToMany } from "@mikro-orm/core";
import crypto from "crypto";
import { ExamAnswer } from "./ExamAnswer";
import { Exam } from "./Exam";
import { User } from "./User";

@Entity()
export class ExamParticipation {
    @PrimaryKey({ type: "string" })
    uuid: string = crypto.randomUUID();

    @Property({ type: Date })
    joined_at?: Date = new Date();

    @ManyToOne(() => User)
    participant: User;

    @ManyToOne(() => Exam)
    exam: Exam;

    @OneToMany(() => ExamAnswer, (answer) => answer.participation, { cascade: [Cascade.ALL] })
    answers = new Collection<ExamAnswer>(this);
}
