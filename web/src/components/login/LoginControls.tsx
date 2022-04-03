import React from "react";
import { Button, Form } from "react-bootstrap";
import { Session } from "../../api/session";

export class LoginControls extends React.Component {
    state = {
        username: "",
        password: "",
    };

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    handleLogin = async () => {
        let res = await Session.login({
            username: this.state.username,
            password: this.state.password,
        });
        console.log(res);
    };

    render() {
        return (
            <>
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
            </>
        );
    }
}
