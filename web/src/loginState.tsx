import React, { Dispatch } from "react";
import { ApiProvider } from "./api/provider";

const defaultLoginState: LoginState = {
    loggedIn: false,
};

const GlobalLoginContext = React.createContext(defaultLoginState);
const DispatchLoginContext = React.createContext<Dispatch<LoginState>>(() => {});

export const LoginStateProvider = (props: any) => {
    const [state, dispatch] = React.useReducer((state: any, newValue: any) => ({ ...state, ...newValue }), defaultLoginState);

    if (!ApiProvider.setLoginState) {
        ApiProvider.setLoginState = dispatch;
    }

    return (
        <GlobalLoginContext.Provider value={state}>
            <DispatchLoginContext.Provider value={dispatch}>{props.children}</DispatchLoginContext.Provider>
        </GlobalLoginContext.Provider>
    );
};

export const useLoginState = (): LoginState => React.useContext(GlobalLoginContext);
// export const useLoginState = (state: LoginState) => {
//     const dispatch = React.useContext(DispatchLoginContext);
//     dispatch(state);
// };

export interface LoginState {
    loggedIn: boolean;
    username?: string;
    name?: string;
}
