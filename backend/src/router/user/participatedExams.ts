import express, { Request, Response } from "express";
import { Database } from "../../database";
import { User } from "../../entities/User";
import { ExamParticipation } from "../../entities/ExamParticipation";
import { Exam } from "../../entities/Exam";
import { AppRouter } from "..";
import { ExpressSession } from "../expressSession";

const userParticipatedExamObjectCreate = (exam: Exam, exam_participations: ExamParticipation[] | undefined) => {
    let participation = exam_participations
        ? exam_participations.find((participation) => participation.exam.uuid === exam.uuid)
        : undefined;
    return {
        uuid: exam.uuid,
        joined: participation !== undefined,
        participation_uuid: participation?.uuid ?? null,
    };
};

export const userParticipatedExamsRouterCreate = () => {
    const router = express.Router();

    router.get("/", ExpressSession.verifyLoggedIn, async (req: Request, res: Response) => {
        try {
            let user = await Database.orm.em.findOne(
                User,
                {
                    uuid: req.session.user_uuid,
                    deleted: false,
                },
                {
                    fields: ["participated_exams.uuid", "exam_participations.exam"],
                }
            );
            if (!user) {
                return AppRouter.notFound(res);
            }
            return res.json({
                error: false,
                exams: user.participated_exams
                    .getItems()
                    .map((exam) => userParticipatedExamObjectCreate(exam, user?.exam_participations.getItems())),
            });
        } catch (err) {
            console.log(err);
            return AppRouter.internalServerError(res);
        }
    });

    return router;
};
