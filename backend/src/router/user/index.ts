import { checkSchema, ParamSchema, Schema } from "express-validator";
import { User } from "../../entities/User";
import { Database } from "../../database";
import validators, { rejectIfBadRequest } from "../validators";
import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import { AppRouter } from "..";
import crypto from "crypto";
const HASHING_ROUNDS = 9;

export const userRouterCreate = () => {
    const router = express.Router();
    //create user
    router.post("/", checkSchema(userRegistrationSchema), rejectIfBadRequest, async (req: Request, res: Response) => {
        let params: UserRegistrationBody = req.body;
        console.log("dupa");
        let passwordHash = await bcrypt.hash(params.password, HASHING_ROUNDS);

        let user = Database.orm.em.create(User, {
            user_uuid: crypto.randomUUID(),
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

const stringLength4To32: ParamSchema = {
    ...validators.string,
    isLength: {
        bail: true,
        options: {
            max: 32,
            min: 4,
        },
    },
};

export const userRegistrationSchema: Schema = {
    username: {
        ...stringLength4To32,
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
    name: stringLength4To32,
};

interface UserRegistrationBody {
    username: string;
    password: string;
    name: string;
}
