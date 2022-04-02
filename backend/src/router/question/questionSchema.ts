import { ParamSchema, Schema } from "express-validator";
import { Question } from "../../entities/Question";
import validators from "../validators";

export const questionObjectCreate = (question: Question) => {
    return { uuid: question.uuid, answers: question.answers, question: question.question };
};

export const questionParamSchema: ParamSchema = {
    isArray: {
        bail: true,
    },
    custom: {
        bail: true,
        errorMessage: "invalid answers",
        options: (arr: string[]) => arr.every((str) => typeof str === "string" && str.length > 0),
    },
    customSanitizer: {
        options: (arr: string[]) => arr.map((str) => str.trim()),
    },
};

export const questionArraySchema: Schema = {
    questions: {
        isArray: {
            bail: true,
            options: {
                min: 0,
            },
        },
    },
    "questions.*.question": validators.string,
    "questions.*.answers": questionParamSchema,
};
export interface QuestionBody {
    question: string;
    answers: string[];
}
