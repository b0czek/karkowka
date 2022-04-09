import express, { Request, Response } from "express";
import { checkSchema, Schema } from "express-validator";
import { ExamParticipation } from "../../../entities/ExamParticipation";
import { Exam } from "../../../entities/Exam";
import { User } from "../../../entities/User";
import { ExpressSession } from "../../expressSession";
import validators, { rejectIfBadRequest } from "../../validators";
import { Database } from "../../../database";
import { AppRouter } from "../..";
import { examParticipationIsFinished } from "../participation";

interface StateResponse {
    error: boolean;
    joined: boolean;
    finished: boolean;
}

const stateResponseCreate = (participation?: ExamParticipation | null): StateResponse => {
    if (!participation) {
        return {
            error: false,
            joined: false,
            finished: false,
        };
    }

    return {
        error: false,
        joined: true,
        finished: examParticipationIsFinished(participation),
    };
};

export const examResultStateRouterCreate = () => {
    const router = express.Router();

    router.get(
        "/",
        ExpressSession.verifyLoggedIn,
        checkSchema(resultStateGetSchema, ["query"]),
        rejectIfBadRequest,
        async (req: Request, res: Response) => {
            let body = req.query as any as ResultStateGetBody;

            try {
                let exam = await Database.orm.em.findOne(
                    Exam,
                    {
                        uuid: body.exam_uuid,
                        hosted_by: req.session.user_uuid,
                    },
                    {
                        fields: ["participants.uuid"],
                    }
                );
                if (!exam) {
                    return AppRouter.notFound(res);
                }

                if (!exam.participants.getItems().some((participant) => participant.uuid === body.user_uuid)) {
                    return AppRouter.badRequest(res, "user was not invited to the exam");
                }
            } catch (err) {
                return AppRouter.internalServerError(res);
            }

            try {
                let participation = await Database.orm.em.findOne(
                    ExamParticipation,
                    {
                        participant: body.user_uuid,
                        exam: {
                            hosted_by: req.session.user_uuid,
                            uuid: body.exam_uuid,
                        },
                    },
                    {
                        fields: ["exam", "joined_at", "finished_at"],
                    }
                );
                return res.json(stateResponseCreate(participation));
            } catch (err) {
                console.error(err);
                return AppRouter.internalServerError(res);
            }
        }
    );

    return router;
};

const resultStateGetSchema: Schema = {
    exam_uuid: {
        ...validators.uuid,
        ...validators.existsInDb(Exam, "uuid"),
    },
    user_uuid: {
        ...validators.uuid,
        ...validators.existsInDb(User, "uuid"),
    },
};

interface ResultStateGetBody {
    exam_uuid: string;
    user_uuid: string;
}
