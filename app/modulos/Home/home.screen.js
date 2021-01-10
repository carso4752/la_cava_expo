import React, {Component} from 'react';
import {View, StyleSheet, ScrollView, Dimensions} from 'react-native';
import {Text, Image} from 'react-native-elements';
import {SliderBox} from '../shared/react-native-image-slider-box';
import normalize from 'react-native-normalize';
import * as firebase from 'firebase';
import TouchableNative from '../shared/touchableNative';
import Colors from '../../theme/colors';
import {ActivityIndicator} from 'react-native-paper';
import {getShop} from './../Shop/shop.utils';
import {inject, observer} from 'mobx-react';


import Subscribe from './../Notificaciones/subscribe.screen';


const DeviceWidth = Dimensions.get('screen').width;

class Home extends Component {
  constructor() {
    super();

    this.state = {
        banners: [],
    };
  }

  componentDidMount() {
    const {setShopBadge} = this.props.store;
    let user = firebase.auth().currentUser;
    getShop(user.uid).then((data) => {
        setShopBadge(data.length);
    });
    firebase
      .storage()
      .ref('banner')
      .list()
      .then((result) => {
        result.items.forEach((ref) => {
          this.cargarImagenes(ref.fullPath);
        });
      });
  }

  cargarImagenes = (ref) => {
    const {banners} = this.state;
    let data = banners;
    firebase
      .storage()
      .ref(`${ref}`)
      .getDownloadURL()
      .then((url) => {
        data.push(url);
        this.setState({banners: data});
      });
  };

  render() {
    const {banners} = this.state;
    let ancho = DeviceWidth / 2 - normalize(10);
    if (banners.length == 0) {
      return (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator
            size="small"
            animating={true}
            color={Colors.primaryButton}
          />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Subscribe />
        <ScrollView>
          <SliderBox
            circleLoop
            sliderBoxHeight={normalize(160, 'height')}
            images={banners}
            dotColor={Colors.primary}
          />
          <View
            style={{
              paddingHorizontal: normalize(15),
              marginVertical: normalize(15, 'height'),
            }}
          >
            <Text
              style={{
                fontSize: normalize(20),
                color: 'white',
                borderBottomWidth: normalize(2, 'height'),
                borderColor: '#ccc',
              }}
            >
              Categorías
            </Text>
          </View>
          <View style={styles.categoria}>
            <TouchableNative
              onPress={() => {
                this.props.navigation.navigate('Productos', {
                  screen: 'Producto',
                  params: {categoria: 2},
                });
              }}
            >
              <Image
                source={require('../../assets/categorias/AGUARDIENTE.png')}
                style={{width: ancho, height: normalize(90, 'height')}}
                resizeMode="stretch"
              />
            </TouchableNative>
            <TouchableNative
              onPress={() => {
                this.props.navigation.navigate('Productos', {
                  screen: 'Producto',
                  params: {categoria: 1},
                });
              }}
            >
              <Image
                source={require('../../assets/categorias/CERVEZA.png')}
                style={{width: ancho, height: normalize(90, 'height')}}
                resizeMode="stretch"
              />
            </TouchableNative>
          </View>
          <View style={styles.categoria}>
            <TouchableNative
              onPress={() => {
                this.props.navigation.navigate('Productos', {
                  screen: 'Producto',
                  params: {categoria: 3},
                });
              }}
            >
              <Image
                source={require('../../assets/categorias/RON.png')}
                style={{width: ancho, height: normalize(90, 'height')}}
                resizeMode="stretch"
              />
            </TouchableNative>
            <TouchableNative
              onPress={() => {
                this.props.navigation.navigate('Productos', {
                  screen: 'Producto',
                  params: {categoria: 5},
                });
              }}
            >
              <Image
                source={require('../../assets/categorias/TEQUILA.png')}
                style={{width: ancho, height: normalize(90, 'height')}}
                resizeMode="stretch"
              />
            </TouchableNative>
          </View>
          <View style={styles.categoria}>
            <TouchableNative
              onPress={() => {
                this.props.navigation.navigate('Productos', {
                  screen: 'Producto',
                  params: {categoria: 6},
                });
              }}
            >
              <Image
                source={require('../../assets/categorias/WHISKY.png')}
                style={{width: ancho, height: normalize(90, 'height')}}
                resizeMode="stretch"
              />
            </TouchableNative>
            <TouchableNative
              onPress={() => {
                this.props.navigation.navigate('Productos', {
                  screen: 'Producto',
                  params: {categoria: 7},
                });
              }}
            >
              <Image
                source={require('../../assets/categorias/VODKA.png')}
                style={{width: ancho, height: normalize(90, 'height')}}
                resizeMode="stretch"
              />
            </TouchableNative>
          </View>
          <View style={styles.categoria}>
            <TouchableNative
              onPress={() => {
                this.props.navigation.navigate('Productos', {
                  screen: 'Producto',
                  params: {categoria: 4},
                });
              }}
            >
              <Image
                source={require('../../assets/categorias/VINO.png')}
                style={{width: ancho, height: normalize(90, 'height')}}
                resizeMode="stretch"
              />
            </TouchableNative>
            <TouchableNative
              onPress={() => {
                this.props.navigation.navigate('Productos', {
                  screen: 'Producto',
                  params: {categoria: 12},
                });
              }}
            >
              <Image
                source={require('../../assets/categorias/OTROS.png')}
                style={{width: ancho, height: normalize(90, 'height')}}
                resizeMode="stretch"
              />
            </TouchableNative>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default inject('store')(observer(Home));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  categoria: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: normalize(3, 'height'),
  },
});

