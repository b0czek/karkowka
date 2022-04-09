import { ApiProvider, FetchBody, ResponseBase } from "../provider";

export class User extends ApiProvider {
    protected static path = "/user";

    public static get = async (body: UserGetBody): Promise<UserGetResponse> => {
        return super._fetch("get", body.user_uuid ? body : {});
    };
    public static create = async (body: UserCreateBody): Promise<ResponseBase> => super._fetch("post", body);
    public static delete = async (): Promise<ResponseBase> => super._fetch("delete", {});
}

interface UserCreateBody {
    username: string;
    password: string;
    name: string;
}

interface UserGetBody extends FetchBody {
    user_uuid?: string;
}

interface UserGetResponse extends ResponseBase {
    user: UserObject;
}
export interface UserObject {
    uuid: string;
    created_at: string;
    username: string;
    name: string;
    deleted: boolean;
}
