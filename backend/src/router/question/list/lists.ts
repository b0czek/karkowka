import express, { Request, Response } from "express";
import { ExpressSession } from "../../expressSession";
import { Database } from "../../../database";
import { QuestionList } from "../../../entities/QuestionList";
import { AppRouter } from "../..";
import { questionListObjectCreate } from ".";

export const questionListsRouterCreate = () => {
    const router = express.Router();

    router.get("/", ExpressSession.verifyLoggedIn, async (req: Request, res: Response) => {
        try {
            let question_lists = await Database.orm.em.find(
                QuestionList,
                {
                    owned_by: req.session.user_uuid,
                },
                { populate: ["questions.answers", "questions.uuid", "questions.question"] }
            );
            return res.json({
                error: false,
                question_lists: question_lists.map(questionListObjectCreate),
            });
        } catch (err) {
            return AppRouter.internalServerError(res, "could not fetch question lists");
        }
    });

    return router;
};
