import express, { Request, Response } from "express";
import { checkSchema, Schema } from "express-validator";
import { Database } from "../../database";
import { User } from "../../entities/User";
import { AppRouter } from "..";
import { ExpressSession } from "../expressSession";
import validators, { rejectIfBadRequest } from "../validators";
import { userObjectCreate } from ".";

export const userSearchRouterCreate = () => {
    const router = express.Router();

    router.get(
        "/",
        ExpressSession.verifyLoggedIn,
        checkSchema(userSearchSchema, ["query"]),
        rejectIfBadRequest,
        async (req: Request, res: Response) => {
            let body: UserSearchBody = (<any>req.query) as UserSearchBody;

            try {
                let user = await Database.orm.em.findOne(User, {
                    username: body.username,
                    deleted: false,
                });
                if (!user) {
                    return AppRouter.notFound(res, `user with username ${body.username} does not exist`);
                }
                return res.json({
                    error: false,
                    user: userObjectCreate(user),
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
