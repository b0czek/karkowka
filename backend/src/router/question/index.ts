import { checkSchema, Schema } from "express-validator";
import validators from "../validators";
import express from "express";
import { questionListRouterCreate } from "./list";
import { questionListsRouterCreate } from "./lists";

export const questionRouterCreate = () => {
    const router = express.Router();

    router.use("/list", questionListRouterCreate());
    router.use("/lists", questionListsRouterCreate());
    return router;
};

export const questionArraySchema: Schema = {
    questions: {
        isArray: {
            bail: true,
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

export interface Question {
    question: string;
    answers: string[];
}
