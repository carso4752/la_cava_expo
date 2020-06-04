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
            if(data.ped_estado_pago != 2){
              pedidos.push({...data, id: doc.id});
            }
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
        cambios++;
      }
    }
    setNotyBadge(cambios);
  };

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
