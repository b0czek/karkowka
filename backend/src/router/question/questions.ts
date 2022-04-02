import { checkSchema, Schema } from "express-validator";
import validators, { rejectIfBadRequest } from "../validators";
import express, { Request, Response } from "express";
import { ExpressSession } from "../expressSession";
import { Database } from "../../database";
import { Question } from "../../entities/Question";
import { QuestionList } from "../../entities/QuestionList";
import { AppRouter } from "..";
import { questionArraySchema, QuestionBody } from "./questionSchema";

export const questionsRouterCreate = () => {
    const router = express.Router();

    router.get(
        "/",
        ExpressSession.verifyLoggedIn,
        checkSchema(questionsGetSchema),
        rejectIfBadRequest,
        async (req: Request, res: Response) => {
            let body: QuestionsGetBody = req.body;
            try {
                let questions = await Database.orm.em.find(
                    Question,
                    {
                        belongs_to: {
                            uuid: body.question_list_uuid,
                            owned_by: req.session.user_uuid,
                        },
                    },
                    {
                        fields: ["uuid", "answers", "question"],
                    }
                );
                return res.json({
                    error: false,
                    // questions: questions.map(questionObjectCreate),
                });
            } catch (err) {
                return AppRouter.internalServerError(res, "could not fetch database");
            }
        }
    );

    router.post(
        "/",
        ExpressSession.verifyLoggedIn,
        checkSchema(questionsPostSchema),
        rejectIfBadRequest,
        async (req: Request, res: Response) => {
            let body: QuestionsPostBody = req.body;

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

            let questions = body.questions.map((q) =>
                Database.orm.em.create(Question, {
                    belongs_to: body.question_list_uuid,
                    answers: q.answers,
                    question: q.question,
                })
            );
            try {
                await Database.orm.em.persistAndFlush(questions);
            } catch (err) {
                return AppRouter.internalServerError(res, "could not persist questions");
            }
            return res.status(201).json({
                error: false,
                question_uuids: questions.map((q) => q.uuid),
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

const questionsGetSchema: Schema = {
    ...questionListUuidSchema,
};

interface QuestionsGetBody {
    question_list_uuid: string;
}

const questionsPostSchema: Schema = {
    ...questionListUuidSchema,
    ...questionArraySchema,
};

interface QuestionsPostBody extends QuestionsGetBody {
    questions: QuestionBody[];
}
