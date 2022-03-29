import { MikroORM } from "@mikro-orm/core/MikroORM";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";

import path from "path";

export default {
    dbName: "karkowka",
    type: "postgresql",
    user: "postgres",
    entities: ["./dist/entities/**/*.js"],
    entitiesTs: ["./src/entities/**/*.ts"],
    debug: process.env.NODE_ENV !== "production",
    allowGlobalContext: true,
    migrations: {
        path: path.join(__dirname, "./migrations"),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    metadataProvider: TsMorphMetadataProvider,
} as Parameters<typeof MikroORM.init>[0];
