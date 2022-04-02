import express, { Request, Response } from "express";
import { checkSchema, Schema } from "express-validator";
import { Database } from "../../database";
import { User } from "../../entities/User";
import { AppRouter } from "..";
import { ExpressSession } from "../expressSession";
import validators, { rejectIfBadRequest } from "../validators";

export const userSearchRouterCreate = () => {
    const router = express.Router();

    router.get(
        "/",
        ExpressSession.verifyLoggedIn,
        checkSchema(userSearchSchema),
        rejectIfBadRequest,
        async (req: Request, res: Response) => {
            let body: UserSearchBody = req.body;

            try {
                let user = await Database.orm.em.findOne(
                    User,
                    {
                        username: body.username,
                    },
                    {
                        fields: ["uuid"],
                    }
                );
                if (!user) {
                    return AppRouter.notFound(res);
                }
                return res.json({
                    error: false,
                    user_uuid: user.uuid,
                });
            } catch (err) {
                return AppRouter.internalServerError(res);
            }
        }
    );

    return router;
};

const userSearchSchema: Schema = {
    username: validators.stringLength4To32,
};
interface UserSearchBody {
    username: string;
}
