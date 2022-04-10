import express, { Request, Response } from "express";
import { checkSchema, Schema } from "express-validator";
import { Database } from "../../database";
import { AppRouter } from "..";
import { Exam } from "../../entities/Exam";
import { ExpressSession } from "../expressSession";
import validators, { rejectIfBadRequest } from "../validators";
import { userParticipatedExamObjectCreate, userParticipatedExamsRouterCreate } from "./participatedExams";

export const userParticipatedExamRouterCreate = () => {
    const router = express.Router();

    router.use("/participated_exams", userParticipatedExamsRouterCreate());

    router.get(
        "/",
        ExpressSession.verifyLoggedIn,
        checkSchema(userParticipatedExamGetSchema, ["query"]),
        rejectIfBadRequest,
        async (req: Request, res: Response) => {
            let body = req.query as any as UserParticipatedExamGetBody;
            try {
                let exam = await Database.orm.em.findOne(
                    Exam,
                    {
                        uuid: body.exam_uuid,
                        participants: {
                            uuid: req.session.user_uuid,
                        },
                    },
                    {
                        populate: ["hosted_by", "participations"],
                    }
                );

                if (!exam) {
                    return AppRouter.notFound(res);
                }

                return res.json({
                    error: false,
                    exam: userParticipatedExamObjectCreate(exam, exam.participations.getItems()),
                });
            } catch (err) {
                return AppRouter.internalServerError(res);
            }
        }
    );

    return router;
};

const userParticipatedExamGetSchema: Schema = {
    exam_uuid: {
        ...validators.uuid,
        ...validators.existsInDb(Exam, "uuid"),
    },
};

interface UserParticipatedExamGetBody {
    exam_uuid: string;
}
