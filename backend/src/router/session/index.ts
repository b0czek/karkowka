import express, { Request, Response, Express } from "express";
import { checkSchema, Schema } from "express-validator";
import validators, { rejectIfBadRequest } from "../validators";
import bcrypt from "bcrypt";
import { Database } from "../../database";
import { User } from "../../entities/User";
import { AppRouter } from "..";
import { ExpressSession } from "../expressSession";

export const sessionRouterCreate = () => {
    const router = express.Router();

    router.get("/", ExpressSession.verifyLoggedIn, async (req: Request, res: Response) => {
        return res.json({
            error: false,
            logged_in_as: req.session.user_uuid,
        });
    });

    router.post("/", checkSchema(userLoginSchema), rejectIfBadRequest, async (req: Request, res: Response) => {
        let body: UserLoginBody = req.body;

        if (req.session.loggedIn === true) {
            return AppRouter.badRequest(res, "already logged in");
        }

        let user = await Database.orm.em.findOne(User, {
            username: body.username,
            deleted: false,
        });
        if (!user) {
            return AppRouter.badRequest(res, "invalid username");
        }

        let passwordMatches = await bcrypt.compare(body.password, user.password_hash);

        if (passwordMatches) {
            req.session.loggedIn = true;
            req.session.user_uuid = user.uuid!;
        } else {
            return AppRouter.badRequest(res, "invalid password");
        }

        return res.status(201).json({
            error: false,
        });
    });

    router.delete("/", ExpressSession.verifyLoggedIn, (req: Request, res: Response) => {
        req.session.destroy((err) => {
            if (err) {
                return AppRouter.internalServerError(res, "could not delete session");
            }
            return res.json({
                error: false,
            });
        });
    });

    return router;
};

const userLoginSchema: Schema = {
    username: validators.stringLength4To32,
    password: validators.password,
};

interface UserLoginBody {
    username: string;
    password: string;
}
