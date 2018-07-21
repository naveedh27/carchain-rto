import React, { Component } from 'react';
import { Form, Button, Segment, Container, Message } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'

var util = require('./Util');
var user = util.user;
var url = util.endpoint;

class LoginHandler extends Component {

    state = {
        redirectToReferrer: false,
        userName : ''
    }

    login = () => {
        user.authenticate(() => {
            user.name = this.state.userName;
            this.setState(() => ({
                redirectToReferrer: true
            }))
        })
    }

    handleChange(event) {
        this.setState({ userName: event.target.value })
    }


    render() {
        const { redirectToReferrer } = this.state

        if (redirectToReferrer === true) {
            return <Redirect to='/' />
        }

        return (
            <Container>
                <Segment>
                    <Form error={this.state.error}>
                        <Form.Field>
                            <label>User Name</label>
                            <input
                                value={this.state.userName}
                                onChange={this.handleChange.bind(this)}
                                placeholder='User Name' />
                        </Form.Field>
                        <Form.Field>
                            <label>Password</label>
                            <input type='password' placeholder='Password' />
                        </Form.Field>
                        <Button
                            onClick={this.login.bind(this)}>Submit</Button>
                        <Message
                            error
                            header='Action Forbidden'
                            content='Incorrect User Name or Password'
                        />
                    </Form>
                </Segment>
            </Container>

        );
    }
}

export default LoginHandler; 