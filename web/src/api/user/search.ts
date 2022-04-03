import { ApiProvider, ResponseBase } from "../provider";

export class UserSearch extends ApiProvider {
    protected static path = "/user/search";
    public static search = async (username: string): Promise<UserSearchResponse> => super._fetch("get", { username });
}

interface UserSearchResponse extends ResponseBase {
    user_uuid: string;
}
