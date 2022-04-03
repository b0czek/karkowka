import React from "react";
import { LoginPage } from "./LoginPage";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import { ApiProvider } from "../../api/provider";
import { useLoginState } from "../../loginState";

const App = () => {
    const state = useLoginState();
    return (
        <Router>
            <Routes>
                {state.loggedIn! ? null : <Route path="*" element={<Navigate to="/login" replace />} />}

                <Route path="/login" element={<LoginPage />} />
            </Routes>
        </Router>
    );
};

export default App;
