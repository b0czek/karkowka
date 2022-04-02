import express, { Request, Response } from "express";
import { Database } from "../../database";
import { AppRouter } from "..";
import { ExpressSession } from "../expressSession";
import { Exam } from "../../entities/Exam";

export const examsRouterCreate = () => {
    const router = express.Router();

    router.get("/", ExpressSession.verifyLoggedIn, async (req: Request, res: Response) => {
        try {
            let exams = await Database.orm.em.find(
                Exam,
                {
                    hosted_by: req.session.user_uuid,
                },
                {
                    fields: ["uuid"],
                }
            );
            return res.json({
                error: false,
                exams: exams.map((exam) => exam.uuid),
            });
        } catch (err) {
            return AppRouter.internalServerError(res);
        }
    });
    return router;
};
