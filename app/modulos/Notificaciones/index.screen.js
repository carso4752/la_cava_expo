import React, { Component } from 'react';
import { View, FlatList, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, ListItem, Icon, Overlay, Button } from 'react-native-elements';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import normalize from 'react-native-normalize';
import { ActivityIndicator } from 'react-native-paper';
import Colors from '../../theme/colors';
import {getRol} from '../Shop/shop.utils';
import TouchableNative from '../shared/touchableNative';
import { setPedidos } from '../Shop/shop.utils';

class Notificaciones extends Component {

  constructor() {
      super();
      this.state = {
          rol: null,
          cargando: true,
          visible: false,
          selected: null,
          total: 0
      }    
  }

  async componentDidMount(){
      const {setNotyBadge, pedidos} = this.props.store;
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
                <Icon type="material-community" name="cube-send" color={Colors.primary} size={normalize(30)} />
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
      return <Overlay
        isVisible={visible}
        windowBackgroundColor='rgba(218,218,218, 0.8)'
        overlayBackgroundColor='transparent'
        overlayStyle={styles.modal}
        onBackdropPress={() => {
            this.setState({ visible: !visible })
        }}>
          {selected && <>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginRight: normalize(10) }}>
              <Text style={{ color:'white'}}>Fecha: {moment(selected.ped_fecha.toDate()).format('DD-MMMM-YYYY')}</Text>
              <Text style={{ color:'white'}}>Hora: {moment(selected.ped_fecha.toDate()).format('h:mm a')}</Text>
            </View>
            <ScrollView>
              <Card
                containerStyle={{ paddingHorizontal: 0, paddingBottom: 0, marginBottom: normalize(30, 'height') }}
                title={selected.id}>
                {selected.ped_productos.map((item)=>{
                  let costo = '$' + (item.prod_costo * item.prod_cantidad).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                  
                  return <ListItem
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
                />
                })}
                <View style={styles.total}>
                  <Text style={{fontSize: normalize(25), color: '#fff'}}>TOTAL</Text>
                  <Text style={{fontSize: normalize(22), color: '#fff'}}>$ {total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</Text>
                </View>
              </Card>
            </ScrollView>
          </>}
          <Button title='Cancelar' buttonStyle={{ backgroundColor: Colors.accent }} />
      </Overlay>
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
      return <View style={{ flex: 1, marginBottom: normalize(10, 'height') }}>
          <FlatList
            data={pedidos}
            renderItem={this.renderItems}
            keyExtractor={(item) => item.id}
          />
          {this.renderModal()}
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
  modal:{
      height:'auto',
      width: normalize(350),
      backgroundColor:'#fff',
  }
});