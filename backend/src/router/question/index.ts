import { checkSchema, Schema } from "express-validator";
import validators, { rejectIfBadRequest } from "../validators";
import express, { Request, Response } from "express";
import { questionListRouterCreate } from "./list";
import { ExpressSession } from "../expressSession";
import { Database } from "../../database";
import { Question } from "../../entities/Question";
import { QuestionList } from "../../entities/QuestionList";
import { AppRouter } from "..";
import { QuestionBody, questionObjectCreate, questionParamSchema } from "./questionSchema";
import { questionsRouterCreate } from "./questions";

export const questionRouterCreate = () => {
    const router = express.Router();

    router.use("/list", questionListRouterCreate());
    router.use("/questions", questionsRouterCreate());

    router.get(
        "/",
        ExpressSession.verifyLoggedIn,
        checkSchema(questionGetSchema),
        rejectIfBadRequest,
        async (req: Request, res: Response) => {
            let body: QuestionGetBody = req.body;
            try {
                let question = await Database.orm.em.findOne(Question, {
                    uuid: body.question_uuid,
                    belongs_to: {
                        uuid: body.question_list_uuid,
                        owned_by: req.session.user_uuid,
                    },
                });
                if (!question) {
                    return AppRouter.notFound(res);
                }
                return res.json({
                    error: false,
                    question: questionObjectCreate(question),
                });
            } catch (err) {
                return AppRouter.internalServerError(res);
            }
        }
    );

    router.post(
        "/",
        ExpressSession.verifyLoggedIn,
        checkSchema(questionPostSchema),
        rejectIfBadRequest,
        async (req: Request, res: Response) => {
            let body: QuestionPostBody = req.body;
            try {
                let questionList = await Database.orm.em.findOne(QuestionList, {
                    uuid: body.question_list_uuid,
                    owned_by: req.session.user_uuid,
                });
                if (!questionList) {
                    return AppRouter.notFound(res);
                }
            } catch (err) {
                return AppRouter.internalServerError(res);
            }

            let question = Database.orm.em.create(Question, {
                question: body.question.question,
                answers: body.question.answers,
                belongs_to: body.question_list_uuid,
            });
            try {
                await Database.orm.em.persistAndFlush(question);
            } catch (err) {
                return AppRouter.internalServerError(res);
            }
            return res.status(201).json({
                error: false,
                question_uuid: question.uuid,
            });
        }
    );

    return router;
};

export const questionListUuidSchema: Schema = {
    question_list_uuid: {
        ...validators.uuid,
        ...validators.existsInDb(QuestionList, "uuid"),
    },
};

const questionGetSchema: Schema = {
    ...questionListUuidSchema,
    question_uuid: {
        ...validators.uuid,
        ...validators.existsInDb(Question, "uuid"),
    },
};

interface QuestionGetBody {
    question_list_uuid: string;
    question_uuid: string;
}

const questionPostSchema: Schema = {
    ...questionListUuidSchema,
    question: questionParamSchema,
};

interface QuestionPostBody {
    question_list_uuid: string;
    question: QuestionBody;
}

// const questionDeleteSchema: Schema = {
//     ...questionListUuidSchema,
//     question_uuid: validators.uuid,
// };

// interface QuestionDeleteBody extends QuestionGetBody {
//     questions_uuid: string;
// }
