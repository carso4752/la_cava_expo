import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Picker, TextInput } from 'react-native';
import { ListItem, Icon, Input, Overlay, Button } from 'react-native-elements';
import normalize from 'react-native-normalize';
import { getShop, setShop } from './shop.utils';
import Colors from '../../theme/colors';
import * as Location from 'expo-location';
import * as Permission from 'expo-permissions';
import MapView, { Marker } from 'react-native-maps';
import { inject, observer } from "mobx-react";
import { firebaseApp } from '../Database/Firebase'
import * as firebase from 'firebase';
import 'firebase/firestore'

var db = null

class Shop extends Component {
  
    state = {
        compras: [],
        mapVisible: false,
        location: null,
        marker: null,
        medioPago: "credit-card",
        confirmLocation: false,
        observaciones: null,
        cargando: false
    }
    total = 0

    componentDidMount(){
        this.cargarProductos();
        const unsubscribe = this.props.navigation.addListener('focus', async () => {
            this.cargarProductos();
        });
        db = firebase.firestore(firebaseApp);
    }

    registrarCompra = () => {
        const { observaciones, compras, marker, medioPago } = this.state
        let user = firebase.auth().currentUser
        index = user.providerData.length - 1;
        let data = {...user.providerData[index]};

        db.collection('tbl_pedidos').add({
            ped_estado: false,
            ped_estado_pago: 4,
            ped_fecha: new Date(),
            ped_observaciones: observaciones,
            ped_productos: compras,
            ped_tipo_pago: medioPago,
            ped_ubicacion: marker,
            ped_usuario: data.email,
            ped_valor: this.total

        }).then((docRef)=>{
            this.renderLimpiar();
        }).catch((err)=>{
            console.error("Error compra", err);
            this.renderLimpiar();
        })
    }

    renderLimpiar = async() =>{
        const { setShopBadge } = this.props.store
        this.setState({ compras: [],
            location: null,
            marker: null,
            medioPago: "credit-card",
            confirmLocation: false,
            observaciones: null,
            cargando: false 
        });
        await setShop([]);
        setShopBadge(0)
        
    }

    cargarProductos = async() =>{
        const items = await getShop();
        this.setState({ compras: items })
    }

    eliminarProducto = async(item) =>{
        const { setShopBadge } = this.props.store
        var data = await getShop();
        let index = data.findIndex(e => e.prod_imagen == item.prod_imagen)
        data.splice(index, 1)
        await setShop(data);
        setShopBadge(data.length)
    }

