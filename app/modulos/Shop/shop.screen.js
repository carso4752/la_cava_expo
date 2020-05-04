import React, {Component} from 'react';
import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
import {ListItem, Icon, Input, Overlay, Button} from 'react-native-elements';
import normalize from 'react-native-normalize';
import {getShop, setShop} from './shop.utils';
import Colors from '../../theme/colors';
import * as Location from 'expo-location';
import * as Permission from 'expo-permissions';
import MapView from 'react-native-maps';
import {Marker} from 'react-native-maps';
import {inject, observer} from 'mobx-react';
import {WebView} from 'react-native-webview';

const desLatitude = 6.323032;
const desLongitude = -75.559653;
const endLocation = `${desLatitude},${desLongitude}`;
const GOOGLE_API_KEY = 'AIzaSyDksKJmn8PnAW5lXEQm2UZwf8GIkX8QrVQ';

class Shop extends Component {
  state = {
    compras: [],
    region: null,
    mapVisible: false,
    location: null,
    payuVisible: false,
  };

  componentDidMount() {
    this.cargarProductos();
    const unsubscribe = this.props.navigation.addListener('focus', async () => {
      this.cargarProductos();
    });
  }

  cargarProductos = async () => {
    const items = await getShop();
    this.setState({compras: items});
  };

  eliminarProducto = async (item) => {
    const {setShopBadge} = this.props.store;
    var data = await getShop();
    let index = data.findIndex((e) => e.prod_imagen == item.prod_imagen);
    data.splice(index, 1);
    await setShop(data);
    setShopBadge(data.length);
  };

