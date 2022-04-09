import express, { Request, Response } from "express";
import { checkSchema, Schema } from "express-validator";
import { Database } from "../../database";
import { AppRouter } from "..";
import { User } from "../../entities/User";
import { ExpressSession } from "../expressSession";
import validators, { rejectIfBadRequest } from "../validators";
import bcrypt from "bcrypt";
import { Config } from "../../config";

export const userPasswordRouterCreate = () => {
    const router = express.Router();

    router.post(
        "/",
        ExpressSession.verifyLoggedIn,
        checkSchema(passwordPostSchema),
        rejectIfBadRequest,
        async (req: Request, res: Response) => {
            let body: PasswordPostBody = req.body;

            let user: User;
            try {
                let u = await Database.orm.em.findOne(User, {
                    uuid: req.session.user_uuid,
                });
                if (!u) {
                    return AppRouter.notFound(res);
                }
                user = u;
            } catch (err) {
                return AppRouter.internalServerError(res);
            }

            let passwordMatches = await bcrypt.compare(body.old_password, user.password_hash);

            if (!passwordMatches) {
                return AppRouter.badRequest(res, "old password does not match");
            }

            let newPasswordHash = await bcrypt.hash(body.new_password, Config.Session.hashingRounds);

            Database.orm.em.assign(user, {
                password_hash: newPasswordHash,
            });

            try {
                await Database.orm.em.flush();
            } catch (err) {
                return AppRouter.internalServerError(res, "could not persist new password");
            }

            return res.json({
                error: false,
            });
        }
    );

    return router;
};

const passwordPostSchema: Schema = {
    old_password: validators.password,
    new_password: validators.password,
};
interface PasswordPostBody {
    old_password: string;
    new_password: string;
}
