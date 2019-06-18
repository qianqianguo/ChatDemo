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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

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
    const { username, password, email } = this.state;
    if(username === ''||password === ''||email === ''){
      alert('请填写信息');
      return;
    }
    this.props.dispatchCreateUser(username, password, email)
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
        <KeyboardAwareScrollView contentContainerStyle={{
          height: Dimensions.get('window').height - 84,
          width: Dimensions.get('window').width}}
                    bounces={false}
                    extraScrollHeight={15}>
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
                  placeholder="用户名"
                  type='username'
                  onChangeText={this.onChangeText}
              />
              <Input
                  value={this.state.password}
                  placeholder="密码"
                  secureTextEntry
                  type='password'
                  onChangeText={this.onChangeText}
              />
              <Input
                  value={this.state.email}
                  placeholder="邮箱"
                  type='email'
                  onChangeText={this.onChangeText}
              />
            </View>
            <Button
                title='注册'
                onPress={this.signUp.bind(this)}
                isLoading={isAuthenticating}
            />
            <Text style={[styles.errorMessage, signUpError && { color: 'black' }]}>注册失败：{signUpErrorMessage}</Text>
          </View>
        </KeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = {
  dispatchConfirmUser: (username) => confirmUserSignUp(username),
  dispatchCreateUser: (username, password, email) => createUser(username, password, email)
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
