import React, { Component } from 'react';
import { Platform, TouchableNativeFeedback, TouchableOpacity } from 'react-native';

export default class TouchableNative extends Component {
  
  setNativeProps = (nativeProps) => {
    this._root.setNativeProps(nativeProps);
  }

  render() {
    if(Platform.OS === 'android') {
      return (
      <TouchableNativeFeedback disabled={this.props.disabled} onPress={this.props.onPress}>
        {this.props.children}
      </TouchableNativeFeedback>);
    }
    else {
      return (
      <TouchableOpacity disabled={this.props.disabled} onPress={this.props.onPress}>
        {this.props.children}
      </TouchableOpacity>);
    }
  }
}
