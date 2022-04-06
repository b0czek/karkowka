import React, { Dispatch } from "react";
import { FetchBody, ResponseBase } from "./api/provider";

export interface ErrorElement {
    message: string;
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

export type WrappedMethod<F extends (body: B) => Promise<R>, R extends ResponseBase, B extends FetchBody | string> = F;

export const handleRequestErrorWrapper = async <
    F extends (body: B) => Promise<R>,
    R extends ResponseBase,
    B extends FetchBody | string
>(
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

        const [state, dispatch] = errorState!;
        dispatch([
            ...state,
            {
                message,
            },
        ]);

        return resolve(message);
    });
};

interface ErrorStateProviderProps {
    children: JSX.Element | JSX.Element[] | string;
}
