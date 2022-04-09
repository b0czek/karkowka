import React, { Dispatch } from "react";
import { FetchBody, ResponseBase } from "./api/provider";

export interface ErrorElement {
    message: string;
    type: "warning" | "error";
}

export type ErrorState = Array<ErrorElement>;

export const ErrorContext = React.createContext<ErrorState>([]);
export const DispatchErrorContext = React.createContext<Dispatch<ErrorState>>(() => {});

export const useErrorState = (): [ErrorState, Dispatch<ErrorState>] => [
    React.useContext(ErrorContext),
    React.useContext(DispatchErrorContext),
];

let errorState: [ErrorState, Dispatch<ErrorState>] | null = null;

export const ErrorStateProvider = (props: ErrorStateProviderProps) => {
    const [state, dispatch] = React.useState<ErrorState>([]);

    errorState = [state, dispatch];

    return (
        <ErrorContext.Provider value={state}>
            <DispatchErrorContext.Provider value={dispatch}>{props.children}</DispatchErrorContext.Provider>
        </ErrorContext.Provider>
    );
};

export const errorAdd = (error: ErrorElement) => {
    const [state, dispatch] = errorState!;
    dispatch([...state, error]);
};

interface ErrorStateProviderProps {
    children: JSX.Element | JSX.Element[] | string;
}
