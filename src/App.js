import React, { Component } from 'react';

import { Route, BrowserRouter, Switch, Redirect } from 'react-router-dom'

import Layout from './components/Layout';
import Error from './components/Error';
import MenuExample from './components/Menu';
import RequestOwnership from './components/RequestOwnership';
import LoginHandler from './util/LoginHandler';
import AddUser from './components/AddUser';
import 'semantic-ui-css/semantic.min.css';

var util = require('./util/Util');
var user = util.user;
var url = util.endpoint;

class App extends Component {
  render() {
    return (
      <div>
        <Layout>
          <BrowserRouter>
            <div>
              <MenuExample />
              <Switch>
                <Route path="/Login" component={LoginHandler} exact />
                <PrivateRoute path="/" exact component={RequestOwnership} />
                <PrivateRoute path="/AddUser" exact component={AddUser} />
                <Route component={Error} />
              </Switch>
            </div>
          </BrowserRouter>
        </Layout>
      </div>
    );
  }
}

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    user.isAuthenticated === true
      ? <Component {...props} />
      : <Redirect to='/Login' />
  )} />
);


export default App;
