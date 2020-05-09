import React, { Component } from 'react';
import { View, FlatList, Text } from 'react-native';
import { Card } from 'react-native-elements';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import normalize from 'react-native-normalize';

class Notificaciones extends Component {
    
  estados = [
      {i: '1', est_pago_nombre: 'Pendiente'},
      {i: '2', est_pago_nombre: 'Cancelado'},
      {i: '3', est_pago_nombre: 'Rechazado'},
      {i: '4', est_pago_nombre: 'Aceptado'},
      {i: '5', est_pago_nombre: 'Pago Rechazado'},
    ];

    renderItems = ({item, index}) => {
      let fecha = moment(item.ped_fecha.toDate()).format('DD-MMMM-YYYY');
      let hora = moment(item.ped_fecha.toDate()).format('h:mm a');
      let estado = this.estados.find((e) => e.i == item.ped_estado_pago);
      let total = 1800
      let desface = estado.i == 5 ? 35 : 0
      {item.ped_productos.map((e)=>{
          total = total + (e.prod_costo * e.prod_cantidad)
      })}      
      return <Card
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
    };

    render() {
      let {pedidos} = this.props.store;
      return <View style={{ flex: 1, marginBottom: normalize(10, 'height') }}>
          <FlatList
            data={pedidos}
            renderItem={this.renderItems}
            keyExtractor={(item) => item.id}
          />
        </View>
    }
}

export default inject('store')(observer(Notificaciones));
