import { LoginState } from "../loginState";

export interface ResponseBase {
    error: boolean;
    message: string | undefined;
}
const isDev = () => !process.env.NODE_ENV || process.env.NODE_ENV === "development";

export class ApiProvider {
    protected static path: string = "/";

    public static setLoginState?: (state: LoginState) => void;

    public static async _fetch<T extends object, P extends ResponseBase>(method: string, body: T): Promise<P> {
        return new Promise<P>(async (resolve, reject) => {
            try {
                let url = `${window.location.protocol}//${isDev() ? "localhost:3001" : window.location.host}/api${this.path}`;
                if (isDev()) {
                    console.log(url);
                }
                let req = await fetch(url, {
                    method,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                });

                if (req.status == 401 && this.setLoginState) {
                    this.setLoginState({
                        loggedIn: false,
                        name: undefined,
                        username: undefined,
                    });
                }
                resolve(await req.json());
            } catch (err) {
                reject(err);
            }
        });
    }
}
