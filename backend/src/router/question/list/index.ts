import express, { Request, Response } from "express";
import { ExpressSession } from "../../expressSession";
import { checkSchema, Schema } from "express-validator";
import validators, { rejectIfBadRequest } from "../../validators";
import { Database } from "../../../database";
import { QuestionList } from "../../../entities/QuestionList";
import { AppRouter } from "../..";
import { questionArraySchema, QuestionBody, questionObjectCreate } from "../questionSchema";
import { questionListsRouterCreate } from "./lists";
import { questionListUuidSchema } from "..";

export const questionListObjectCreate = (questionList: QuestionList) => {
    return {
        uuid: questionList.uuid,
        created_at: questionList.created_at,
        name: questionList.name,
        questions: questionList.questions.getItems().map(questionObjectCreate),
    };
};

export const questionListRouterCreate = () => {
    const router = express.Router();

    router.use("/lists", questionListsRouterCreate());

    router.get(
        "/",
        ExpressSession.verifyLoggedIn,
        checkSchema(questionListGetSchema),
        rejectIfBadRequest,
        async (req: Request, res: Response) => {
            let body: QuestionListGetBody = req.body;
            try {
                let question_list = await Database.orm.em.findOne(
                    QuestionList,
                    {
                        owned_by: req.session.user_uuid,
                        uuid: body.question_list_uuid,
                    },
                    {
                        fields: ["created_at", "name", "questions.question", "questions.answers", "questions.uuid", "uuid"],
                    }
                );
                if (!question_list) {
                    return AppRouter.notFound(res);
                }

                return res.json({
                    error: false,
                    question_list: questionListObjectCreate(question_list),
                });
            } catch (err) {
                return AppRouter.internalServerError(res, "could not fetch database");
            }
        }
    );

    router.post(
        "/",
        ExpressSession.verifyLoggedIn,
        checkSchema(questionListCreateSchema),
        rejectIfBadRequest,
        async (req: Request, res: Response) => {
            let body: QuestionListCreateBody = req.body;

            let questionList = Database.orm.em.create(QuestionList, {
                name: body.name,
                owned_by: req.session.user_uuid!,
                questions: body.questions.map((q) => {
                    return { question: q.question, answers: q.answers };
                }),
            });

            try {
                await Database.orm.em.persistAndFlush(questionList);
            } catch (err) {
                console.log(err);
                return AppRouter.internalServerError(res, "object could not be persisted in database");
            }

            return res.status(201).json({
                error: false,
                question_list_uuid: questionList.uuid,
            });
        }
    );

    router.delete(
        "/",
        ExpressSession.verifyLoggedIn,
        checkSchema(questionListDeleteSchema),
        rejectIfBadRequest,
        async (req: Request, res: Response) => {
            let body: QuestionListDeleteBody = req.body;
            try {
                let list = await Database.orm.em.findOne(QuestionList, {
                    uuid: body.question_list_uuid,
                    owned_by: req.session.user_uuid,
                });
                if (!list) {
                    return AppRouter.notFound(res);
                }

                await Database.orm.em.removeAndFlush(list);

                return res.json({
                    error: false,
                });

                // await Database.orm.em.nativeDelete(QuestionList, {});
            } catch (err) {
                return AppRouter.internalServerError(res);
            }
        }
    );

    return router;
};

const questionListGetSchema: Schema = {
    ...questionListUuidSchema,
};

interface QuestionListGetBody {
    question_list_uuid: string;
}

const questionListCreateSchema: Schema = {
    name: validators.stringLength4To32,

    ...questionArraySchema,
};

interface QuestionListCreateBody {
    name: string;
    questions: QuestionBody[];
}

const questionListDeleteSchema: Schema = {
    ...questionListUuidSchema,
};
interface QuestionListDeleteBody {
    question_list_uuid: string;
}
