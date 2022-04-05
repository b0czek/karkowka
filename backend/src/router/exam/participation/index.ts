import express, { Request, Response } from "express";
import { Exam } from "../../../entities/Exam";
import { Database } from "../../../database";
import { ExpressSession } from "../../expressSession";
import validators, { rejectIfBadRequest } from "../../validators";
import { checkSchema, Schema } from "express-validator";
import { ExamParticipation } from "../../../entities/ExamParticipation";
import { AppRouter } from "../..";
import { examQuestionsRouterCreate } from "./questions";
import { examAnswerRouterCreate } from "./answer";

const examParticipationObjectCreate = (examParticipation: ExamParticipation) => {
    return {
        uuid: examParticipation.uuid,
        joined_at: examParticipation.joined_at,
        answers: examParticipation.answers.getItems().map((answer) => answer.uuid),
        correct_answers_count: examParticipation.answers.getItems().filter((answer) => answer.is_correct).length,
        exam: examParticipation.exam.uuid,
    };
};

const isExamOpen = (started_at: Date, time_to_join: number) => {
    let now = new Date().valueOf();
    let max_time = started_at.valueOf() + time_to_join * 1000;
    return now > started_at.valueOf() ? max_time > now : false;
};

export const examParticipationRouterCreate = () => {
    const router = express.Router();

    router.use("/questions", examQuestionsRouterCreate());
    router.use("/answer", examAnswerRouterCreate());

    router.get(
        "/",
        ExpressSession.verifyLoggedIn,
        checkSchema(examParticipationGetSchema, ["query"]),
        rejectIfBadRequest,
        async (req: Request, res: Response) => {
            let body: ExamParticipationGetBody = (<any>req.query) as ExamParticipationGetBody;
            try {
                let participation = await Database.orm.em.findOne(
                    ExamParticipation,
                    {
                        participant: req.session.user_uuid,
                        uuid: body.participation_uuid,
                    },
                    {
                        fields: ["uuid", "joined_at", "answers.uuid", "answers.is_correct", "exam"],
                    }
                );
                if (!participation) {
                    return AppRouter.notFound(res);
                }
                return res.json({
                    error: false,
                    exam_participation: examParticipationObjectCreate(participation),
                });
            } catch (err) {
                console.log(err);
                return AppRouter.internalServerError(res);
            }
        }
    );

    router.post(
        "/",
        ExpressSession.verifyLoggedIn,
        checkSchema(examParticipationPostSchema, ["body"]),
        rejectIfBadRequest,
        async (req: Request, res: Response) => {
            let body: ExamParticipationPostBody = req.body;
            // check if participation exist
            try {
                let examParticipation = await Database.orm.em.findOne(
                    ExamParticipation,
                    {
                        participant: req.session.user_uuid,
                        exam: body.exam_uuid,
                    },
                    { fields: ["uuid"] }
                );
                if (examParticipation) {
                    return AppRouter.badRequest(res, "participation for this exam already exists");
                }
            } catch (err) {
                return AppRouter.internalServerError(res);
            }
            // check if user was invited
            try {
                let exam = await Database.orm.em.findOne(
                    Exam,
                    {
                        uuid: body.exam_uuid,
                    },
                    {
                        fields: ["participants.uuid", "started_at", "time_to_join"],
                    }
                );
                if (!exam) {
                    return AppRouter.notFound(res);
                }
                let userInvited = exam?.participants.getItems().map((user) => user.uuid === req.session.user_uuid);
                if (!userInvited) {
                    return AppRouter.forbidden(res);
                }
                if (!isExamOpen(exam.started_at, exam.time_to_join)) {
                    return AppRouter.forbidden(res, "exam is closed");
                }
            } catch (err) {
                return AppRouter.internalServerError(res);
            }

            let participation = Database.orm.em.create(ExamParticipation, {
                exam: body.exam_uuid,
                participant: req.session.user_uuid!,
            });

            try {
                await Database.orm.em.persistAndFlush(participation);
            } catch (err) {
                console.error(err);
                return AppRouter.internalServerError(res);
            }

            return res.status(201).json({
                error: false,
                participation_uuid: participation.uuid,
            });
        }
    );

    return router;
};

const examParticipationGetSchema: Schema = {
    participation_uuid: validators.uuid,
};
interface ExamParticipationGetBody {
    participation_uuid: string;
}

const examParticipationPostSchema: Schema = {
    exam_uuid: {
        ...validators.uuid,
        ...validators.existsInDb(Exam, "uuid"),
    },
};

interface ExamParticipationPostBody {
    exam_uuid: string;
}
