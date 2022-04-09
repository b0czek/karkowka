import { ApiProvider, ResponseBase } from "../provider";

export class UserPassword extends ApiProvider {
    protected static path = "/user/password";

    public static edit = async (body: UserPasswordPatchBody): Promise<ResponseBase> => super._fetch("patch", body);
}

interface UserPasswordPatchBody {
    old_password: string;
    new_password: string;
}
