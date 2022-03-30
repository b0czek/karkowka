import express, { Request, Response } from "express";
import { ExpressSession } from "../../expressSession";
import { checkSchema, Schema } from "express-validator";
import validators, { rejectIfBadRequest } from "../../validators";
import { Question, questionArraySchema } from "..";
import { Database } from "../../../database";
import { QuestionList } from "../../../entities/QuestionList";
import { AppRouter } from "../..";

export const questionListRouterCreate = () => {
    const router = express.Router();

    router.post(
        "/",
        ExpressSession.verifyLoggedIn,
        checkSchema(questionListCreate),
        rejectIfBadRequest,
        async (req: Request, res: Response) => {
            let body: QuestionListCreateBody = req.body;

            let questionList = Database.orm.em.create(QuestionList, {
                name: body.name,
                owned_by: {
                    uuid: req.session.user_uuid!,
                },
                questions: body.questions,
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

    return router;
};

const questionListCreate: Schema = {
    name: validators.stringLength4To32,
    ...questionArraySchema,
};

interface QuestionListCreateBody {
    name: string;
    questions: Question[];
}
