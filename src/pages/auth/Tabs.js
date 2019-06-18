import React from 'react'
import { Image, StyleSheet } from 'react-native'
import { createAppContainer, createBottomTabNavigator } from 'react-navigation'

import { colors, fonts } from '../../theme'
import SignIn from './SignIn'
import SignUp from './SignUp'

const styles = StyleSheet.create({
  icon: {
    width: 26,
    height: 26
  }
});

const routes = {
  SignIn: {
    screen: SignIn,
    navigationOptions: {
      title: '登录',
      tabBarIcon: ({ tintColor }) => (
        <Image
          source={require('../../assets/imgs/signInButton.png')}
          style={[styles.icon, { tintColor }]}
        />
      )
    }
  },
  SignUp: {
    screen: SignUp,
    navigationOptions: {
      title: '注册',
      tabBarIcon: ({ tintColor }) => (
        <Image
          source={require('../../assets/imgs/signUpButton.png')}
          style={[styles.icon, { tintColor }]}
        />
      )
    }
  },
};

const routeConfig = {
  tabBarPosition: 'bottom',
  tabBarOptions: {
    showLabel: true,
    activeTintColor: colors.primary,
    inactiveTintColor: colors.secondary,
    indicatorStyle: { backgroundColor: colors.secondary },
    labelStyle: {
      fontFamily: fonts.base,
      fontSize: 12
    },
    style: {
      backgroundColor: 'white',
      borderTopWidth: 0,
      paddingBottom: 3
    },
  }
};

const TabNavigator = createBottomTabNavigator(routes,routeConfig);

export default createAppContainer(TabNavigator);
