/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { NavegacionTabs } from './../Navegacion/Nav'

export default class App extends Component {
  render() {
    return <View style={styles.container}>
      <StatusBar backgroundColor="#000" barStyle='light-content' />
      <NavegacionTabs />
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
