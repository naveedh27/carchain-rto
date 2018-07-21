import React, { Component } from 'react';
import { Container, Form, Button, Dimmer, Loader, TransitionablePortal, Segment, Header } from 'semantic-ui-react';
import axios from 'axios';

var util = require('../util/Util');
var user = util.user;
var url = util.endpoint;


class AddUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            address: '',
            phone: '',
            email: '',
            balance: '',
            country: '',
            state: '',
            city: '',
            street: '',
            loading: false,
            popuMsg: '',
            showPopup: ''
        }
    }

    addUserData = async () => {
        var formData = "{  \"$class\": \"org.acme.carchain.contactDetails\",  \"customer_id\": \"" + this.state.name + "\",  \"customer_name\": \"" + this.state.name + "\",  \"Phone\": \"" + this.state.phone + "\",  \"emailId\": \"" + this.state.email + "\",  \"balance\": " + this.state.balance + ",  \"address\": {    \"$class\": \"org.acme.carchain.address\",    \"country\": \"" + this.state.country + "\",    \"state\": \"" + this.state.state + "\",    \"city\": \"" + this.state.city + "\",    \"street\": \"" + this.state.street + "\"  }}";

        var headers = {
            'Content-Type': 'application/json'
        }

        this.setState({ loading: true });
        try {

            let response = await axios.post(url.url + 'contactDetails', JSON.parse(formData), headers);
            if (response.status == '200') {
                this.setState({ popuMsg: 'Added Successfully' });
                this.setState({
                    name: '',
                    address: '',
                    phone: '',
                    email: '',
                    balance: '',
                    country: '',
                    state: '',
                    city: '',
                    street: '',
                });
            } else {
                this.setState({ popuMsg: 'Error in Addition' });
            }

        } catch (err) {
            console.error(err);
            this.setState({ popuMsg: 'Error in Addition' });
        }
        this.setState({ loading: false, showPopup: true });
        setTimeout(this.hideSuccessMsg, 1500);
    }

    hideSuccessMsg = () => {
        this.setState({ showPopup: false });
    }


    render() {
        return (
            <Container>
                <Form >
                    <Dimmer active={this.state.loading}>
                        <Loader size='huge'>Adding User to Blockchain</Loader>
                    </Dimmer>
                    <TransitionablePortal open={this.state.showPopup}>
                        <Segment inverted style={{ left: '40%', position: 'fixed', top: '50%', zIndex: 1000 }}>
                            <Header>{this.state.popuMsg}</Header>
                        </Segment>
                    </TransitionablePortal>
                    <Form.Group unstackable widths={2}>
                        <Form.Input label='Name'
                            value={this.state.name}
                            onChange={(event) => { this.setState({ name: event.target.value }) }}
                            placeholder='First name' />
                    </Form.Group>
                    <Form.Group widths={2}>
                        <Form.Input label='Cust ID' value={this.state.name} />
                        <Form.Input label='Phone' value={this.state.phone}
                            onChange={(event) => { this.setState({ phone: event.target.value }) }}
                            placeholder='Phone' />
                    </Form.Group>
                    <Form.Group widths={2}>
                        <Form.Input label='Email Id' value={this.state.email}
                            onChange={(event) => { this.setState({ email: event.target.value }) }}
                            placeholder='Email' />
                        <Form.Input label='Balance' value={this.state.balance}
                            onChange={(event) => { this.setState({ balance: event.target.value }) }}
                            placeholder='Balance' />
                    </Form.Group>
                    <Form.Group widths={4}>
                        <Form.Input label='Country' value={this.state.country}
                            onChange={(event) => { this.setState({ country: event.target.value }) }}
                            placeholder='Country' />
                        <Form.Input label='State' value={this.state.state}
                            onChange={(event) => { this.setState({ state: event.target.value }) }}
                            placeholder='State' />
                        <Form.Input label='Street' value={this.state.street}
                            onChange={(event) => { this.setState({ street: event.target.value }) }}
                            placeholder='Street' />
                        <Form.Input label='City' value={this.state.city}
                            onChange={(event) => { this.setState({ city: event.target.value }) }}
                            placeholder='City' />
                    </Form.Group>
                    <Button type='submit'
                        primary
                        onClick={this.addUserData}
                    >Submit</Button>
                </Form>
            </Container>
        );
    }
}

export default AddUser; 