/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React, {Component} from 'react';
import {StyleSheet, View, StatusBar} from 'react-native';
import FirebaseConfig from './app/modulos/Database/Firebase';
import * as Firebase from 'firebase';
import {NavegacionAuth} from './app/modulos/Navegacion/Nav';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './app/modulos/Navegacion/RootNavigation';

import {Provider, inject, observer} from 'mobx-react';
import store from './app/modulos/Store';

console.disableYellowBox = true;
Firebase.initializeApp(FirebaseConfig);
export default class App extends Component {
  
  render() {
    return (
      <Provider store={store}>
        <View style={styles.container}>
          <StatusBar backgroundColor="#fff" barStyle="dark-content" />
          <NavigationContainer ref={navigationRef}>
            <NavegacionAuth />
          </NavigationContainer>
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
