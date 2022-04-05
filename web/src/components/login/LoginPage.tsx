import React from "react";
import { Container, Row, Col, Button, Nav } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { RegisterControls } from "./RegisterControls";
import { LoginControls } from "./LoginControls";
import { useLoginState } from "../../loginContext";
import { Route, Navigate, Routes } from "react-router-dom";

const LoginBody = () => {
    const [showRegister, setShowRegister] = React.useState(false);

    return (
        <Container>
            <Row className="d-flex align-items-center justify-content-center " style={{ height: "100vh" }}>
                <Col xs={10} sm={8} md={6} lg={4} xl={3}>
                    {showRegister ? <RegisterControls /> : <LoginControls />}
                    <Nav.Item>
                        <Nav.Link className="text-end" onClick={() => setShowRegister(!showRegister)}>
                            {showRegister ? "Login" : "Register"}
                        </Nav.Link>
                    </Nav.Item>
                </Col>
            </Row>
        </Container>
    );
};

export const LoginPage = () => {
    const [loginState, dispatchLoginState] = useLoginState();

    return loginState.loggedIn ? (
        <Routes>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    ) : (
        <LoginBody />
    );
};