    renderResultados() {
        const {compras} = this.state;
        this.total = compras.length == 0 ? 0 : 1800;
        return <>
            {compras.length == 0 ? <View style={styles.result}>
                    <View style={{ marginTop: normalize(10, 'height'), marginBottom: normalize(3, 'height') }} >
                        <Icon
                            type="material-community"
                            name="cart-arrow-down"
                            size={normalize(80)}
                            color={'grey'}
                        />
                    </View>
                    <Text style={{textAlign: 'center', fontSize: normalize(18)}}>Agrega productos al carrito</Text>
                </View> :
                <ScrollView>
                <Text style={{ color: 'grey', fontSize: normalize(15), marginTop: normalize(15, 'height'), marginLeft: normalize(15) }}>Domicilio: $1.800</Text>
                {compras.map((item, index) => {
                    this.total = this.total + item.prod_costo * item.prod_cantidad;
                    let costo = '$' + (item.prod_costo * item.prod_cantidad).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                    return <ListItem
                        key={index}
                        titleStyle={{fontSize: normalize(15)}}
                        title={item.prod_nombre + ' X ' + item.prod_cantidad}
                        subtitle={costo}
                        leftAvatar={{
                            title: item.prod_nombre[0],
                            size: 'medium',
                            source: {uri: item.prod_url},
                            overlayContainerStyle: {backgroundColor: 'white'},
                            imageProps: {resizeMode: 'contain'}
                         }}
                        rightIcon={
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <View style={styles.cantidad}>
                                    <Icon
                                        reverse
                                        name="minus"
                                        type="material-community"
                                        color={Colors.accent}
                                        size={normalize(12)}
                                        onPress={() => {
                                            let restar = compras;
                                            restar[index].prod_cantidad = item.prod_cantidad == 1 ? 1 : item.prod_cantidad - 1;
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
                })}
                </ScrollView>
            }
            {compras.length > 0 && this.renderOpciones() }
            <View style={styles.total}>
                <Text style={{fontSize: normalize(25), color: '#fff'}}>TOTAL</Text>
                <Text style={{fontSize: normalize(22), color: '#fff'}}>$ {this.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</Text>
            </View>
        </>
    }

    renderOpciones = () => {
        const { mapVisible, medioPago, compras, observaciones, confirmLocation } = this.state
        let pago = null
        let obs = observaciones ? observaciones.substring(0,35) + '...' : null
        if (medioPago == "credit-card"){ pago = "PAGAR" }
        else { pago = "PEDIR" }
        return <>
            <View style={{ marginVertical: 10 }}>
                <Input
                    disabled={true}
                    value={obs}
                    inputStyle={{ fontSize: normalize(18) }}
                    containerStyle={{ marginBottom: normalize(10, 'height') }}
                    inputContainerStyle={{ borderBottomWidth: 0 }}
                    placeholder={'Ubicación'}
                    placeholderTextColor={Colors.primaryText}
                    rightIconContainerStyle={{ paddingRight: normalize(15) }}
                    rightIcon={
                        <Icon 
                            type='material-community'
                            name='map-marker-radius'
                            color={confirmLocation ? Colors.primaryButton : 'grey'}
                            size={normalize(25)}
                            onPress={async()=>{
                                const permisoLocation = await Permission.askAsync(Permission.LOCATION);
                                const estadoPermiso = permisoLocation.permissions.location.status;
                                if(estadoPermiso === "denied"){
                                    Alert.alert("Permiso denegado", "Se deben conceder los permisos necesarios para acceder a la ubucación del dispositivo")
                                } else {
                                    const loc = await Location.getCurrentPositionAsync({});
                                    let position = {
                                        "latitude": loc.coords.latitude,
                                        "longitude": loc.coords.longitude,
                                    }
                                    this.setState({ mapVisible: !mapVisible, location: position, marker: position })
                                }
                            }}
                        />
                    }
                />
                <View style={{ marginBottom: normalize(15, 'height'), flexDirection: 'row', justifyContent:'flex-start' }}>
                    <Text style={{ marginLeft: 10, fontSize: normalize(18) }}>Medio de pago:</Text>
                    <Picker
                        selectedValue={medioPago}
                        style={{ height: normalize(25, 'height'), width: normalize (240) }}
                        onValueChange={(itemValue) => this.setState({ medioPago: itemValue })}
                    >
                        <Picker.Item label="Tarjeta" value="credit-card" />
                        <Picker.Item label="Efectivo" value="money" />
                        <Picker.Item label="QR" value="qrcode" />
                    </Picker>
                </View>
            </View>
            <Button 
                buttonStyle={{ backgroundColor: Colors.primaryButton }}
                titleStyle={{ fontSize: normalize(20) }}
                title={pago}
                icon={
                    <Icon
                        type='font-awesome'
                        name={medioPago}
                        size={normalize(20)}
                        color="white"
                        iconStyle={{ marginRight: 5 }}
                    />
                }
                onPress={()=>{
                    this.registrarCompra();
                    this.props.navigation.navigate('PayU', {
                        screen: 'PayU',
                        params: {pedido: compras},
                      });
                }} 
            />
        </>
    }

    onMapPress = (e) => {
        this.setState({ marker: e.nativeEvent.coordinate });
    }
    
    renderMap = () =>{
        const { mapVisible, location, marker, observaciones } = this.state
        return <Overlay
            isVisible={mapVisible}
            windowBackgroundColor='rgba(218,218,218, 0.8)'
            overlayStyle={styles.modal}
            containerStyle={{ borderColor: 'red' }}
            onBackdropPress={() => {
                this.setState({ mapVisible: !mapVisible })
            }}>
            <View>
                <Text style={{ textAlign: 'center', color:'grey' }}>LA DIRECCIÓN ES OBTENIDA DESDE UBICACIÓN ACTUAL DEL DISPOSITIVO</Text>
                { location &&
                    <MapView
                        ref="map"
                        showsUserLocation
                        style={styles.map}
                        onPress={this.onMapPress.bind(this)}
                        mapType="standard"
                        showsTraffic={true}
                        initialRegion={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                            latitudeDelta: 0.002, 
                            longitudeDelta: 0.002
                        }}>
                        <Marker
                            coordinate={{
                                latitude: marker.latitude,
                                longitude: marker.longitude
                            }}/>                     
                    </MapView>
                }
                <Input
                    label={'Observaciones:'}
                    maxLength={100}
                    multiline={true}
                    numberOfLines={3}
                    value={observaciones}
                    onChangeText={(text) => {
                        this.setState({ observaciones: text })
                    }}
                    inputStyle={{ height: normalize(65, 'height') }}
                    inputContainerStyle={{ borderBottomWidth: 0 }}
                />
            </View>
            <Button 
                buttonStyle={{ backgroundColor: Colors.primaryButton, marginTop: normalize(20, 'height') }}
                titleStyle={{ fontSize: normalize(20) }}
                title={'Confirmar Ubicación'}
                onPress={()=>{
                    if(location === marker){
                        this.setState({ confirmLocation: true, mapVisible: !mapVisible  })
                    } else {
                        Alert.alert("Nueva Ubicación",
                            "¿Esta seguro de recibir su pedido en la nueva ubicación seleccionada?",
                            [
                              { text: "Cancelar", onPress: () => this.setState({ marker: location })},
                              { text: "Si", onPress: () => this.setState({ confirmLocation: true, mapVisible: !mapVisible  }) }
                            ],
                            { cancelable: false }
                          );
                    }
                }} 
            />
        </Overlay>
    }

    render() {    
        return <View style={styles.container}>
            {this.renderResultados()}
            {this.renderMap()}
        </View>
    }
}

export default inject('store')(observer(Shop));

const styles = StyleSheet.create({
    container:{
        flex: 1, 
        backgroundColor:'white'
    },
    result:{
        flex: 1,
        marginTop: normalize(15, 'height'), 
        paddingHorizontal: normalize(15),
        justifyContent:'center'
    },
    total:{
        justifyContent:'space-between',
        flexDirection:'row',
        backgroundColor: Colors.primary,
        paddingHorizontal: normalize(15),
        paddingVertical: normalize(5, 'height')
    },
    modal:{
        height:'auto',
        width: normalize(350)        
    },
    cantidad: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    map:{
        height: normalize(350, 'height'),
        marginVertical: normalize(15)
    }
})