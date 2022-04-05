import express, { Response } from "express";
import cors from "cors";
import { userRouterCreate } from "./user";
import { ExpressSession } from "./expressSession";
import { sessionRouterCreate } from "./session";
import { questionRouterCreate } from "./question";
import { examRouterCreate } from "./exam";

export class AppRouter {
    public static error = (code: number, res: Response, message: string, additionalFields?: { [key: string]: any }) =>
        res.status(code).json({
            error: true,
            message,
            ...additionalFields,
        });

    public static badRequest = (res: Response, message = "invalid request") => this.error(400, res, message);

    public static internalServerError = (res: Response, message = "internal server error") => this.error(500, res, message);

    public static unauthorized = (res: Response, message = "unauthorized") => this.error(401, res, message);

    public static notFound = (res: Response, message = "not found") => this.error(404, res, message);

    public static forbidden = (res: Response, message = "forbidden") => this.error(403, res, message);

    public static create = async () => {
        const router = express.Router();

        await ExpressSession.init();
        router.use(ExpressSession.sessionHandler);

        router.use(
            express.json(),
            cors({
                credentials: true,
                origin: process.env.NODE_ENV === "production" ? "*" : "http://localhost:3000",
            })
        );

        router.use("/user", userRouterCreate());
        router.use("/session", sessionRouterCreate());
        router.use("/question", questionRouterCreate());
        router.use("/exam", examRouterCreate());

        router.get("/", (_, res) => res.json({ ok: true }));

        return router;
    };
}
