import { Connection, IDatabaseDriver, MikroORM } from "@mikro-orm/core";
import mikroOrmConfig from "./mikro-orm.config";

export class Database {
    public static orm: MikroORM<IDatabaseDriver<Connection>>;

    public static async connect() {
        this.orm = await MikroORM.init(mikroOrmConfig);
        await this.orm.getMigrator().up();

        return this.orm;
    }
}
