/**
 * YuanQi App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StatusBar, Text, View} from 'react-native';

import { connect } from 'react-redux';
import Tabs from './pages/auth/Tabs';
import Nav from './nav/Nav';

type Props = {};
class App extends Component<Props> {
  state = {
    user: {},
    isLoading: true
  };
  componentDidMount() {
    StatusBar.setHidden(true);
    this.setState({isLoading: false })
  }
  componentWillReceiveProps(nextProps) {

  }
  render() {
    if (this.state.isLoading) return null;
    let loggedIn = false;
    if (this.state.user.username) {loggedIn = true}
    if (loggedIn) {
      return (<Nav />)
    }
    return (<Tabs />)
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(App);
