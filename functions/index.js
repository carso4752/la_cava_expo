const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');
admin.initializeApp();

const db = admin.firestore();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.addPagoPayU = functions.https.onRequest((req, res) => {
  const object = req.body;
  console.log('Object response', object);
  let id = object.reference_sale;
  let estado =
    object.state_pol == 5 || object.state_pol == 6 ? 5 : object.state_pol;
  db.collection('tbl_pagos_online')
    .where('transaction_reference', '==', id)
    .get()
    .then(function (querySnapshot) {
      let encontro = false;
      querySnapshot.forEach(function (doc) {
        encontro = true;
      });

      if (encontro) {
        db.collection('tbl_pedidos')
          .doc(id)
          .update({ped_estado_pago: estado, ped_notify: true})
          .then(() => {
            return res.status(200).end();
          });
      } else {
        db.collection('tbl_pedidos')
          .doc(id)
          .update({ped_estado_pago: estado, ped_notify: true});
        db.collection('tbl_pagos_online')
          .add({
            transaction_id: object.transaction_id,
            transaction_date: object.transaction_date,
            transaction_franchise: object.franchise,
            transaction_state: object.payment_request_state,
            transaction_method: object.payment_method,
            transaction_reference: object.reference_sale,
            transaction_iva: object.tax,
            transaction_valor: object.value,
            transaction_user: object.email_buyer,
            transaction_cc: object.cc_number,
            transaction_sing: object.sign,
          })
          .then(() => {
            return res.status(200).end();
          })
          .catch(() => {
            return res.status(400).end();
          });
      }
    })
    .catch(function (error) {
      console.log('Error getting document:', error);
    });
});

sendPushNotification = (message) => {
  fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
};

const mensajes = [
  {i: '1', mensaje_usuario: 'Tienes un nuevo pedido'},
  {i: '2', mensaje_usuario: 'El pedido fue cancelado'},
  {
    i: '3',
    mensaje_usuario:
      'Tu pedido fue rechazado, puedes verificar el motivo en nuestra app',
  },
  {i: '4', mensaje_usuario: 'Tu pedido ya está en camino'},
  {
    i: '5',
    mensaje_usuario:
      'Pago rechazado, valida tu saldo con tu entidad financiera',
  },
  {i: '6', mensaje_usuario: 'Muchas gracias por preferirnos'},
];

exports.sendNotification = functions.firestore
  .document('tbl_pedidos/{ped_estado_pago}')
  .onWrite((change, context) => {
    let data = change.after.data();

    let contenido = mensajes.find((e) => e.i == data.ped_estado_pago);

    if (data.ped_estado_pago == 1 || data.ped_estado_pago == 2) {
      const items = db.collection('tbl_admin_token');
      items.get().then((result) => {
        result.forEach((element) => {
          const message = {
            notification: {
              sound: 'default',
              title: `Pedido ${data.ped_usuario}`,
              body: `${contenido.mensaje_usuario}`,
            },
          };
          admin.messaging().sendToDevice(element.data().id_token, message);
          //sendPushNotification(message);
        });
      });
    } else {
      const message = {
        notification: {
          sound: 'default',
          title: `Pedido ${data.ped_fecha}`,
          body: `${contenido.mensaje_usuario}`,
        },
      };

      admin.messaging().sendToDevice(data.ped_token, message);
      //sendPushNotification(message);
    }
    return true;
  });
