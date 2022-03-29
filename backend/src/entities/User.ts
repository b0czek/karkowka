import { Entity, Property, PrimaryKey } from "@mikro-orm/core";
import crypto from "crypto";

@Entity()
export class User {
    @PrimaryKey()
    id!: number;

    @Property({ type: "string", unique: true, index: true })
    user_uuid: string = crypto.randomUUID();

    @Property({ type: "string" })
    password_hash: string;

    @Property({ type: "string" })
    username: string;

    @Property({ type: "string" })
    name: string;
}
