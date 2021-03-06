import React from "react";
import { LoginPage } from "./login/LoginPage";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import { useLoginState } from "../loginContext";
import { NavBar } from "./NavBar";
import { QuestionListsPage } from "./questionLists/QuestionListsPage";
import { QuestionListPage } from "./questionList/QuestionListPage";
import { NotFound } from "./NotFound";
import { ErrorDisplay } from "./ErrorDisplay";
import { ExamsPage } from "./exams/ExamsPage";
import { ExamPage } from "./exam/ExamPage";
import { ExamResultPage } from "./exam/ExamResultPage";
import { ChangePasswordPage } from "./ChangePasswordPage";
import { ParticipatedExamsPage } from "./participatedExams/ParticipatedExamsPage";
import { JoinExamPage } from "./participateExam/JoinExamPage";
import { ParticipateExamPage } from "./participateExam/ParticipateExamPage";
import { ParticipatedExamResultPage } from "./participatedExams/ParticipatedExamResultPage";

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
                            <ParticipatedExamsPage />
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
                    path="exams"
                    element={
                        <AuthRoute>
                            <ExamsPage />
                        </AuthRoute>
                    }
                />
                <Route
                    path="exam/:exam_uuid"
                    element={
                        <AuthRoute>
                            <ExamPage />
                        </AuthRoute>
                    }
                />
                <Route
                    path="exam/:exam_uuid/result/:user_uuid"
                    element={
                        <AuthRoute>
                            <ExamResultPage />
                        </AuthRoute>
                    }
                />

                <Route
                    path="changePassword"
                    element={
                        <AuthRoute>
                            <ChangePasswordPage />
                        </AuthRoute>
                    }
                />

                <Route
                    path="join/:exam_uuid"
                    element={
                        <AuthRoute>
                            <JoinExamPage />
                        </AuthRoute>
                    }
                />

                <Route
                    path="participate/:participation_uuid"
                    element={
                        <AuthRoute>
                            <ParticipateExamPage />
                        </AuthRoute>
                    }
                />

                <Route
                    path="result/:participation_uuid"
                    element={
                        <AuthRoute>
                            <ParticipatedExamResultPage />
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
