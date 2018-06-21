import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { AUTH_TOKEN } from '../constants';

class Login extends Component {
  state = {
    login: true, // switch between Login and SignUp
    email: '',
    password: '',
    name: ''
  };

  render() {
    return (
      <div>
        <h4 className="mv3">{this.state.login ? 'Login' : 'Sign Up'}</h4>
        <div className="flex flex-column">
          {!this.state.login && (
            <input
              value={this.state.name}
              onChange={(e) => this.setState({ name: e.target.value })}
              type="text"
              placeholder="Your name"
            />
          )}
          <input
            value={this.state.email}
            onChange={(e) => this.setState({ email: e.target.value })}
            type="text"
            placeholder="Your email address"
          />
          <input
            value={this.state.password}
            onChange={(e) => this.setState({ password: e.target.value })}
            type="password"
            placeholder="Choose a safe password"
          />
        </div>
        <div className="flex mt3">
          <div className="pointer mr2 button" onClick={() => this._confirm()}>
            {this.state.login ? 'login' : 'create account'}
          </div>
          <div
            className="pointer button"
            onClick={() => this.setState({ login: !this.state.login })}>
            {this.state.login ? 'need to create an account?' : 'already have an account?'}
          </div>
        </div>
      </div>
    );
  }

  _confirm = async () => {
    const { name, email, password } = this.state;

    this.state.login
      ? await this.loginUser(email, password)
      : await this.signUpUser(email, password, name);

    this.props.history.push('/');
  };

  loginUser = async (email, password) => {
    const result = await this.props.loginMutation({
      variables: {
        email,
        password
      }
    });

    const { token } = result.data.login;

    this._saveUserData(token);
  };

  signUpUser = async (email, password, name) => {
    console.log({ name, email, password });
    const result = await this.props.signUpMutation({
      variables: {
        name,
        email,
        password
      }
    });

    const { token } = result.data.signup;

    this._saveUserData(token);
  };

  _saveUserData = (token) => {
    localStorage.setItem(AUTH_TOKEN, token);
  };
}

const SIGN_UP_MUTATION = gql`
  mutation SignUpMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

export default compose(
  graphql(SIGN_UP_MUTATION, { name: 'signUpMutation' }),
  graphql(LOGIN_MUTATION, { name: 'loginMutation' })
)(Login);
