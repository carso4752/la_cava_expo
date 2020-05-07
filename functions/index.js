const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.addPagoPayU = functions.https.onRequest((req, res) => {
  const object = req.body;
  let id = object.reference_sale;
  let estado =
    object.state_pol == 5 || object.state_pol == 6 ? 3 : object.state_pol;

  db.collection('tbl_pagos_online')
    .where('transaction_reference', '==', id)
    .get()
    .then(function (querySnapshot) {
      let encontro = false;
      querySnapshot.forEach(function (doc) {
        encontro = true;
      });

      if (encontro) {
        db.collection('tbl_pedidos').doc(id).update({ped_estado_pago: estado});
        return res.status(200).end();
      } else {
        db.collection('tbl_pedidos').doc(id).update({ped_estado_pago: estado});
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
