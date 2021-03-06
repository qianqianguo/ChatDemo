import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  Animated,
  Dimensions
} from 'react-native'

import { connect } from 'react-redux'

import { logOut } from '../../actions/auth'
import { colors, fonts } from '../../theme'
import Input from "../../components/Input";
const { width } = Dimensions.get('window');

class Home extends React.Component {
  static navigationOptions = {
    header: null
  };
  state = {
    username: ''
  };
  AnimatedScale = new Animated.Value(1)
  componentDidMount() {
    this.animate()
  }
  logout() {
    this.props.dispatchLogout()
  }
  navigate() {
    this.props.navigation.navigate('Route1')
  }
  animate() {
    Animated.timing(
      this.AnimatedScale,
      {
        toValue: .8,
        duration: 1250,
        useNativeDriver: true
      }
    ).start(() => {
      Animated.timing(
        this.AnimatedScale,
        {
          toValue: 1,
          duration: 1250,
          useNativeDriver: true
        }
      ).start(() => this.animate())
    })
  }
  onChangeText = (key, value) => {
    this.setState({
      [key]: value
    })
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.homeContainer}>
          <Input
              placeholder="输入想要聊天的用户名"
              type='username'
              onChangeText={this.onChangeText}
              value={this.state.username}
          />
          <Text style={styles.welcome}
                onPress={() => this.props.navigation.navigate(
                    'Chat',
                    {
                      username: this.state.username
                    })}
          >开始聊天</Text>
          <Animated.Image
            source={require('../../assets/imgs/boomboxcropped.png')}
            style={{ tintColor: colors.primary, width: width / 2, height: width / 2, transform: [{scale: this.AnimatedScale}]}}
            resizeMode='contain'
          />
          <Text onPress={this.logout.bind(this)} style={styles.welcome}>退出登录</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  homeContainer: {
    alignItems: 'center'
  },
  welcome: {
    fontFamily: fonts.light,
    color: 'rgba(0, 0, 0, .85)',
    marginBottom: 26,
    fontSize: 22,
    textAlign: 'center'
  },
  registration: {
    fontFamily: fonts.base,
    color: 'rgba(0, 0, 0, .5)',
    marginTop: 20,
    fontSize: 16,
    paddingHorizontal: 20,
    textAlign: 'center'
  }
})

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = {
  dispatchLogout: () => logOut()
};

export default connect(mapStateToProps, mapDispatchToProps)(Home)