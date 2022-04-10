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

export const questionListObjectCreate = (
    questionList: QuestionList,
    withDeletedQuestions: boolean = false,
    withQuestions: boolean = false
) => {
    let questionsObjects = questionList.questions
        .getItems()
        .filter((question) => (withDeletedQuestions ? true : !question.deleted));
    let questions = withQuestions ? questionsObjects.map(questionObjectCreate) : undefined;
    return {
        uuid: questionList.uuid,
        created_at: questionList.created_at,
        name: questionList.name,
        questions: questions,
        questions_count: questionsObjects.length,
        deleted: questionList.deleted,
    };
};

export const questionListRouterCreate = () => {
    const router = express.Router();

    router.use("/lists", questionListsRouterCreate());

    router.get(
        "/",
        ExpressSession.verifyLoggedIn,
        checkSchema(questionListGetSchema, ["query"]),
        rejectIfBadRequest,
        async (req: Request, res: Response) => {
            let body: QuestionListGetBody = (<any>req.query) as QuestionListGetBody;

            try {
                let question_list = await Database.orm.em.findOne(
                    QuestionList,
                    {
                        uuid: body.question_list_uuid,
                        owned_by: req.session.user_uuid,
                    },
                    {
                        fields: ["created_at", "name", "uuid"],
                        orderBy: {},
                    }
                );
                if (!question_list) {
                    return AppRouter.notFound(res);
                }

                await question_list.questions.init({
                    where: {
                        deleted: false,
                    },
                });

                return res.json({
                    error: false,
                    question_list: questionListObjectCreate(question_list, false, true),
                });
            } catch (err) {
                return AppRouter.internalServerError(res, "could not fetch database");
            }
        }
    );

    router.post(
        "/",
        ExpressSession.verifyLoggedIn,
        checkSchema(questionListCreateSchema, ["body"]),
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
        checkSchema(questionListDeleteSchema, ["body"]),
        rejectIfBadRequest,
        async (req: Request, res: Response) => {
            let body: QuestionListDeleteBody = req.body;
            let questionList: QuestionList;
            try {
                let list = await Database.orm.em.findOne(
                    QuestionList,
                    {
                        uuid: body.question_list_uuid,
                        owned_by: req.session.user_uuid,
                        deleted: false,
                    },
                    {
                        fields: ["utilized_in.uuid", "questions"],
                    }
                );
                if (!list) {
                    return AppRouter.notFound(res);
                }

                questionList = list;
            } catch (err) {
                return AppRouter.internalServerError(res);
            }
            if (questionList.utilized_in.count() > 0) {
                Database.orm.em.assign(questionList, {
                    deleted: true,
                });
            } else {
                Database.orm.em.remove(questionList);
            }

            try {
                await Database.orm.em.flush();
            } catch (err) {
                return AppRouter.internalServerError(res, "could not remove question list");
            }

            return res.json({
                error: false,
            });
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
