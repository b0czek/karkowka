import { env } from "process";

export const Config = {
    Redis: {
        host: env.REDIS_HOST ?? "localhost",
        port: +(env.REDIS_PORT ?? 6379),
    },
    Session: {
        secret: env.SESSION_SECRET ?? "abcedfghijk",
        dbNumber: +(env.SESSION_DB_NUM ?? 0),
        ttl: +(env.SESSION_TTL ?? 86400),
        hashingRounds: +(env.SESSION_HASHING_ROUNDS ?? 9),
    },
};
