import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/login/App";

import "bootstrap/dist/css/bootstrap.min.css";
import { LoginStateProvider } from "./loginState";

ReactDOM.render(
    <React.StrictMode>
        <LoginStateProvider>
            <App />
        </LoginStateProvider>
    </React.StrictMode>,
    document.getElementById("root")
);
