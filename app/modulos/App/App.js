import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { NavegacionTabs } from './../Navegacion/Nav'

export default App = (props) => {
  return <View style={styles.container}>
    <StatusBar hidden={true} />
    <NavegacionTabs {...props} />
  </View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
