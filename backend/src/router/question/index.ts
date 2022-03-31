import { checkSchema, Schema } from "express-validator";
import validators, { rejectIfBadRequest } from "../validators";
import express, { Request, Response } from "express";
import { questionListRouterCreate } from "./list";
import { questionListsRouterCreate } from "./lists";
import { ExpressSession } from "../expressSession";
import { Database } from "../../database";
import { Question } from "../../entities/Question";
import { AppRouter } from "..";
import { questionArraySchema, QuestionBody } from "./questionSchema";

export const questionRouterCreate = () => {
    const router = express.Router();

    router.use("/list", questionListRouterCreate());
    router.use("/lists", questionListsRouterCreate());

    router.get(
        "/",
        ExpressSession.verifyLoggedIn,
        checkSchema(questionGetSchema),
        rejectIfBadRequest,
        async (req: Request, res: Response) => {
            let body: QuestionGetBody = req.body;
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
                    questions,
                });
            } catch (err) {
                return AppRouter.internalServerError(res, "could not fetch database");
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

    router.delete(
        "/",
        ExpressSession.verifyLoggedIn,
        checkSchema(questionDeleteSchema),
        rejectIfBadRequest,
        async (req: Request, res: Response) => {
            let body: QuestionDeleteBody = req.body;

            try {
                let deleted_fields = await Database.orm.em.nativeDelete(Question, {
                    $and: [
                        {
                            $or: body.questions_uuids.map((uuid) => {
                                return { uuid };
                            }),
                        },
                        {
                            belongs_to: {
                                uuid: body.question_list_uuid,
                                owned_by: req.session.user_uuid,
                            },
                        },
                    ],
                });
                return res.json({ error: false, deleted_fields });
            } catch (err) {
                console.log(err);
                return AppRouter.internalServerError(res);
            }
        }
    );

    return router;
};

const questionGetSchema: Schema = {
    question_list_uuid: validators.uuid,
};

interface QuestionGetBody {
    question_list_uuid: string;
}

const questionPostSchema: Schema = {
    ...questionGetSchema,
    ...questionArraySchema,
};

interface QuestionPostBody extends QuestionGetBody {
    questions: QuestionBody[];
}

const questionDeleteSchema: Schema = {
    ...questionGetSchema,
    questions_uuids: {
        isArray: {
            bail: true,
            options: {
                min: 1,
            },
        },
    },
    "questions_uuids.*": validators.uuid,
};

interface QuestionDeleteBody extends QuestionGetBody {
    questions_uuids: string[];
}