  renderResultados() {
    const {compras, direccion, mapVisible, payuVisible} = this.state;
    let total = 0;
    return (
      <>
        {compras.length == 0 ? (
          <View style={styles.result}>
            <View
              style={{
                marginTop: normalize(10, 'height'),
                marginBottom: normalize(3, 'height'),
              }}
            >
              <Icon
                type="material-community"
                name="cart-arrow-down"
                size={normalize(80)}
                color={'grey'}
              />
            </View>
            <Text style={{textAlign: 'center', fontSize: normalize(18)}}>
              Agrega productos al carrito
            </Text>
          </View>
        ) : (
          <ScrollView>
            {compras.map((item, index) => {
              total = total + item.prod_costo * item.prod_cantidad;
              let costo =
                '$' +
                (item.prod_costo * item.prod_cantidad)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
              return (
                <ListItem
                  key={index}
                  titleStyle={{fontSize: normalize(15)}}
                  title={item.prod_nombre + ' X ' + item.prod_cantidad}
                  subtitle={costo}
                  leftAvatar={{
                    title: item.prod_nombre[0],
                    size: 'medium',
                    source: {uri: item.prod_url},
                    overlayContainerStyle: {backgroundColor: 'white'},
                    imageProps: {resizeMode: 'contain'},
                  }}
                  rightIcon={
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <View style={styles.cantidad}>
                        <Icon
                          reverse
                          name="minus"
                          type="material-community"
                          color={Colors.accent}
                          size={normalize(12)}
                          onPress={() => {
                            let restar = compras;
                            restar[index].prod_cantidad =
                              item.prod_cantidad == 1
                                ? 1
                                : item.prod_cantidad - 1;
                            this.setState({compras: restar});
                          }}
                        />
                        <Icon
                          reverse
                          name="plus"
                          type="material-community"
                          color={Colors.primaryButton}
                          size={normalize(12)}
                          onPress={() => {
                            let sumar = compras;
                            sumar[index].prod_cantidad = item.prod_cantidad + 1;
                            this.setState({compras: sumar});
                          }}
                        />
                      </View>
                      <Icon
                        type="material-community"
                        name="trash-can-outline"
                        size={normalize(32)}
                        onPress={async () => {
                          await this.eliminarProducto(item);
                          this.cargarProductos();
                        }}
                      />
                    </View>
                  }
                />
              );
            })}
          </ScrollView>
        )}
        {compras.length > 0 && (
          <View style={{margin: 10}}>
            <Input
              placeholder="Dirrección"
              value={direccion}
              rightIconContainerStyle={{paddingRight: normalize(15)}}
              rightIcon={
                <Icon
                  type="material-community"
                  name="map-marker-radius"
                  color="grey"
                  size={normalize(25)}
                  onPress={async () => {
                    const permisoLocation = await Permission.askAsync(
                      Permission.LOCATION
                    );
                    const estadoPermiso =
                      permisoLocation.permissions.location.status;
                    if (estadoPermiso === 'denied') {
                      Alert.alert(
                        'Permiso denegado',
                        'Se deben conceder los permisos necesarios para acceder a la ubucación del dispositivo'
                      );
                    } else {
                      const loc = await Location.getCurrentPositionAsync({});
                      this.setState({
                        mapVisible: !mapVisible,
                        location: loc.coords,
                      });
                    }
                  }}
                />
              }
            />
            <Button
              title={'Pagar'}
              onPress={() => {
                this.setState({payuVisible: !payuVisible});
              }}
            />
          </View>
        )}
        <View style={styles.total}>
          <Text style={{fontSize: normalize(25), color: '#fff'}}>TOTAL</Text>
          <Text style={{fontSize: normalize(22), color: '#fff'}}>
            $ {total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
          </Text>
        </View>
      </>
    );
  }

  // renderDistancia = async(location) =>{
  //     const startLocation = `${location.latitude},${location.longitude}`;
  //     const URL = (`https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=${endLocation}&origin=${startLocation}`);
  //     Linking.openURL(URL)
  // }

  renderHTML = () => {
    const {compras} = this.state;
    let html = "<ul style='list-style:none'><h1 style='text-align:center; font-size: 48px'>Confirmación de pedido</h1>";
    let total = 0;
    for (let index = 0; index < compras.length; index++) {
      const item = compras[index];
      total = total + item.prod_costo * item.prod_cantidad;
      let costo =
        '$' +
        (item.prod_costo * item.prod_cantidad)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      html += `
                <li style="display: flex; margin-top: 5px; margin-bottom: 15px">
                    <img src="${item.prod_url}" width="300px">
                    <div style="margin-left: 15px">
                        <p style="font-size: 40px; margin-bottom: 0px">
                            ${item.prod_nombre + ' X ' + item.prod_cantidad}
                        </p>
                        <p style="font-size: 40px; margin-top: -3px">
                            ${costo}
                        </p>
                    </div>
                </li> 
            `;
    }

    html += `</ul> <form method="post" action="https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/">
            <input name="merchantId"    type="hidden"  value="508029"   >
            <input name="accountId"     type="hidden"  value="512321" >
            <input name="description"   type="hidden"  value="Test PAYU"  >
            <input name="referenceCode" type="hidden"  value="TestPayULaCava" >
            <input name="amount"        type="hidden"  value="${total}"   >
            <input name="tax"           type="hidden"  value="3193"  >
            <input name="taxReturnBase" type="hidden"  value="16806" >
            <input name="currency"      type="hidden"  value="COP" >
            <input name="signature"     type="hidden"  value="6928fa98ccf437c507699f6332d3be02"  >
            <input name="test"          type="hidden"  value="1" >
            <input name="buyerEmail"    type="hidden"  value="test@test.com" >
            <input name="responseUrl"    type="hidden"  value="http://www.test.com/response" >
            <input name="confirmationUrl"    type="hidden"  value="http://www.test.com/confirmation" >
            <input name="Submit" style="background: #17A589;
            width: 100%;
            height: 130px;
            border: 0;
            border-radius: 15px;
            color: #fff;
            font-size: 42px;" type="submit" value="Enviar pedido">
        </form>`;
    return html;
  };

  renderpago = () => {
    const {payuVisible} = this.state;
    const html = this.renderHTML();
    return (
      <Overlay
        isVisible={payuVisible}
        windowBackgroundColor="rgba(218,218,218, 0.8)"
        overlayBackgroundColor="transparent"
        overlayStyle={styles.modalPago}
        onBackdropPress={() => {
          this.setState({payuVisible: !payuVisible});
        }}
      >
        <WebView
          textZoom={100}
          containerStyle={{width: '100%', flex: 1}}
          source={{
            html,
          }}
        />
      </Overlay>
    );
  };

  renderMap = () => {
    const {mapVisible, location} = this.state;
    return (
      <Overlay
        isVisible={mapVisible}
        windowBackgroundColor="rgba(218,218,218, 0.8)"
        overlayBackgroundColor="transparent"
        overlayStyle={styles.modal}
        onBackdropPress={() => {
          this.setState({mapVisible: !mapVisible});
        }}
      >
        <View>
          {location && (
            <MapView
              showsUserLocation
              style={styles.map}
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.002,
                longitudeDelta: 0.002,
              }}
            ></MapView>
          )}
        </View>
      </Overlay>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        {this.renderResultados()}
        {this.renderMap()}
        {this.renderpago()}
      </View>
    );
  }
}

export default inject('store')(observer(Shop));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  result: {
    flex: 1,
    marginTop: normalize(15, 'height'),
    paddingHorizontal: normalize(15),
    justifyContent: 'center',
  },
  total: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingHorizontal: normalize(15),
    paddingVertical: normalize(5, 'height'),
  },
  modal: {
    height: 'auto',
    width: normalize(350),
    backgroundColor: '#fff',
  },
  modalPago: {
    height: normalize(500, 'height'),
    width: normalize(350),
    backgroundColor: '#fff',
  },
  cantidad: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  map: {
    height: normalize(500, 'height'),
  },
});
