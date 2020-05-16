import React, {Component} from 'react';
import {Alert} from 'react-native';
import {inject, observer} from 'mobx-react';
import {setPedidos, getPedidos} from './../Shop/shop.utils';
import * as Permission from 'expo-permissions';
import { Notifications } from 'expo';
import {firebaseApp} from './../Database/Firebase';
import * as firebase from 'firebase';
import 'firebase/firestore';
import {getRol} from './../Shop/shop.utils';

var db = null;

class Subscribe extends Component {

  constructor() {
    super();

    this.state = {
        token: null,
        rol: 2
    };
  }
  realtime = null;
  
  mensajes = [
    {i: '1', mensaje_usuario: 'Tienes un nuevo pedido'},
    {i: '2', mensaje_usuario: 'El pedido fue cancelado'},
    {i: '3', mensaje_usuario: 'Tu pedido fue rechazado, puedes verificar el motivo en nuestra app'},
    {i: '4', mensaje_usuario: 'Tu pedido ya está en camino'},
    {i: '5', mensaje_usuario: 'Pago rechazado, valida tu saldo con tu entidad financiera'},
    {i: '6', mensaje_usuario: 'Muchas gracias por preferirnos'},
  ];

  async componentDidMount() {
    db = firebase.firestore(firebaseApp);
    const token  = await this.getToken();
    let user = firebase.auth().currentUser;
    if (user != null && user.providerData != null) {
      let email = user.providerData[user.providerData.length - 1].email;
      getRol().then((id) => {
        if(id == 1){
          db.collection("tbl_admin_token").doc(user.uid).set({
            id_token: token
          })
        }
        this.renderPedidos(id, email);
      });
    }
  }

  getToken = async () => {
    const permisoNotify = await Permission.askAsync(Permission.NOTIFICATIONS);
    const status = permisoNotify.permissions.notifications.status;
    if(status === "denied"){
        Alert.alert("Permiso denegado", "Se deben conceder los permisos necesarios para el envió de notificaciones")
    } else {
      const token = await Notifications.getExpoPushTokenAsync();
      await this.setState({ token })
      return token
    }
  }
  
  renderPedidos = (id, email) => {
    const {setPedidos: setP} = this.props.store;
    let pedidos = [];

    if (id == '1') {
      this.realtime = db
        .collection('tbl_pedidos')
        .orderBy('ped_fecha', 'desc').limit(50)
        .onSnapshot((querySnapshot) => {
          pedidos = [];
          querySnapshot.forEach(function (doc) {
            let data = doc.data();
            if(data.ped_estado_pago != 5){
              pedidos.push({...data, id: doc.id});
            }
          });          
          
          setP(pedidos);
          this.validarNoty(pedidos);
        });
    } else {
      const Ref = db.collection('tbl_pedidos');
      this.realtime = Ref.where('ped_email', '==', email).onSnapshot(
        (querySnapshot) => {
          pedidos = [];
          querySnapshot.forEach(function (doc) {
            let data = doc.data();
            pedidos.push({...data, id: doc.id});
          });

          pedidos.sort(function(a, b){
              if(a.ped_fecha > b.ped_fecha){
                  return -1
              }
              if(a.ped_fecha < b.ped_fecha){
                  return 1
              }
              return 0
          });

          setP(pedidos);
          this.validarNoty(pedidos);
        }
      );
    }
  };

  validarNoty = async (pedidos) => {
    const {setNotyBadge} = this.props.store;
    const storage = await getPedidos();
    let cambios = 0;

    for (let index = 0; index < pedidos.length; index++) {
      const element = pedidos[index];

      let f = storage.find(
        (e) =>
          element.id == e.id && (element.ped_estado_pago == e.ped_estado_pago || element.ped_estado_pago == 1 )
      );
      if (!f) {
        this.generarNotificacion(element);
        cambios++;
      }
    }
    setNotyBadge(cambios);
  };

  generarNotificacion = async(item) => {
    const { token } =  this.state
    let titulo = (item.id).toUpperCase();
    let contenido = this.mensajes.find((e) => e.i == item.ped_estado_pago);
    let rol = await getRol();
    
    if(rol == 2){
      if (item.ped_estado_pago == 1 || item.ped_estado_pago == 2){
        const items = db.collection("tbl_admin_token")
        await items.get().then(result => {
          result.forEach(element => {
            const message = {
              to: element.data().id_token,
              sound: 'default',
              title: `Pedido ${titulo}`,
              body: `${contenido.mensaje_usuario}`
            };
            this.sendPushNotification(message)
          });
        }); 
      } 
      else {
          const message = {
            to: token,
            sound: 'default',
            title: `Pedido ${titulo}`,
            body: `${contenido.mensaje_usuario}`
          };
          this.sendPushNotification(message)
      }    
    }
  };

  sendPushNotification = async(message) =>{
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  }

  componentWillUnmount() {
    if (this.realtime) {
      this.realtime();
    }
  }

  render() {
    return <></>;
  }
}

export default inject('store')(observer(Subscribe));
