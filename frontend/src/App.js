import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Home from './components/home/home';
import Login from './components/login';
import { loginAction } from './actions';
import { connect } from 'react-redux';

class App extends Component {
  componentWillMount() {
    // check if localStorage contains a token, if yes, set it in the redux state
    if (localStorage.token) {
      this.props.loginAction(localStorage.token);
    }
  }

  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/login" />} />
            <Route exact path="/login" component={Login} />
            <Route
              exact
              path="/home"
              render={(props) => <Home {...props}/>}
            />
            <Route render={() => <h3>Page Not Found</h3>} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default connect(null, {
  loginAction,
})(App);
