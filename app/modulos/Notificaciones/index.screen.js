import React, { Component } from 'react';
import { View, FlatList, Text, StyleSheet, ScrollView, Modal, Platform, Linking } from 'react-native';
import { Card, ListItem, Icon, Button, Input } from 'react-native-elements';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import normalize from 'react-native-normalize';
import { ActivityIndicator } from 'react-native-paper';
import Colors from '../../theme/colors';
import {getRol} from '../Shop/shop.utils';
import TouchableNative from '../shared/touchableNative';
import { setPedidos } from '../Shop/shop.utils';
import MapView, { Marker } from 'react-native-maps';
import Dialog from "react-native-dialog";
import { firebaseApp } from '../Database/Firebase';
import * as firebase from 'firebase';
import 'firebase/firestore';

var db = null

const CavaLatitude = 6.323032;
const CavaLongitude = -75.559653;

class Notificaciones extends Component {

  constructor() {
      super();
      this.state = {
          rol: null,
          cargando: true,
          visible: false,
          selected: null,
          total: 0,
          titulo: '',
          mensaje: '',
          visibleMensaje: false,
          type: null,
          observaciones: ''
      }    
  }

  async componentDidMount(){
      const {setNotyBadge, pedidos} = this.props.store;
      db = firebase.firestore(firebaseApp);
      let rol = await getRol();
      this.setState({ rol, cargando: false });
      setPedidos(pedidos);
      setNotyBadge(0);
  }
    
  estados = [
      {i: '1', est_pago_nombre: 'Pendiente', title: 'P', color: '#969692'},
      {i: '2', est_pago_nombre: 'Cancelado', title: 'C', color: '#E93D1E'},
      {i: '3', est_pago_nombre: 'Rechazado', title: 'R', color: '#E97D1E'},
      {i: '4', est_pago_nombre: 'Aceptado', title: 'A', color: '#8AE91E'},
      {i: '5', est_pago_nombre: 'Pago Rechazado', title: 'PR', color: '#A81EE9'},
      {i: '6', est_pago_nombre: 'Entregado', title: 'E', color: '#1EA5E9'},
    ];

