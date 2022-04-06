import React from "react";
import { LoginPage } from "./login/LoginPage";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import { useLoginState } from "../loginContext";
import { NavBar } from "./NavBar";
import { QuestionListsPage } from "./questionLists/QuestionListsPage";
import { QuestionListPage } from "./questionList/QuestionListPage";
import { NotFound } from "./NotFound";
import { ErrorDisplay } from "./ErrorDisplay";

const AuthRoute = (props: { [key: string]: any; children: JSX.Element }) => {
    const [loginState, _] = useLoginState();

    const { children, ...properties } = props;

    return loginState.loggedIn ? children : <Navigate to="/login" replace />;
};

const App = () => {
    const [loginState, setLoginState] = useLoginState();
    console.log(`user logged in: ${loginState.loggedIn}`);
    return (
        <Router>
            <NavBar />
            <ErrorDisplay />
            <Routes>
                <Route path="/login/*" element={<LoginPage />} />

                <Route
                    path="/"
                    element={
                        <AuthRoute>
                            <></>
                        </AuthRoute>
                    }
                />
                <Route
                    path="questionLists"
                    element={
                        <AuthRoute>
                            <QuestionListsPage />
                        </AuthRoute>
                    }
                />
                <Route
                    path="questionList/:list_uuid"
                    element={
                        <AuthRoute>
                            <QuestionListPage />
                        </AuthRoute>
                    }
                />
                <Route
                    path="*"
                    element={
                        <AuthRoute>
                            <NotFound />
                        </AuthRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
