import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native'

import { fonts, colors } from '../theme'

export default ({ title, onPress, isLoading }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.button}>
      <Text style={[styles.buttonText]}>{title}</Text>
      {
        !isLoading && (
          <View style={styles.activityIndicator}>
            <ActivityIndicator color={'white'} />
          </View>
        )
      }
    </View>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  button: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    borderRadius: 21,
    height: 42
  },
  buttonText: {
    color: 'white',
    fontFamily: fonts.bold,
    fontSize: 18,
    letterSpacing: 0.5
  },
  activityIndicator: {
    transform: [{scale: 1}],
    marginTop: 0,
    marginLeft: 10
  }
})