import React from "react";
import { Button, Form, Alert } from "react-bootstrap";
import { Session } from "../../api/session";

export class LoginControls extends React.Component {
    state = {
        username: "",
        password: "",
        errorMessage: "",
    };

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    handleLogin = async (e: React.FormEvent<HTMLButtonElement>) => {
        this.setState({ errorMessage: "" });

        e.preventDefault();
        let res = await Session.login({
            username: this.state.username,
            password: this.state.password,
        });

        if (res.error) {
            this.setState({ errorMessage: res.message });
        }

        console.log(res);
    };

    LoginAlert = () => <Alert variant={"danger"}>{this.state.errorMessage}</Alert>;

    render() {
        return (
            <Form>
                {this.state.errorMessage.length === 0 ? null : <this.LoginAlert />}
                <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" name="username" value={this.state.username} onChange={this.handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name="password" value={this.state.password} onChange={this.handleChange} />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100" onClick={this.handleLogin}>
                    Login
                </Button>
            </Form>
        );
    }
}
