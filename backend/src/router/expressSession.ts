import { createClient } from "redis";
import { Config } from "../config";
import session from "express-session";

import connectRedis from "connect-redis";
const RedisStore = connectRedis(session);

import express, { Request, Response, NextFunction } from "express";
import { AppRouter } from ".";

export type RedisClient = ReturnType<typeof createClient>;

const uuidv4Regex = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

declare module "express-session" {
    interface SessionData {
        user_uuid: string;
        loggedIn: boolean;
    }
}

export class ExpressSession {
    private static redisClient: RedisClient;

    public static sessionHandler: express.RequestHandler;

    public static async init() {
        this.redisClient = createClient({
            legacyMode: true,
            url: `redis://${Config.Redis.host}:${Config.Redis.port}/${Config.Session.dbNumber}`,
        });
        await this.redisClient.connect();

        this.sessionHandler = session({
            secret: Config.Session.secret,
            store: new RedisStore({
                client: this.redisClient,
                ttl: Config.Session.ttl,
                disableTouch: false,
            }),
            cookie: {
                path: "/",
                maxAge: Config.Session.ttl * 1000,
            },
            resave: false,
            saveUninitialized: false,
            name: "sessionID",
        });
    }

    public static verifyLoggedIn = (req: Request, res: Response, next: NextFunction) => {
        if (req.session.loggedIn === true && req.session.user_uuid && uuidv4Regex.test(req.session.user_uuid)) {
            return next();
        }

        return AppRouter.unauthorized(res);
    };
}
