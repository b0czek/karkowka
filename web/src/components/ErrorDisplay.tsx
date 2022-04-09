import React from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { ErrorElement, useErrorState } from "../errorContext";

interface ErrorToastProps {
    error: ErrorElement;
    idx: number;
    removeError: (idx: number) => void;
}

const ErrorToast = (props: ErrorToastProps) => {
    return (
        <Toast onClose={() => props.removeError(props.idx)}>
            <Toast.Header style={{ color: "#fff", backgroundColor: props.error.type === "error" ? "#dc3545" : "#ffc107" }}>
                <strong className="me-auto">Error</strong>
            </Toast.Header>
            <Toast.Body>{props.error.message}</Toast.Body>
        </Toast>
    );
};

export const ErrorDisplay = () => {
    const [errorState, setErrorState] = useErrorState();

    const removeError = (idx: number) => setErrorState(errorState.filter((_, i) => i !== idx));

    return (
        <ToastContainer position="bottom-end" className="p-3">
            {errorState.map((error, idx) => (
                <ErrorToast error={error} key={idx} idx={idx} removeError={removeError} />
            ))}
        </ToastContainer>
    );
};
