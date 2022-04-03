import { createClient } from "redis";
import { Config } from "../config";
import session from "express-session";

import connectRedis, { RedisStore as IRedisStore } from "connect-redis";
const RedisStore = connectRedis(session);

import express, { Request, Response, NextFunction } from "express";
import { AppRouter } from ".";
import { Database } from "../database";
import { User } from "../entities/User";

export type RedisClient = ReturnType<typeof createClient>;

declare module "express-session" {
    interface SessionData {
        user_uuid: string;
        loggedIn: boolean;
    }
}

export class ExpressSession {
    private static redisClient: RedisClient;
    private static redisStore: IRedisStore;

    public static sessionHandler: express.RequestHandler;

    public static async init() {
        this.redisClient = createClient({
            legacyMode: true,
            url: `redis://${Config.Redis.host}:${Config.Redis.port}/${Config.Session.dbNumber}`,
        });
        await this.redisClient.connect();

        this.redisStore = new RedisStore({
            client: this.redisClient,
            ttl: Config.Session.ttl,
            disableTouch: false,
        });

        this.sessionHandler = session({
            secret: Config.Session.secret,
            store: this.redisStore,
            cookie: {
                path: "/",
                maxAge: Config.Session.ttl * 1000,
            },
            resave: false,
            saveUninitialized: false,
            name: "sessionID",
        });
    }

    public static verifyLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
        if (req.session.loggedIn === true && req.session.user_uuid) {
            try {
                await Database.orm.em.findOneOrFail(User, {
                    uuid: req.session.user_uuid,
                    deleted: false,
                });
                return next();
            } catch (err) {
                req.session.destroy((e) => e);
                return AppRouter.unauthorized(res);
            }
        } else {
            return AppRouter.unauthorized(res);
        }
    };
}
