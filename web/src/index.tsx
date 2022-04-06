import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App";

import "bootstrap/dist/css/bootstrap.min.css";
import { LoginStateProvider } from "./loginContext";
import { ErrorStateProvider } from "./errorContext";

ReactDOM.render(
    <React.StrictMode>
        <ErrorStateProvider>
            <LoginStateProvider>
                <App />
            </LoginStateProvider>
        </ErrorStateProvider>
    </React.StrictMode>,
    document.getElementById("root")
);
