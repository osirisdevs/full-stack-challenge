import React, { Component } from 'react';
import Form from 'react-jsonschema-form';
import { login } from '../actions';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

class Login extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit({ formData }) {
    this.props.login(formData);
  }

  render() {
    return (this.props.authenticated) ?
      <Redirect to={'/home'} />
      :
      <div className="container">
        <div className="row">
          <div className="col-xs-8 col-xs-offset-2">
            <Form
              onSubmit={this.onSubmit}
              schema={{
                type: 'object',
                title: 'LOGIN',
                properties: {
                  username: {
                    type: 'string',
                    title: 'Username'
                  },
                  password: {
                    type: 'string',
                    title: 'Password'
                  }
                },
                required: ['username', 'password']
              }}
              uiSchema={{
                'ui:order': ['username', 'password'],
                'password': {
                  'ui:widget': 'password'
                }
              }}
            />
          </div>
        </div>
      </div>
  }
}

const mapStateToProps = state => ({
  authenticated: !!state.auth.token,
});

export default connect(mapStateToProps, {
  login,
})(Login);
