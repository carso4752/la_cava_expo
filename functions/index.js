const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.addPagoPayU = functions.https.onRequest((req, res)=>{
    const object = req.body;
    db.collection('tbl_pagos_online').add({
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
        transaction_sing: object.sign
    }).then(()=>{
        return res.status(200).end();
    }).catch(()=>{
        return res.status(400).end();
    })
});