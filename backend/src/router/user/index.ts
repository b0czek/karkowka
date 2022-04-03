import express, { Request, Response, urlencoded } from "express";
import { checkSchema, Schema } from "express-validator";
import bcrypt from "bcrypt";

import { User } from "../../entities/User";
import { Database } from "../../database";
import validators, { rejectIfBadRequest } from "../validators";
import { AppRouter } from "..";
import { Config } from "../../config";
import { ExpressSession } from "../expressSession";
import { userSearchRouterCreate } from "./search";
import { userParticipatedExamsRouterCreate } from "./participatedExams";

export const userObjectCreate = (user: User) => {
    return {
        uuid: user.uuid,
        created_at: user.created_at,
        username: user.username,
        name: user.name,
        deleted: user.deleted,
    };
};

export const userRouterCreate = () => {
    const router = express.Router();

    router.use("/search", userSearchRouterCreate());
    router.use("/participated_exams", userParticipatedExamsRouterCreate());

    router.get(
        "/",
        ExpressSession.verifyLoggedIn,
        checkSchema(userGetSchema),
        rejectIfBadRequest,
        async (req: Request, res: Response) => {
            let body: UserGetBody = req.body;
            try {
                let user = await Database.orm.em.findOne(User, {
                    uuid: body.user_uuid ?? req.session.user_uuid,
                });
                if (!user) {
                    return AppRouter.notFound(res);
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

    //create user
    router.post("/", checkSchema(userRegistrationSchema), rejectIfBadRequest, async (req: Request, res: Response) => {
        let params: UserRegistrationBody = req.body;
        let passwordHash = await bcrypt.hash(params.password, Config.Session.hashingRounds);

        let user = Database.orm.em.create(User, {
            name: params.name,
            username: params.username,
            password_hash: passwordHash,
        });

        try {
            await Database.orm.em.persistAndFlush(user);
        } catch (err) {
            return AppRouter.internalServerError(res);
        }

        return res.status(201).json({
            error: false,
        });
    });

    router.delete("/", ExpressSession.verifyLoggedIn, async (req: Request, res: Response) => {
        let user: User;
        try {
            let u = await Database.orm.em.findOne(
                User,
                {
                    uuid: req.session.user_uuid,
                    deleted: false,
                },
                {
                    fields: ["participated_exams"],
                }
            );
            if (!u) {
                return AppRouter.notFound(res);
            }
            user = u;
        } catch (err) {
            return AppRouter.internalServerError(res);
        }
        // if user has participated in any exams and any of them is not their examy
        if (
            user.participated_exams.count() > 0 &&
            user.participated_exams.getItems().some((exam) => exam.hosted_by.uuid !== user.uuid)
        ) {
            Database.orm.em.assign(user, {
                deleted: true,
            });
        } else {
            Database.orm.em.remove(user);
        }

        try {
            await Database.orm.em.flush();
        } catch (err) {
            return AppRouter.internalServerError(res);
        }

        req.session.destroy((_) => _);

        return res.json({
            error: false,
        });
    });
    return router;
};

const userGetSchema: Schema = {
    user_uuid: {
        ...validators.uuid,
        optional: true,
    },
};

interface UserGetBody {
    user_uuid?: string;
}

export const userRegistrationSchema: Schema = {
    username: {
        ...validators.stringLength4To32,
        ...validators.existsInDb(User, "username", true, {
            deleted: false,
        }),
    },
    password: validators.password,
    name: validators.stringLength4To32,
};

interface UserRegistrationBody {
    username: string;
    password: string;
    name: string;
}
