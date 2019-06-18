/**
 * YuanQi App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StatusBar} from 'react-native';
import { connect } from 'react-redux';
import Tabs from './pages/auth/Tabs';
import Nav from './pages/nav/Nav';
// leanCloud存储服务
import AV from 'leancloud-storage';
const APP_ID = 'qWx4vmkO6sCi8SWJT43E0XLg-gzGzoHsz';
const APP_KEY = 'RLhGxOS11HwY6wEfXhmP8NJL';
// 初始化存储 SDK
AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});

type Props = {};
class App extends Component<Props> {
  state = {
    isLoginSuccess: false
  };
  componentDidMount() {
    const {isLoginSuccess} = this.props.auth;
    this.setState({isLoginSuccess: isLoginSuccess})
  }
  componentWillReceiveProps(nextProps) {
    const {isLoginSuccess} = nextProps.auth;
    this.setState({isLoginSuccess: isLoginSuccess})
  }
  render() {
    const {isLoginSuccess} = this.state;
    if (isLoginSuccess){
      return (<Nav />)
    }
    return (<Tabs />)
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(App);
