import React, {Component} from 'react';
import {View} from 'react-native';
import {inject, observer} from 'mobx-react';

import {setPedidos, getPedidos} from './../Shop/shop.utils';

import {firebaseApp} from './../Database/Firebase';
import * as Firebase from 'firebase';
import 'firebase/firestore';

class Subscribe extends Component {
  realtime = null;

  validarNoty = async (pedidos) => {

    let {setNotyBadge} = this.props.store;
    let storage = await getPedidos();
    let cambios = 0;

    console.log(storage, "pedidos")

    for (let index = 0; index < pedidos.length; index++) {
      const element = pedidos[index];
      let f = storage.find(
        (e) =>
          element.id == e.id && element.ped_estado_paago == e.ped_estado_paago
      );
      console.log("f", f)
      if (!f) {
        cambios++;
      }
    }

    setNotyBadge(cambios);
    setPedidos(pedidos);
  };

  componentDidMount() {
    let {setPedidos: setP} = this.props.store;
    let user = Firebase.auth().currentUser;

    if (user != null && user.providerData != null) {
      let email = user.providerData[user.providerData.length - 1].email;

      db = Firebase.firestore(firebaseApp);

      if(email == "admin"){
        this.realtime = db
        .collection('tbl_pedidos')
        .onSnapshot((querySnapshot) => {
          var pedidos = [];
          querySnapshot.forEach(function (doc) {
            let data = doc.data();
            pedidos.push({...data, id: doc.id});
          });

          setP(pedidos);
          this.validarNoty(pedidos);
        });
      }else{
        this.realtime = db
        .collection('tbl_pedidos')
        .where('ped_usuario', '==', email)
        .onSnapshot((querySnapshot) => {
          var pedidos = [];
          querySnapshot.forEach(function (doc) {
            let data = doc.data();
            pedidos.push({...data, id: doc.id});
          });

          setP(pedidos);
          this.validarNoty(pedidos);
        });
      }
    }
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
