import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Badge} from 'react-native-elements';
import {inject, observer} from 'mobx-react';

const styles = StyleSheet.create({
  badge: {
    borderRadius: 9,
    height: 18,
    minWidth: 0,
    width: 18,
  },
  badgeContainer: {
    position: 'absolute',
  },
  badgeText: {
    fontSize: 10,
    paddingHorizontal: 0,
  },
});

class Badges extends React.Component {
  
  render() {
    const {
      top = -5,
      right = 0,
      left = 18,
      bottom = 0,
      hidden = !this.props.value,
      ...badgeProps
    } = this.props.options;

    const { shop, noty } = this.props.store;

    return (
      <View onPress={this.props.onPress}>
        {this.props.Icon}
        {!hidden && (
          <Badge
            badgeStyle={styles.badge}
            textStyle={styles.badgeText}
            value={this.props.value == 's' ? shop : noty}
            status="error"
            containerStyle={[styles.badgeContainer, {top, right, left, bottom}]}
            {...badgeProps}
          />
        )}
      </View>
    );
  }
}

export default inject('store')(observer(Badges));

