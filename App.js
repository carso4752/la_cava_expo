/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import Colors from './app/theme/colors';
import FirebaseConfig from './app/modulos/Database/Firebase';
import * as Firebase from 'firebase';
import Navegacion from './app/modulos/Navegacion/Nav'

Firebase.initializeApp(FirebaseConfig);
export default class App extends Component {

  render(){
    return <View style={styles.container}>
      <StatusBar backgroundColor="#000" barStyle='light-content' />
      <Navegacion />
    </View>
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1
  }
});
