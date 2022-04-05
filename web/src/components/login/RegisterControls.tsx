import React from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { User } from "../../api/user";

export class RegisterControls extends React.Component {
    state = {
        username: "",
        password: "",
        name: "",
        message: "",
        isError: false,
    };

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    setError = (message: string) => {
        this.setState({
            isError: true,
            message: `Could not create user, ${message}.`,
        });
    };

    handleRegistration = async (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();

        this.setState({ message: "", isError: false });
        try {
            let response = await User.create({
                name: this.state.name,
                username: this.state.username,
                password: this.state.password,
            });

            if (response.error) {
                this.setError(response.message!);
            } else {
                this.setState({
                    message: "user created sucessfully",
                });
            }
        } catch (err: any) {
            this.setError(err.message);
        }
    };

    RegistrationAlert = () => <Alert variant={this.state.isError ? "danger" : "success"}>{this.state.message}</Alert>;

    render() {
        return (
            <Form>
                {this.state.message.length > 0 ? <this.RegistrationAlert /> : null}
                <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" value={this.state.name} name="name" onChange={this.handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" value={this.state.username} name="username" onChange={this.handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" value={this.state.password} name="password" onChange={this.handleChange} />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100" onClick={this.handleRegistration}>
                    Register
                </Button>
            </Form>
        );
    }
}
