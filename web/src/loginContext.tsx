import Cookies from "js-cookie";
import React, { Dispatch } from "react";
import { ApiProvider } from "./api/provider";
import { User } from "./api/user";

const isSessionCookieSet = () => Object.keys(Cookies.get()).some((key) => key === "sessionID");

const defaultLoginState: LoginState = {
    loggedIn: isSessionCookieSet(),
};

export const LoginContext = React.createContext(defaultLoginState);
export const DispatchLoginContext = React.createContext<Dispatch<LoginState>>(() => {});

export const useLoginState = (): [LoginState, Dispatch<LoginState>] => [
    React.useContext(LoginContext),
    React.useContext(DispatchLoginContext),
];

export const LoginStateProvider = (props: any) => {
    const [state, dispatch] = React.useReducer(
        (state: LoginState, newValue: Partial<LoginState>) => ({ ...state, ...newValue }),
        defaultLoginState
    );

    const fetchUser = async () => {
        try {
            let user = await User.get();
            if (user.error) {
                return;
            }
            dispatch({
                loggedIn: true,
                user: {
                    name: user.user.name,
                    username: user.user.username,
                    uuid: user.user.uuid,
                },
            });
        } catch (err: any) {
            console.error(err.message);
        }
    };

    React.useEffect(() => {
        if (state.loggedIn) {
            fetchUser();
        }
    }, [state.loggedIn]);

    ApiProvider.setLoginState = dispatch;

    return (
        <LoginContext.Provider value={state}>
            <DispatchLoginContext.Provider value={dispatch}>{props.children}</DispatchLoginContext.Provider>
        </LoginContext.Provider>
    );
};

export interface LoginState {
    loggedIn: boolean;
    user?: LoginUser;
}

export interface LoginUser {
    username: string;
    name: string;
    uuid: string;
}
