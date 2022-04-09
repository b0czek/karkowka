import express, { Request, Response } from "express";
import { checkSchema, Schema } from "express-validator";
import { User } from "../../../entities/User";
import { Exam } from "../../../entities/Exam";
import validators, { rejectIfBadRequest } from "../../validators";
import { ExpressSession } from "../../expressSession";
import { ExamParticipation } from "../../../entities/ExamParticipation";
import { Database } from "../../../database";
import { AppRouter } from "../..";
import { examParticipationObjectCreate } from "../participation";
import { examResultStateRouterCreate } from "./state";

export const examResultRouterCreate = () => {
    const router = express.Router();

    router.use("/state", examResultStateRouterCreate());

    router.get(
        "/",
        ExpressSession.verifyLoggedIn,
        checkSchema(resultGetSchema, ["query"]),
        rejectIfBadRequest,
        async (req: Request, res: Response) => {
            let body = req.query as any as ResultGetBody;
            let participation: ExamParticipation;
            try {
                let part = await Database.orm.em.findOne(
                    ExamParticipation,
                    {
                        participant: body.user_uuid,
                        exam: {
                            hosted_by: req.session.user_uuid,
                            uuid: body.exam_uuid,
                        },
                    },
                    {
                        populate: ["answers", "answers.question", "exam"],
                    }
                );
                if (!part) {
                    return AppRouter.notFound(res);
                }
                participation = part;
            } catch (err) {
                return AppRouter.internalServerError(res);
            }

            return res.json({
                error: false,
                result: examParticipationObjectCreate(participation),
            });
        }
    );

    return router;
};

const resultGetSchema: Schema = {
    exam_uuid: {
        ...validators.uuid,
        ...validators.existsInDb(Exam, "uuid"),
    },
    user_uuid: {
        ...validators.uuid,
        ...validators.existsInDb(User, "uuid"),
    },
};

interface ResultGetBody {
    exam_uuid: string;
    user_uuid: string;
}
