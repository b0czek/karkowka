import { Entity, Property, PrimaryKey, ManyToOne, ArrayType, ManyToMany, Collection } from "@mikro-orm/core";
import crypto from "crypto";
import { User } from "./User";
import { Exam } from "./Exam";
import { Question } from "./Question";
import { ExamParticipation } from "./ExamParticipation";

@Entity()
export class ExamAnswer {
    @PrimaryKey({ type: "string" })
    uuid: string = crypto.randomUUID();

    @Property({ type: Date })
    anwsered_at = new Date();

    @Property({ type: "string" })
    anwser: string;

    @Property({ type: "boolean" })
    is_correct: boolean;

    @ManyToOne(() => ExamParticipation)
    participation: ExamParticipation;

    @ManyToOne(() => Question)
    question: Question;
}
