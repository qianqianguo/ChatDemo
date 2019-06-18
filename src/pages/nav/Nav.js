import React from 'react'
import {createAppContainer, createStackNavigator} from 'react-navigation'

import Home from '../chat/Home'
import Chat from '../chat/Chat'
const routeConfig = {
  Home: { screen: Home },
  Chat: { screen: Chat }
};

const StackNav = createStackNavigator(routeConfig);
export default createAppContainer(StackNav);
