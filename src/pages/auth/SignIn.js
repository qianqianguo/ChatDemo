import React, { Component } from 'react';
import {
  Platform,
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
  Modal,
    Dimensions
} from 'react-native';

import { connect } from 'react-redux'

import { authenticate, confirmUserLogin } from '../../actions/auth'
import { fonts, colors } from '../../theme'

import Input from '../../components/Input'
import Button from '../../components/Button'

class SignIn extends Component<{}> {
  state = {
    username: '',
    password: '',
    accessCode: ''
  };
  
  onChangeText = (key, value) => {
    this.setState({
      [key]: value
    })
  };

  signIn() {
    const { username, password } = this.state;
    this.props.dispatchAuthenticate(username, password)
  }

  confirm() {
    const { authCode } = this.state;
    this.props.dispatchConfirmUserLogin(authCode)
  }
  
  render() {
    const { fontsLoaded } = this.state;
    const { auth: {
      signInErrorMessage,
      isAuthenticating,
      signInError,
      showSignInConfirmationModal
    }} = this.props;
    return (
        <ScrollView contentContainerStyle={{
          height: Dimensions.get('window').height - 84,
          width: Dimensions.get('window').width}}
                    bounces={false}>
          <View style={styles.container}>
            <View style={styles.heading}>
              <Image
                  source={require('../../assets/imgs/shape.png')}
                  style={styles.headingImage}
                  resizeMode="contain"
              />
            </View>
            <Text style={[styles.greeting]}>
              缘起
            </Text>
            <Text style={[styles.greeting2]}>
              未曾相逢先一笑，初会便已许平生
            </Text>
            <View style={styles.inputContainer}>
              <Input
                  placeholder="手机号"
                  type='telephoneNumber'
                  onChangeText={this.onChangeText}
                  value={this.state.username}
              />
              <Input
                  placeholder="密码"
                  type='password'
                  onChangeText={this.onChangeText}
                  value={this.state.password}
                  secureTextEntry
              />
            </View>

            <Button
                isLoading={isAuthenticating}
                title='登录'
                onPress={this.signIn.bind(this)}
            />
            <Text style={[styles.errorMessage, signInError && { color: 'black' }]}>登录失败. 请稍后尝试.</Text>
            <Text style={[styles.errorMessage, signInError && { color: 'black' }]}>{signInErrorMessage}</Text>
            {
              showSignInConfirmationModal && (
                  <Modal>
                    <View style={styles.modal}>
                      <Input
                          placeholder="Authorization Code"
                          type='authCode'
                          keyboardType='numeric'
                          onChangeText={this.onChangeText}
                          value={this.state.authCode}
                          keyboardType='numeric'
                      />
                      <Button
                          title='Confirm'
                          onPress={this.confirm.bind(this)}
                          isLoading={isAuthenticating}
                      />
                    </View>
                  </Modal>
              )
            }
          </View>
        </ScrollView>
    );
  }
}

const mapDispatchToProps = {
  dispatchConfirmUserLogin: authCode => confirmUserLogin(authCode),
  dispatchAuthenticate: (username, password) => authenticate(username, password)
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  heading: {
    flexDirection: 'row'
  },
  headingImage: {
    width: 38,
    height: 38
  },
  errorMessage: {
    fontSize: 12,
    marginTop: 10,
    color: 'transparent',
    fontFamily: fonts.base
  },
  inputContainer: {
    marginTop: 20
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 40
  },
  greeting: {
    marginTop: 20,
    fontSize: 24,
    color: 'red',
    fontFamily: fonts.light
  },
  greeting2: {
    color: '#888',
    fontSize: 15,
    marginTop: 5,
    fontFamily: fonts.light
  }
});
