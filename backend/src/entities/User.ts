import { Entity, Property, PrimaryKey } from "@mikro-orm/core";
import crypto from "crypto";

@Entity()
export class User {
    @PrimaryKey({ type: "string" })
    uuid: string = crypto.randomUUID();

    @Property({ type: Date })
    created_at?: Date = new Date();

    @Property({ type: "string" })
    password_hash: string;

    @Property({ type: "string", unique: true })
    username: string;

    @Property({ type: "string" })
    name: string;
}
