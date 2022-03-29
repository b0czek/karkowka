import { Connection, IDatabaseDriver, MikroORM } from "@mikro-orm/core";
import express, { Response } from "express";
import cors from "cors";
import { userRouterCreate } from "./user";

export class AppRouter {
    public static error = (code: number, res: Response, message: string, additionalFields?: { [key: string]: any }) =>
        res.status(code).json({
            error: true,
            message,
            ...additionalFields,
        });

    public static badRequest = (res: Response, message = "invalid request") => this.error(400, res, message);

    public static internalServerError = (res: Response, message = "internal server error") =>
        this.error(500, res, message);

    public static create = () => {
        const router = express.Router();

        router.use(express.json(), cors());

        router.use("/user", userRouterCreate());

        router.get("/", (_, res) => res.json({ ok: true }));

        return router;
    };
}
