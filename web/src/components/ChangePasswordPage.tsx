import React from "react";
import { Alert, Button, Col, Form } from "react-bootstrap";
import { UserPassword } from "../api/user/password";
import { errorAdd } from "../errorContext";
import { Page } from "./Page";

export class ChangePasswordPage extends React.Component {
    state = {
        oldPassword: "",
        newPassword: "",
        newPasswordConfirm: "",
        wasChanged: false,
    };

    onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    RegistrationAlert = () => <Alert variant="success">Password changed successfully</Alert>;

    changePassword = async () => {
        this.setState({ wasChanged: false });
        if (this.state.newPassword !== this.state.newPasswordConfirm) {
            errorAdd({
                message: "new passwords do not match",
                type: "warning",
            });
            return;
        }
        let res = await UserPassword.handleRequest(UserPassword.edit, {
            old_password: this.state.oldPassword,
            new_password: this.state.newPassword,
        });

        if (typeof res === "string") {
            return;
        }
        this.setState({ wasChanged: true });
    };

    render() {
        return (
            <Page style={{ height: "90vh" }}>
                <Col xs={10} sm={8} md={6} lg={4} xl={3}>
                    {this.state.wasChanged ? <this.RegistrationAlert /> : null}
                    <Form>
                        <Form.Control
                            type="password"
                            placeholder="Old password"
                            className="mb-3"
                            name="oldPassword"
                            value={this.state.oldPassword}
                            onChange={this.onChange}
                        />
                        <Form.Control
                            type="password"
                            placeholder="New password"
                            className="mb-3"
                            name="newPassword"
                            value={this.state.newPassword}
                            onChange={this.onChange}
                        />
                        <Form.Control
                            type="password"
                            placeholder="Confirm new password"
                            className="mb-3"
                            name="newPasswordConfirm"
                            value={this.state.newPasswordConfirm}
                            onChange={this.onChange}
                        />
                        <Button style={{ width: "100%" }} onClick={this.changePassword}>
                            Change password
                        </Button>
                    </Form>
                </Col>
            </Page>
        );
    }
}
