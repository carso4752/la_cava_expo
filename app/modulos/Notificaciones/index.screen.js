import React, {Component} from 'react';
import {View, FlatList, Text} from 'react-native';
import {Card, Icon, Badge} from 'react-native-elements';
import {inject, observer} from 'mobx-react';
import moment from 'moment';

class Notificaciones extends Component {
  estados = [
    {i: '1', est_pago_nombre: 'Pendiente', color: 'primary'},
    {i: '2', est_pago_nombre: 'Cancelado', color: 'warning'},
    {i: '3', est_pago_nombre: 'Rechazado', color: 'error'},
    {i: '4', est_pago_nombre: 'Aceptado', color: 'success'},
  ];

  renderItems = ({item, index}) => {
    fecha = moment(item.ped_fecha.toDate()).format('DD-MM-YYYY h:mm:ss');
    estado = this.estados.find(
      (e) => e.i == item.ped_estado_paago
    );
    return (
      <Card style={{flex:1}} key={index}>
        <View style={{flex:1, width: '100%', justifyContent: 'flex-end'}}>
          <Badge status={estado.color} value={`Pago: ${estado.est_pago_nombre}`} containerStyle={{ padding: 5 }} />
        </View>
        <Text>Fecha: {fecha}</Text>
        <Text>Productos: </Text>
        {item.ped_productos.map((e) => {
          <Text>{e}</Text>
        })}
      </Card>
    );
  };

  render() {
    let {pedidos} = this.props.store;
    return (
      <View style={{felx: 1}}>
        <FlatList
          data={pedidos}
          renderItem={this.renderItems}
          keyExtractor={(item) => item.id}
        />
      </View>
    );
  }
}

export default inject('store')(observer(Notificaciones));
