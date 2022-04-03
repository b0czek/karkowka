import { ApiProvider, ResponseBase } from "../provider";

export class Session extends ApiProvider {
    protected static path = "/session";

    public static login = async (body: SessionLoginBody): Promise<ResponseBase> => super._fetch("post", body);
    public static logout = async (): Promise<ResponseBase> => super._fetch("delete", {});
}

interface SessionLoginBody {
    username: string;
    password: string;
}
