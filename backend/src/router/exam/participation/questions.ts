import express, { Request, Response } from "express";
import { checkSchema, Schema } from "express-validator";
import { Question } from "../../../entities/Question";
import { ExamParticipation } from "../../../entities/ExamParticipation";
import { Database } from "../../../database";
import { ExpressSession } from "../../expressSession";
import validators, { rejectIfBadRequest } from "../../validators";
import { AppRouter } from "../..";

export const questionObjectCreate = (question: Question) => {
    return {
        uuid: question.uuid,
        question: question.question,
    };
};

export const examQuestionsRouterCreate = () => {
    const router = express.Router();

    router.get(
        "/",
        ExpressSession.verifyLoggedIn,
        checkSchema(examQuestionsGetSchema),
        rejectIfBadRequest,
        async (req: Request, res: Response) => {
            let body: ExamQuestionsGetBody = req.body;
            try {
                let questions = await Database.orm.em.find(
                    Question,
                    {
                        utilized_in: {
                            participations: {
                                uuid: body.participation_uuid,
                                participant: req.session.user_uuid,
                            },
                        },
                    },
                    {
                        fields: ["uuid", "question"],
                    }
                );
                return res.json({
                    error: false,
                    questions: questions.map((question) => questionObjectCreate(question)),
                });
            } catch (err) {
                return AppRouter.internalServerError(res);
            }
        }
    );

    return router;
};
const examQuestionsGetSchema: Schema = {
    participation_uuid: {
        ...validators.uuid,
        ...validators.existsInDb(ExamParticipation, "uuid"),
    },
};
interface ExamQuestionsGetBody {
    participation_uuid: string;
}
