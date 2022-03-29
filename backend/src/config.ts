import { env } from "process";

export const Config = {
    Redis: {
        host: env.REDIS_HOST ?? "localhost",
        port: +(env.REDIS_PORT ?? 6379),
        dbNumber: +(env.REDIS_DB_NUMBER ?? 0),
    },
};
