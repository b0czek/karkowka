import express, { Request, Response } from "express";
import { Database } from "../../database";
import { User } from "../../entities/User";
import { AppRouter } from "..";
import { ExpressSession } from "../expressSession";

export const userParticipatedExamsRouterCreate = () => {
    const router = express.Router();

    router.get("/", ExpressSession.verifyLoggedIn, async (req: Request, res: Response) => {
        try {
            let user = await Database.orm.em.findOne(
                User,
                {
                    uuid: req.session.user_uuid,
                },
                {
                    fields: ["participated_exams.uuid", "exam_participations.exam.uuid"],
                }
            );
            if (!user) {
                return AppRouter.notFound(res);
            }
            return res.json({
                error: false,
                exams_uuids: user.participated_exams.getItems().map((exam) => {
                    return {
                        uuid: exam.uuid,
                        joined: user!.exam_participations.getItems().some((participation) => participation.uuid === exam.uuid),
                    };
                }),
            });
        } catch (err) {
            return AppRouter.internalServerError(res);
        }
    });

    return router;
};
