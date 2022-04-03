import { ApiProvider, ResponseBase } from "../provider";

export class User extends ApiProvider {
    protected static path = "/user";

    public static get = async (user_uuid?: string): Promise<UserGetResponse> => {
        console.log(this.path);
        return super._fetch("get", { user_uuid });
    };
    public static create = async (body: UserCreateBody): Promise<ResponseBase> => super._fetch("post", body);
    public static delete = async (): Promise<ResponseBase> => super._fetch("delete", {});
}

interface UserCreateBody {
    username: string;
    password: string;
    name: string;
}

interface UserGetResponse extends ResponseBase {
    user: UserObject;
}
interface UserObject {
    uuid: string;
    created_at: string;
    username: string;
    name: string;
    deleted: boolean;
}
