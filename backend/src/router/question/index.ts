import { checkSchema, Schema } from "express-validator";
import validators, { rejectIfBadRequest } from "../validators";
import express, { Request, Response } from "express";
import { questionListRouterCreate } from "./list";
import { ExpressSession } from "../expressSession";
import { Database } from "../../database";
import { Question } from "../../entities/Question";
import { QuestionList } from "../../entities/QuestionList";
import { AppRouter } from "..";
import { questionAnswerParamSchema, QuestionBody, questionObjectCreate } from "./questionSchema";
import { questionsRouterCreate } from "./questions";

const deleteQuestion = (question: Question) => {
    if (question.utilized_in.count() > 0) {
        Database.orm.em.assign(question, {
            deleted: true,
        });
    } else {
        Database.orm.em.remove(question);
    }
};
const deleteQuestionAndFlush = async (question: Question) => {
    deleteQuestion(question);
    await Database.orm.em.flush();
};

export const questionRouterCreate = () => {
    const router = express.Router();

    router.use("/list", questionListRouterCreate());
    router.use("/questions", questionsRouterCreate());

    router.get(
        "/",
        ExpressSession.verifyLoggedIn,
        checkSchema(questionGetSchema, ["query"]),
        rejectIfBadRequest,
        async (req: Request, res: Response) => {
            let body: QuestionGetBody = (<any>req.query) as QuestionGetBody;
            try {
                let question = await Database.orm.em.findOne(
                    Question,
                    {
                        uuid: body.question_uuid,
                        belongs_to: {
                            uuid: body.question_list_uuid,
                            owned_by: req.session.user_uuid,
                        },
                    },
                    { orderBy: { created_at: "DESC" } }
                );
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
        checkSchema(questionPostSchema, ["body"]),
        rejectIfBadRequest,
        async (req: Request, res: Response) => {
            let body: QuestionPostBody = req.body;
            try {
                let questionList = await Database.orm.em.findOne(QuestionList, {
                    uuid: body.question_list_uuid,
                    owned_by: req.session.user_uuid,
                    deleted: false,
                });
                if (!questionList) {
                    return AppRouter.notFound(res);
                }
            } catch (err) {
                return AppRouter.internalServerError(res);
            }

            let question = Database.orm.em.create(Question, {
                question: body.question,
                answers: body.answers,
                belongs_to: body.question_list_uuid,
            });
            try {
                await Database.orm.em.persistAndFlush(question);
            } catch (err) {
                return AppRouter.internalServerError(res, "could not persist the question");
            }
            return res.status(201).json({
                error: false,
                question_uuid: question.uuid,
            });
        }
    );

    router.delete(
        "/",
        ExpressSession.verifyLoggedIn,
        checkSchema(questionDeleteSchema, ["body"]),
        rejectIfBadRequest,
        async (req: Request, res: Response) => {
            let body: QuestionDeleteBody = req.body;
            let question: Question;
            try {
                let q = await Database.orm.em.findOne(
                    Question,
                    {
                        uuid: body.question_uuid,
                        belongs_to: {
                            uuid: body.question_list_uuid,
                            owned_by: req.session.user_uuid,
                        },
                        deleted: false,
                    },
                    {
                        fields: ["uuid", "utilized_in.uuid"],
                    }
                );
                if (!q) {
                    return AppRouter.notFound(res);
                }
                question = q;
            } catch (err) {
                return AppRouter.internalServerError(res);
            }

            try {
                deleteQuestionAndFlush(question);
            } catch (err) {
                return AppRouter.internalServerError(res, "could not remove question");
            }

            return res.json({
                error: false,
            });
        }
    );

    router.patch(
        "/",
        ExpressSession.verifyLoggedIn,
        checkSchema(questionPatchSchema),
        rejectIfBadRequest,
        async (req: Request, res: Response) => {
            let body: QuestionPatchBody = req.body;
            let question: Question;
            try {
                let q = await Database.orm.em.findOne(
                    Question,
                    {
                        uuid: body.question_uuid,
                        belongs_to: {
                            uuid: body.question_list_uuid,
                            owned_by: req.session.user_uuid,
                        },
                    },
                    {
                        fields: ["utilized_in.uuid"],
                    }
                );
                if (!q) {
                    return AppRouter.notFound(res);
                }
                question = q;
            } catch (err) {
                return AppRouter.internalServerError(res);
            }

            let newQuestion = Database.orm.em.create(Question, {
                answers: body.answers,
                question: body.question,
                belongs_to: body.question_list_uuid,
            });
            Database.orm.em.assign(newQuestion, {
                created_at: question.created_at,
            });

            deleteQuestion(question);
            Database.orm.em.persist(newQuestion);

            try {
                await Database.orm.em.flush();
            } catch (err) {
                return AppRouter.internalServerError(res, "could not persist new question");
            }

            return res.json({
                error: false,
                new_question_uuid: newQuestion.uuid,
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
    question: validators.string,
    answers: questionAnswerParamSchema,
};

interface QuestionPostBody extends QuestionBody {
    question_list_uuid: string;
}

const questionDeleteSchema: Schema = {
    ...questionListUuidSchema,
    question_uuid: {
        ...validators.uuid,
        ...validators.existsInDb(Question, "uuid"),
    },
};

interface QuestionDeleteBody {
    question_list_uuid: string;

    question_uuid: string;
}

const questionPatchSchema: Schema = {
    ...questionPostSchema,
    question_uuid: {
        ...validators.uuid,
        ...validators.existsInDb(Question, "uuid"),
    },
};

interface QuestionPatchBody extends QuestionPostBody {
    question_uuid: string;
}
