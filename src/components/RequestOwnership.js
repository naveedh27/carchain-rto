import React, { Component } from 'react';
import { Card, Grid, Segment, Label, Item, Image, Table, Header, Dimmer, Loader, TransitionablePortal, Icon, GridColumn, GridRow, Container, Button, Input } from 'semantic-ui-react'
import axios from 'axios';

var util = require('../util/Util');
var user = util.user;
var url = util.endpoint;

class RequestOwnership extends Component {


  constructor(props) {
    super(props);
    this.state = {
      allPendingReq: '',
      grid: '',
      regNo: [],
      loading: false,
      showPopup: false,
      popuMsg: ''
    }
    this.getAllAssignRequest();
  }

  calculateAge = (birthday) => {
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  sendAcceptTransaction = async (event, i) => {
    i = i.dataid
    var rtoAssetId = this.state.allPendingReq[i].recordId;
    console.log(this.state.allPendingReq[i].recordId);



    if (this.state.regNo[i] === '' || this.state.regNo[i] === undefined) {
      alert('Enter Reg No.')
      return;
    }

    var formData = "{  \"$class\": \"org.acme.carchain.RTOtransferOwnership\",  \"recordId\": \"" + rtoAssetId + "\",  \"vin\": \"" + this.state.regNo[i] + "\"}";

    var headers = {
      'Content-Type': 'application/json'
    }

    try {

      this.setState({ loading: true });
      let response = await axios.post(url.url + 'RTOtransferOwnership', JSON.parse(formData), headers);

      console.log(response);
      if (response.status === '200') {
        this.setState({ popuMsg: 'Transaction Sucessful', showPopup: true, loading: false });
        this.setState({ loading: false });
      } else {
        this.setState({ loading: false });
      }


    } catch (err) {
      console.error(err);
      this.setState({ loading: false });
    }


    this.getAllAssignRequest();


  }

  sendRejectTransaction = async (event, i) => {
    i = i.dataid
    var rtoAssetId = this.state.allPendingReq[i].recordId;
    console.log(this.state.allPendingReq[i].recordId);

    var formData = "{  \"$class\": \"org.acme.carchain.RTOtransferOwnership\",  \"recordId\": \"" + rtoAssetId + "\",  \"vin\": \"\"}";

    var headers = {
      'Content-Type': 'application/json'
    }

    try {

      this.setState({ loading: true });
      let response = await axios.post(url.url + 'RTOtransferOwnership', JSON.parse(formData), headers);

      console.log(response);
      if (response.status === '200') {
        this.setState({ popuMsg: 'Transaction Sucessful', showPopup: true, loading: false });
        this.setState({ loading: false });
      } else {
        this.setState({ loading: false });
      }

    } catch (err) {
      console.error(err);
      this.setState({ loading: false });
    }


    this.getAllAssignRequest();


  }

  appendData = (marketObj) => {

    let data = [], i = 0;
    marketObj.forEach((market) => {
      data.push(
        <Grid.Row stretched key={i}>
          <Grid.Column width={3}>
            <Segment textAlign='center' tertiary>
              <Image size='big' circular src={require('../assets/images/' + market.MakerName + '.png')} />
            </Segment>
          </Grid.Column>
          <Grid.Column width={13}>
            <Grid divided>
              <Grid.Row columns={3} >
                <Grid.Column >
                  <Segment>{market.MakerName + " - " + market.model}</Segment>
                  <Segment> <strong>Manufactured Year : </strong>{new Date(market.ManufacturingYear).getFullYear()}</Segment>
                </Grid.Column>
                <Grid.Column >
                  <Segment>
                    {this.getRegNo(market.flag, market.vin, i)}
                  </Segment>
                  <Segment><strong>Purchase Date : </strong>{new Date(market.purchaseDate).toLocaleDateString()}</Segment>
                </Grid.Column>
                <Grid.Column >
                  <Segment>Age of Car : {this.calculateAge(new Date(market.purchaseDate))} </Segment>
                  <Segment>Price : {market.price} </Segment>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row columns={1} >
                <Grid.Column >
                  <Grid>
                    <Grid.Row columns={2}>
                      <Grid.Column stretched>
                        <Card fluid>
                          <Card.Content>
                            <Card.Header>Buyer</Card.Header>
                            <Card.Meta></Card.Meta>
                            <Card.Description>
                              <strong>
                                {market.customerId}
                              </strong>
                            </Card.Description>
                          </Card.Content>
                        </Card>
                      </Grid.Column>
                      <Grid.Column stretched>
                        <Card fluid>
                          <Card.Content>
                            <Card.Header>Seller</Card.Header>
                            <Card.Meta></Card.Meta>
                            <Card.Description>
                              <strong>
                                {market.customer_name}
                              </strong>
                            </Card.Description>
                          </Card.Content>
                        </Card>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={1}>
                      <Grid.Column stretched>
                        <Container fluid>

                          <Button.Group >
                            <Button
                              color='blue'
                              dataid={i}
                              loading={this.state.loading}
                              onClick={(event, id) => {
                                this.sendAcceptTransaction(event, id)
                              }
                              }>
                              Accept Transaction
                              </Button>
                            <Button.Or />
                            <Button negative
                              dataid={i}
                              loading={this.state.loading}
                              onClick={(event, id) => {
                                this.sendRejectTransaction(event, id)
                              }
                              }>
                              Reject Transaction
                            </Button>
                          </Button.Group>
                        </Container>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid.Row>
      );
      i++;
    });

    this.setState({ grid: data });

  }

  handleChange = (event, i) => {
    var items = this.state.regNo;
    items[i] = event.target.value;
    this.setState({ regNo: items })
  }

  getRegNo = (status, regNum, i) => {
    if (status === 'request_for_new_car') {
      return (
        <Input
          iconPosition='left'
          value={this.state.regNo[i]}
          onChange={(event) => this.handleChange(event, i)}
          size='small'
          label={{ tag: true, content: 'New', color: 'green' }}
          labelPosition='left'
          placeholder='Registration No.'
        />
      );
    } else {
      return (
        <Label as='a' size='big' tag>{regNum}</Label>
      );
    }
  }

  getAllAssignRequest = async () => {

    let assignReq = ''

    assignReq = await axios.get(url.url + 'RTOtransfer');

    let allReq = assignReq.data;

    allReq = allReq.filter((element) => {
      if (element.status !== "approved") {
        return element;
      }
    });


    let results = '';

    try {
      results = allReq.map(async (eachreq) => {
        try {
          return axios.get(url.url + 'marketPlace/' + eachreq.puchaseRequestId);
        } catch (e) {
          console.log('asad');
          return '';
        }

      });

      console.log(results);
    } catch (err) {
      console.log(err);
    }

    let marketObj = [];


    var values = await Promise.all(results.map(this.ignore));
    console.log(values);

    let i = 0;
    values = values.filter(function (element) {
      i++;
      if (element === undefined) {
        allReq.splice(i - 1, 1);
      }
      return element !== undefined;
    });

    this.setState({ allPendingReq: allReq });

    if (values.length > 0) {

      values.map((each) => {
        if (each !== undefined) {
          marketObj.push(each.data);
          if (values.length == marketObj.length)
            this.appendData(marketObj);
        }
      })

    } else {
      this.setState({ grid: <Card fluid color='green' header='No Pending Items...' /> });
    }



    //   await Promise.all(results).then(async (completed) => {
    //     results.map(async (each) => {
    //       each.then(async (result) => {
    //         marketObj.push(result.data);
    //         if (results.length == marketObj.length)
    //           this.appendData(marketObj);
    //       }).catch( async(err)=>{
    //           console.log(err);
    //       })
    //     })
    //   }).catch( async(err)=>{
    //     console.log(err);
    // });




  }

  ignore = (promise) => {
    return promise.catch(e => undefined);
  }

  render() {
    return (
      <Container>

        <Dimmer.Dimmable as={Container} active={this.state.loading}>

          <TransitionablePortal open={this.state.showPopup}>
            <Segment inverted style={{ left: '40%', position: 'fixed', zIndex: 1000 }}>
              <Header>{this.state.popuMsg}</Header>
            </Segment>
          </TransitionablePortal>
          <Grid columns={2} divided>
            {this.state.grid}
          </Grid>

          <Dimmer active={this.state.loading}>
            <Loader size='huge'>Sending Transaction</Loader>
          </Dimmer>
        </Dimmer.Dimmable>

      </Container>);
  }
}

export default RequestOwnership; 