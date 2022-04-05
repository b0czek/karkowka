import { ApiProvider, ResponseBase } from "../provider";

export class Session extends ApiProvider {
    protected static path = "/session";

    public static login = async (body: SessionLoginBody): Promise<SessionLoginResponse> => {
        let response = (await super._fetch("post", body)) as SessionLoginResponse;
        if (response.error === false) {
            this.setLoginState({
                loggedIn: true,
            });
        }

        return response;
    };

    public static logout = async (): Promise<ResponseBase> => {
        let res = await super._fetch("delete", {});
        this.clearSession();

        return res;
    };
}

interface SessionLoginBody {
    username: string;
    password: string;
}

interface SessionLoginResponse extends ResponseBase {
    uuid: string;
    name: string;
    username: string;
}
