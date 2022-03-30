import express, { Request, Response } from "express";
import { checkSchema, Schema } from "express-validator";
import bcrypt from "bcrypt";
import crypto from "crypto";

import { User } from "../../entities/User";
import { Database } from "../../database";
import validators, { rejectIfBadRequest } from "../validators";
import { AppRouter } from "..";
import { Config } from "../../config";

export const userRouterCreate = () => {
    const router = express.Router();
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
    return router;
};

export const userRegistrationSchema: Schema = {
    username: {
        ...validators.stringLength4To32,
        custom: {
            bail: true,
            errorMessage: "user with such username already exists",
            options: async (username: string) => {
                return new Promise(async (resolve, reject) => {
                    let user = await Database.orm.em.findOne(User, {
                        username,
                    });
                    user === null ? resolve(null) : reject();
                });
            },
        },
    },
    password: validators.password,
    name: validators.stringLength4To32,
};

interface UserRegistrationBody {
    username: string;
    password: string;
    name: string;
}
