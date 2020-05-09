import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {setPedidos, getPedidos} from './../Shop/shop.utils';
import {firebaseApp} from './../Database/Firebase';
import * as Firebase from 'firebase';
import 'firebase/firestore';

class Subscribe extends Component {
  realtime = null; 

    componentDidMount() {
        let user = Firebase.auth().currentUser;
        if (user != null && user.providerData != null) {
            let email = user.providerData[user.providerData.length - 1].email;
            this.renderPedidos(email);
        }
    }

    renderPedidos = (email) =>{
        let {setPedidos: setP} = this.props.store;
        db = Firebase.firestore(firebaseApp);
        var pedidos = [];

        if (email == "car.yho.ys@gmail.com") {
          this.realtime = db
          .collection('tbl_pedidos')
          .orderBy('ped_fecha', 'desc')
          .onSnapshot((querySnapshot) => {
            
            querySnapshot.forEach(function (doc) {
                let data = doc.data();
                pedidos.push({...data, id: doc.id});
            });

            setP(pedidos);
            this.validarNoty(pedidos);
          });
        } 
        else {
          const Ref = db.collection('tbl_pedidos')
          this.realtime = Ref.orderBy('ped_fecha', 'desc').onSnapshot((querySnapshot) => {
            querySnapshot.forEach(function (doc) {
                let data = doc.data();
                pedidos.push({...data, id: doc.id});
            });

            setP(pedidos);
            this.validarNoty(pedidos);
          });
        }
    }

    validarNoty = async (pedidos) => {
      let { setNotyBadge } = this.props.store;
      let storage = await getPedidos();
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
