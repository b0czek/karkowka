import { createClient } from "redis";
import { Config } from "./config";

export type RedisClientType = ReturnType<typeof createClient>;

export class RedisClient {
    public static client: RedisClientType;

    public static async connect() {
        this.client = createClient({
            url: `redis://${Config.Redis.host}:${Config.Redis.port}/${Config.Redis.dbNumber}`,
        });
        await this.client.connect();
    }
}