    renderItems = ({item, index}) => {
      const { rol, visible } = this.state
      let fecha = moment(item.ped_fecha.toDate()).format('DD-MMMM-YYYY');
      let hora = moment(item.ped_fecha.toDate()).format('h:mm a');
      let estado = this.estados.find((e) => e.i == item.ped_estado_pago);
      let total = 1800
      let desface = estado.i == 5 ? 35 : 0
      {item.ped_productos.map((e)=>{
          total = total + (e.prod_costo * e.prod_cantidad)
      })}
      if(rol == 1){
          return <ListItem
              key={index}
              titleStyle={{ fontSize: normalize(15) }}
              title={'Pedido: ' + (item.id).toUpperCase()}
              subtitle={'Fecha - Hora: ' + moment(item.ped_fecha.toDate()).format('DD-MMMM-YYYY h:mm a')}
              rightIcon={
                <Icon type="material-community" name="cube-send" color={Colors.primary} size={normalize(25)} />
              }
              leftAvatar={{
                title: estado.title,
                overlayContainerStyle:{ backgroundColor: estado.color },
              }}
              onPress={()=>{
                this.setState({ visible: !visible, selected: item, total })
              }}
              bottomDivider
          /> 
      }
      return <TouchableNative onPress={()=>{
          this.setState({ visible: !visible, selected: item, total })
        }}>
        <Card
          containerStyle={{ backgroundColor: 'black' }}
          titleStyle={{ color:'white' }}
          title={'Pedido: ' + (item.id).toUpperCase()}
          imageStyle={{ height: normalize(40, 'height') }}
          imageProps={{ resizeMode:'stretch' }}
          image={require('../../assets/images/notificaciones2.png')}>
            <View>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginRight: normalize(10) }}>
                <Text style={{ color:'white'}}>Fecha: {fecha}</Text>
                <Text style={{ color:'white'}}>Hora: {hora}</Text>
              </View>
              <Text style={{ color:'white'}}>Total: ${(total).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</Text>
              <View style={{ position: 'absolute', bottom: normalize(55, 'height'), right: normalize(120 - desface), flexDirection: 'row' }}>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>{(estado.est_pago_nombre).toUpperCase()}</Text>
              </View>
            </View>
        </Card>
      </TouchableNative>
    };

    renderModal = () =>{
      const {visible, selected, rol, total } = this.state
      return <Modal 
        animationType="slide"
        visible={visible}
        onRequestClose={() => {
            this.setState({ visible: !visible })
        }}>
        { selected && <View style={{ flex: 1 }}>          
          <View style={{ paddingVertical: normalize(15, 'height'), borderBottomWidth: 0.5 }}>           
            <Text style={{ textAlign:'center', fontSize: normalize(18), fontWeight:'bold' }}>{selected.id.toUpperCase()}</Text>
          </View>
          {Platform.OS === "ios" && <View style={{ position: 'absolute', right: normalize(10), top: normalize(10, 'height') }}>
              <Icon type='material-community' name='chevron-down' color={Colors.Menu} size={normalize(30)} onPress={() => {
                this.setState({ visible: !visible })
              }} />
            </View>}
          <View style={{ marginVertical: normalize(15, 'height')}}>
            {this.renderDetalle()}
          </View>
          <ScrollView>
                {selected.ped_productos.map((item)=>{
                    let costo = '$' + (item.prod_costo * item.prod_cantidad).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                    return <ListItem
                    key={item.prod_imagen}
                    titleStyle={{fontSize: normalize(15)}}
                    title={item.prod_nombre + ' X ' + item.prod_cantidad}
                    subtitle={costo}
                    leftAvatar={{
                        title: item.prod_nombre[0],
                        size: 'medium',
                        source: {uri: item.prod_url},
                        overlayContainerStyle: {backgroundColor: 'white'},
                        imageProps: {resizeMode: 'contain'}
                    }}/>
                })}
          </ScrollView>              
          <View>
              {rol == 1 && <MapView 
                style={{ height: normalize(110, 'height'), width: '100%', marginBottom: normalize(10, 'height') }} 
                mapType="standard"
                onPress={this.renderDistancia}
                showsTraffic={true}
                initialRegion={{
                    latitude: selected.ped_ubicacion.latitude,
                    longitude: selected.ped_ubicacion.longitude,
                    latitudeDelta: 0.002, 
                    longitudeDelta: 0.002
                }}>
                <Marker
                    coordinate={{
                        latitude: selected.ped_ubicacion.latitude,
                        longitude: selected.ped_ubicacion.longitude
                    }}/>
              </MapView>}
              <Input
                    label={'Observaciones:'}
                    maxLength={100}
                    multiline={true}
                    disabled={true}
                    numberOfLines={3}
                    value={rol == 1 ? selected.ped_observaciones_cliente : selected.ped_observaciones_proovedor}
                    inputStyle={{ height: normalize(65, 'height'), fontSize: normalize(16) }}
                    inputContainerStyle={{ borderBottomWidth: 0 }}
                />
              <View style={styles.total}>
                <Text style={{fontSize: normalize(25), color: '#fff'}}>TOTAL</Text>
                <Text style={{fontSize: normalize(22), color: '#fff'}}>$ {total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</Text>
              </View>
              {this.renderButon()}
          </View>
        </View>}
      </Modal>
    }

    renderDetalle = () => {
      const { rol, selected } = this.state
      let entrega = moment(selected.ped_tiempo_entrega).diff(moment(), 'minutes');
      entrega = entrega > 0 ? entrega : 0;
      if(rol == 1){
          return <>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: normalize(20) }}>
              <Text>Fecha: {moment(selected.ped_fecha.toDate()).format('DD-MMMM-YYYY')}</Text>
              <Text>Hora: {moment(selected.ped_fecha.toDate()).format('h:mm a')}</Text>
            </View>
            <Text style={{ marginHorizontal: normalize(20), marginBottom: normalize(3, 'height') }}>Cliente: {selected.ped_usuario || selected.ped_email}</Text>     
            <View style={{ flexDirection: 'row', marginHorizontal: normalize(20) }}>
                <Text style={{ marginRight: normalize(10), marginBottom: normalize(3, 'height') }}>Contacto: {selected.ped_telefono.slice(-10)}</Text>
                <Icon type="material-community" name="phone" color={Colors.primaryButton} size={normalize(20)} onPress={this.renderTelefono} />
            </View>
            <Text style={{ marginHorizontal: normalize(20), marginBottom: normalize(3, 'height') }}>Productos Solicitados: ({selected.ped_productos.length})</Text>
            {selected.ped_estado_pago == 4 && <Text style={{ marginHorizontal: normalize(20), marginBottom: normalize(3, 'height') }}>Tiempo Aprox. de Entrega: {entrega} min.</Text>}
          </>
      } else {
          return <>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: normalize(20) }}>
              <Text>Fecha: {moment(selected.ped_fecha.toDate()).format('DD-MMMM-YYYY')}</Text>
              <Text>Hora: {moment(selected.ped_fecha.toDate()).format('h:mm a')}</Text>
            </View>
            <Text style={{ marginHorizontal: normalize(20), marginBottom: normalize(3, 'height') }}>Productos Solicitados: ({selected.ped_productos.length})</Text>
            {selected.ped_estado_pago == 4 && <Text style={{ marginHorizontal: normalize(20), marginBottom: normalize(3, 'height') }}>Tiempo Aprox. de Entrega: {entrega} min.</Text>}
          </>
      }
    }

    renderButon = () =>{
      const { rol, visibleMensaje } = this.state
      const { ped_estado_pago } = this.state.selected
      if(rol == 1){
        if(ped_estado_pago == 4){
          return <Button title='CONFIRMAR ENTREGA' buttonStyle={{ backgroundColor: Colors.primaryButton }} onPress={this.renderConfirmar} />
        }
        else if (ped_estado_pago == 1 || ped_estado_pago == 3){
          return <View style={{ flexDirection: 'row' }}>
            <Button title='RECHAZAR' buttonStyle={{ backgroundColor: Colors.accent }} containerStyle={{ width: '50%' }} onPress={()=>{
              this.setState({ visibleMensaje: !visibleMensaje, mensaje: '¿Motivo del rechazo?', titulo: '¡Uy, que mal!', type: 'R' })
            }} />
            <Button title='ACEPTAR' buttonStyle={{ backgroundColor: Colors.primaryButton }} containerStyle={{ width: '50%' }} onPress={()=>{
              this.setState({ visibleMensaje: !visibleMensaje, mensaje: '¿Tiempo aproximado de entrega?', titulo: '¡Estamos listos!', type: 'A' })
            }} />
          </View>
        }
      } else {
        if (ped_estado_pago == 1 || ped_estado_pago == 4){
         return <Button title='CANCELAR' buttonStyle={{ backgroundColor: Colors.accent }} onPress={this.renderCancelar} />
        }
      }
      return null
    }

    renderMensaje = () =>{
      const { titulo, mensaje, visibleMensaje, type } = this.state
      let keyborad = type == 'A' ? 'phone-pad' : 'default';
      return (
        <View>
          <Dialog.Container visible={visibleMensaje}>
            <Dialog.Title>{titulo}</Dialog.Title>
            <Dialog.Description>
              {mensaje}
            </Dialog.Description>
            <Dialog.Input wrapperStyle={{ borderBottomWidth: 0.5 }} keyboardType={keyborad} onChangeText={(text) => {
              this.setState({ observaciones: text })
            }}></Dialog.Input>
            <Dialog.Button label="Cancelar" onPress={()=>{
              this.setState({ visibleMensaje: !visibleMensaje })
            }} />
            <Dialog.Button label="Enviar" onPress={()=>{
              if(type == 'R'){
                this.renderRechazar();
              }
              if(type == 'A'){
                this.renderAceptar();
              }
            }} />
          </Dialog.Container>
        </View>
      );
    }

    renderConfirmar = () =>{
      const { visible } = this.state
      const { id } = this.state.selected
      db.collection('tbl_pedidos').doc(id).update({ped_estado_pago: 6 });
      this.setState({ visible: !visible })
    }

    renderCancelar = () =>{
      const { visible } = this.state
      const { id } = this.state.selected
      db.collection('tbl_pedidos').doc(id).update({ped_estado_pago: 2 });
      this.setState({ visible: !visible })
    }

    renderAceptar = () =>{
      const { visibleMensaje, observaciones, visible } = this.state
      const { id } = this.state.selected
      let entrega = moment().add(observaciones, 'minutes').format('LLLL');
      db.collection('tbl_pedidos').doc(id).update({ped_estado_pago: 4, ped_tiempo_entrega: entrega});
      this.setState({ visibleMensaje: !visibleMensaje, visible: !visible })
    }

    renderRechazar = () =>{
      const { visibleMensaje, observaciones, visible } = this.state
      const { id } = this.state.selected
      db.collection('tbl_pedidos').doc(id).update({ped_estado_pago: 3, ped_observaciones_proovedor: observaciones});
      this.setState({ visibleMensaje: !visibleMensaje, visible: !visible })
    }

    renderTelefono = () =>{
      const { ped_telefono } = this.state.selected
      let phoneNumber = '';
      if (Platform.OS === "ios") {
        phoneNumber = `telprompt:${ped_telefono}`;
      }
      else  {
        phoneNumber = `tel:${ped_telefono}`;
      }
      Linking.canOpenURL(phoneNumber).then(supported => {
          if (!supported) {
              Alert.alert('Instala la aplicación para brindarte una mejor experiencia');
          } else {
              return Linking.openURL(phoneNumber);
          }
      }).catch(err => console.error(err));
  }

    renderDistancia = () =>{
        const { ped_ubicacion } = this.state.selected
        const startLocation = `${CavaLatitude},${CavaLongitude}`;
        const endLocation = `${ped_ubicacion.latitude},${ped_ubicacion.longitude}`;
        const URL = (`https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=${endLocation}&origin=${startLocation}`);
        Linking.openURL(URL)
    }


    render() {
      const {pedidos} = this.props.store;
      const {cargando} = this.state
      if(cargando){
      return <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator
            size="small"
            animating={true}
            color={Colors.primaryButton}
          />
        </View>
      }
      if(pedidos && pedidos.length == 0){
        return <View style={styles.result}>
            <View style={{ marginBottom: normalize(10, 'height') }}>
                <Icon type="material-community" name="bell-off" color='grey' size={normalize(50)}/>
            </View>
            <Text style={{ textAlign:'center', fontSize: normalize(18) }}>¡Sin Notificaciones!</Text>
        </View>
      }      
      return <View style={{ flex: 1, marginBottom: normalize(10, 'height') }}>
          <FlatList
            data={pedidos}
            renderItem={this.renderItems}
            keyExtractor={(item) => item.id}
          />
          {this.renderModal()}
          {this.renderMensaje()}
        </View>
    }
}

export default inject('store')(observer(Notificaciones));

const styles = StyleSheet.create({
  total:{
    justifyContent:'space-between',
    flexDirection:'row',
    backgroundColor: Colors.primary,
    paddingHorizontal: normalize(15),
    paddingVertical: normalize(5, 'height')
  },
  result:{
    flex: 1,
    justifyContent: 'center',
  },
  modal:{
      height:'auto',
      width: normalize(350),
      backgroundColor:'#fff',
  }
});