import express, { Request, Response } from "express";
import { checkSchema, Schema } from "express-validator";
import { AppRouter } from "../../../";
import { Database } from "../../../../database";
import { ExamAnswer } from "../../../../entities/ExamAnswer";
import { ExamParticipation } from "../../../../entities/ExamParticipation";
import { ExpressSession } from "../../../expressSession";
import validators, { rejectIfBadRequest } from "../../../validators";

export const answerApproveRouterCreate = () => {
    const router = express.Router();

    router.post(
        "/",
        ExpressSession.verifyLoggedIn,
        checkSchema(answerApproveSchema, ["body"]),
        rejectIfBadRequest,
        async (req: Request, res: Response) => {
            let body: AnswerApproveBody = req.body;
            let answer: ExamAnswer;
            try {
                let examAnswer = await Database.orm.em.findOne(ExamAnswer, {
                    uuid: body.answer_uuid,
                    participation: {
                        uuid: body.participation_uuid,
                        exam: {
                            hosted_by: req.session.user_uuid,
                        },
                    },
                });
                if (!examAnswer) {
                    return AppRouter.notFound(res);
                }
                answer = examAnswer;
            } catch (err) {
                return AppRouter.internalServerError(res, "could not fetch the answer");
            }

            Database.orm.em.assign(answer, {
                is_correct: body.is_correct,
            });

            try {
                await Database.orm.em.flush();
            } catch (err) {
                return AppRouter.internalServerError(res, "could not persist new answer data");
            }

            return res.json({
                error: false,
            });
        }
    );

    return router;
};

const answerApproveSchema: Schema = {
    participation_uuid: {
        ...validators.uuid,
        ...validators.existsInDb(ExamParticipation, "uuid"),
    },
    answer_uuid: {
        ...validators.uuid,
        ...validators.existsInDb(ExamAnswer, "uuid"),
    },
    is_correct: validators.boolean,
};

interface AnswerApproveBody {
    participation_uuid: string;
    answer_uuid: string;
    is_correct: boolean;
}
