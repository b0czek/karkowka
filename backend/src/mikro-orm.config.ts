import { Options } from "@mikro-orm/core";
import { MikroORM } from "@mikro-orm/core/MikroORM";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";

import path from "path";

export default {
    dbName: "karkowka",
    type: "postgresql",
    host: process.env.POSTGRES_HOST ?? "localhost",
    user: process.env.POSTGRES_USER ?? "postgres",
    password: process.env.POSTGRES_PASSWORD,
    entities: ["./dist/entities/**/*.js"],
    entitiesTs: ["./src/entities/**/*.ts"],
    debug: process.env.NODE_ENV !== "production",
    allowGlobalContext: true,
    migrations: {
        path: path.join(__dirname, "./migrations"),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    metadataProvider: TsMorphMetadataProvider,
} as Options;
