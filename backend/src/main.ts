import express from "express";
import { Database } from "./database";
import { RedisClient } from "./redis";
import { AppRouter } from "./router";

const PORT = process.env.PORT ?? 3001;

const main = async () => {
    await Database.connect();
    await RedisClient.connect();

    const app = express();

    app.use("/api", AppRouter.create());

    app.listen(PORT, () => {
        console.log(`app listening on port ${PORT}`);
    });
};

main().catch((err) => console.log(err));
