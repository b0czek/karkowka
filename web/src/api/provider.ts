import { LoginState } from "../loginContext";
import Cookie from "js-cookie";
import { errorAdd } from "../errorContext";

export interface ResponseBase {
    error: boolean;
    message: string | undefined;
}
export interface FetchBody {
    [key: string]: any;
}

const isDev = () => !process.env.NODE_ENV || process.env.NODE_ENV === "development";

export type WrappedMethod<F extends (body: B) => Promise<R>, R extends ResponseBase, B extends FetchBody | string> = F;

export class ApiProvider {
    protected static path: string = "/";

    public static setLoginState: (state: LoginState) => void = (state) => state;

    protected static clearSession = () => {
        this.setLoginState({
            loggedIn: false,
            user: undefined,
        });

        Cookie.remove("sessionID");
    };

    public static async _fetch<T extends FetchBody, P extends ResponseBase>(method: string, body: T): Promise<P> {
        return new Promise<P>(async (resolve, reject) => {
            try {
                let url = new URL(
                    `${window.location.protocol}//${isDev() ? "localhost:3001" : window.location.host}/api${this.path}`
                );
                if (method.toLowerCase() === "get") {
                    url.search = new URLSearchParams(body).toString();
                }

                let req = await fetch(url.href, {
                    method: method.toUpperCase(),
                    headers:
                        method.toLowerCase() !== "get"
                            ? {
                                  "Content-Type": "application/json",
                              }
                            : undefined,
                    body: method.toLowerCase() !== "get" ? JSON.stringify(body) : undefined,
                    credentials: "include",
                });

                // if authentication fails, log out
                if (req.status === 401) {
                    this.clearSession();
                }

                resolve(await req.json());
            } catch (err) {
                reject(err);
            }
        });
    }

    public static handleRequest = async <F extends (body: B) => Promise<R>, R extends ResponseBase, B extends FetchBody | string>(
        method: WrappedMethod<F, R, B>,
        body: B
    ): Promise<Awaited<ReturnType<F>> | string> => {
        return new Promise<Awaited<ReturnType<F>> | string>(async (resolve) => {
            let message = "";
            try {
                let response = await method(body);

                if (response.error) {
                    message = response.message!;
                } else {
                    return resolve(response as any as Awaited<ReturnType<F>>);
                }
            } catch (err: any) {
                message = err.message;
            }

            errorAdd({
                message,
                type: "error",
            });

            return resolve(message);
        });
    };
}
