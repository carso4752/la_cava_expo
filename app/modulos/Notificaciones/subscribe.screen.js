import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {setPedidos, getPedidos} from './../Shop/shop.utils';
import {firebaseApp} from './../Database/Firebase';
import * as Firebase from 'firebase';
import 'firebase/firestore';

import {getRol} from './../Shop/shop.utils';

class Subscribe extends Component {
  realtime = null;

  componentDidMount() {
    let user = Firebase.auth().currentUser;
    if (user != null && user.providerData != null) {
      let email = user.providerData[user.providerData.length - 1].email;
      getRol().then((id) => {
        this.renderPedidos(id, email);
      });
    }
  }

  renderPedidos = (id, email) => {
    const {setPedidos: setP} = this.props.store;
    db = Firebase.firestore(firebaseApp);
    let pedidos = [];

    if (id == '1') {
      this.realtime = db
        .collection('tbl_pedidos')
        .orderBy('ped_fecha', 'desc').limit(50)
        .onSnapshot((querySnapshot) => {
          pedidos = [];
          querySnapshot.forEach(function (doc) {
            let data = doc.data();
            pedidos.push({...data, id: doc.id});
          });
          
          setP(pedidos);
          this.validarNoty(pedidos);
        });
    } else {
      const Ref = db.collection('tbl_pedidos').limit(50);
      this.realtime = Ref.where('ped_usuario', '==', email).onSnapshot(
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
          element.id == e.id && element.ped_estado_pago == e.ped_estado_pago
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
