import { Schema } from "express-validator";
import validators from "../validators";

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
    "questions.*.answers": {
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
    },
};
export interface QuestionBody {
    question: string;
    answers: string[];
}
