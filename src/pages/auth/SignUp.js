import React, { Component } from 'react';
import {
  Platform,
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Modal, Dimensions
} from 'react-native';

import { connect } from 'react-redux'

import { fonts, colors } from '../../theme'
import { createUser, confirmUserSignUp } from '../../actions/auth'

import Input from '../../components/Input'
import Button from '../../components/Button'

const initialState = {
  username: '',
  password: '',
  email: '',
  phone_number: '',
  authCode: ''
};

class SignUp extends Component<{}> {
  state = initialState;

  onChangeText = (key, value) => {
    this.setState({
      [key]: value
    })
  };

  signUp() {
    const { username, password, email, phone_number } = this.state;
    this.props.dispatchCreateUser(username, password, email, phone_number)
  }

  confirm() {
    const { authCode, username } = this.state;
    this.props.dispatchConfirmUser(username, authCode)
  }

  componentWillReceiveProps(nextProps) {
    const { auth: { showSignUpConfirmationModal }} = nextProps;
    if (!showSignUpConfirmationModal && this.props.auth.showSignUpConfirmationModal) {
      this.setState(initialState)
    }
  }

  render() {
    const { auth: {
      showSignUpConfirmationModal,
      isAuthenticating,
      signUpError,
      signUpErrorMessage
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
            <Text style={styles.greeting}>
              缘起,
            </Text>
            <Text style={styles.greeting2}>
              寻找您的爱情起源，从此处开始
            </Text>
            <View style={styles.inputContainer}>
              <Input
                  value={this.state.username}
                  placeholder="手机号"
                  type='telephoneNumber'
                  onChangeText={this.onChangeText}
              />
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <TextInput
                    value={this.state.email}
                    placeholder="验证码"
                    type='email'
                    onChangeText={this.onChangeText}
                    autoCapitalize='none'
                    autoCorrect={false}
                    style={{
                      flex: 1,
                      height: 45,
                      marginBottom: 15,
                      borderBottomWidth: 1,
                      fontSize: 16,
                      borderBottomColor: colors.primary,
                      fontFamily: fonts.light
                    }}
                    placeholderTextColor="#a0a0a0"
                    underlineColorAndroid='transparent'
                />
                <TouchableOpacity style={{backgroundColor: 'red', borderRadius: 5, marginLeft: 10}}>
                  <Text style={{margin: 8, color: '#fff'}}>获取验证码</Text>
                </TouchableOpacity>
              </View>
              <Input
                  value={this.state.password}
                  placeholder="密码"
                  secureTextEntry
                  type='password'
                  onChangeText={this.onChangeText}
              />
            </View>
            <Button
                title='注册'
                onPress={this.signUp.bind(this)}
                isLoading={isAuthenticating}
            />
            <Text style={[styles.errorMessage, signUpError && { color: 'black' }]}>Error logging in. Please try again.</Text>
            <Text style={[styles.errorMessage, signUpError && { color: 'black' }]}>{signUpErrorMessage}</Text>
            {
              showSignUpConfirmationModal && (
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

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = {
  dispatchConfirmUser: (username, authCode) => confirmUserSignUp(username, authCode),
  dispatchCreateUser: (username, password, email, phone_number) => createUser(username, password, email, phone_number)
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp)

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
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
    fontFamily: fonts.light,
    fontSize: 24,
    color: 'red'
  },
  greeting2: {
    fontFamily: fonts.light,
    color: '#888',
    fontSize: 15,
    marginTop: 5
  },
  heading: {
    flexDirection: 'row'
  },
  headingImage: {
    width: 38,
    height: 38
  },
  errorMessage: {
    fontFamily: fonts.base,
    fontSize: 12,
    marginTop: 10,
    color: 'transparent'
  }
});
