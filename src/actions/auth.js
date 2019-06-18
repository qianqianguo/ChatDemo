import {
  LOG_IN,
  LOG_IN_SUCCESS,
  LOG_IN_FAILURE,
  LOG_OUT,
  SIGN_UP,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILURE,
  SHOW_SIGN_IN_CONFIRMATION_MODAL,
  SHOW_SIGN_UP_CONFIRMATION_MODAL,
  CONFIRM_SIGNUP,
  CONFIRM_SIGNUP_SUCCESS,
  CONFIRM_SIGNUP_FAILURE,
  CONFIRM_LOGIN,
  CONFIRM_LOGIN_SUCCESS,
  CONFIRM_LOGIN_FAILURE
} from '../reducers/auth';
import Http from '../util/HttpUtil';
import { Alert } from 'react-native';
import AV from "leancloud-storage";

function signUp() {
  return {
    type: SIGN_UP
  }
}

function signUpSuccess(user) {
  return {
    type: SIGN_UP_SUCCESS,
    user
  }
}

function signUpFailure(err) {
  return {
    type: SIGN_UP_FAILURE,
    error: err
  }
}

export function createUser(username, password, email) {
  return (dispatch) => {
    dispatch(signUp());

    const user = new AV.User();
    user.setUsername(username);
    user.setPassword(password);
    user.setEmail(email);
    user.signUp().then(function (loginedUser) {
      // 注册成功
      alert('注册成功,请登录');
      dispatch(signUpSuccess(loginedUser));
    }, (function (error) {
      alert(JSON.stringify(error));
      dispatch(signUpFailure(error))
    }));
  }
}

function logIn() {
  return {
    type: LOG_IN
  }
}

export function logOut() {
  return {
    type: LOG_OUT
  }
}

function logInSuccess(user) {
  return {
    type: LOG_IN_SUCCESS,
    user: user
  }
}

function logInFailure(err) {
  return {
    type: LOG_IN_FAILURE,
    error: err
  }
}

export function authenticate(username, password) {
  return (dispatch) => {
    dispatch(logIn());
    AV.User.logIn(username, password).then(function (user) {
      // 登录成功
      dispatch(logInSuccess(user));
    }, function (error) {
      alert(JSON.stringify(error));
      dispatch(logInFailure(error))
    });
  }
}

export function showSignInConfirmationModal() {
  return {
    type: SHOW_SIGN_IN_CONFIRMATION_MODAL
  }
}

export function showSignUpConfirmationModal() {
  return {
    type: SHOW_SIGN_UP_CONFIRMATION_MODAL
  }
}

export function confirmUserLogin() {
  return (dispatch, getState) => {
    dispatch(confirmLogIn());
  }
}

function confirmLogIn() {
  return {
    type: CONFIRM_LOGIN
  }
}

function confirmLoginSuccess(user) {
  return {
    type: CONFIRM_LOGIN_SUCCESS,
    user
  }
}

function confirmLoginFailure() {
  return {
    type: CONFIRM_LOGIN_FAILURE,
    user
  }
}

export function confirmUserSignUp(username) {
  return (dispatch) => {
    dispatch(confirmSignUp());
    Http.post('',{username, authCode})
      .then(data => {
        console.log('data from confirmSignUp: ', data);
        dispatch(confirmSignUpSuccess());
        setTimeout(() => {
          Alert.alert('Successfully Signed Up!', 'Please Sign')
        }, 0)
      })
      .catch(err => {
        console.log('error signing up: ', err);
        dispatch(confirmSignUpFailure(err))
      });
  }
}

function confirmSignUp() {
  return {
    type: CONFIRM_SIGNUP
  }
}

function confirmSignUpSuccess() {
  return {
    type: CONFIRM_SIGNUP_SUCCESS
  }
}

function confirmSignUpFailure(error) {
  return {
    type: CONFIRM_SIGNUP_FAILURE,
    error
  }
}
