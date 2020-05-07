import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

import md5 from 'react-native-md5';

export default class payU extends Component {

    state = {
        compras: [],
        html: null,
        referencia: "",
        email: ""
    }

    async componentDidMount() {
        const { params } = this.props.route
        if (params && params.pedido && params.referencia && params.usuario) {
            await this.setState({ compras: params.pedido, referencia: params.referencia, email: params.usuario })
            this.renderHTML();
        }
    }
    
    renderHTML = () => {
        const { compras, referencia, email } = this.state;
        let html = `<div style="margin: 25px; margin-top: 40px;  border: 1px solid #F39C12; border-radius: 10px">
        <div style="display:flex; justify-content: center; align-items:center; height: 150px; background: #F39C12; border-radius: 10px 10px 0 0">
        <h1 style='text-align:center; font-size: 58px; margin: 0; color: #fff'>Tu pedido</h1>
        </div>
        <div style="padding: 20px;">
        <ul style='list-style:none'>
        `;
        let total =  1800;
        for (let index = 0; index < compras.length; index++) {
            const item = compras[index];
            total = total + item.prod_costo * item.prod_cantidad;
            let costo = '$' + (item.prod_costo * item.prod_cantidad).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            html += `<li style="display: flex; margin-top: 5px; margin-bottom: 15px; padding: 10px">
                    <img src="${item.prod_url}" width="125px" height="100px">
                    <div style="margin-left: 15px">
                        <p style="font-size: 38px; margin-top:0; margin-bottom: 2px; color: #404040">
                            ${item.prod_nombre + ' X ' + item.prod_cantidad}
                        </p>
                        <p style="font-size: 36px; margin-top: 2px; color: #b1b1b1">
                            ${costo}
                        </p>
                    </div>
                </li>`;
        }

        let ApiKey = "4Vj8eK4rloUd272L48hsrarnUA";
        let currency = 'COP';
        let merchantId = "508029";
        let signature = md5.hex_md5(`${ApiKey}~${merchantId}~${referencia}~${total}~${currency}`);

        html += `</ul> <form method="post" action="https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/">
                <input name="merchantId"    type="hidden"  value="${merchantId}"   >
                <input name="accountId"     type="hidden"  value="512321" >
                <input name="description"   type="hidden"  value="Compra Productos La Cava"  >
                <input name="referenceCode" type="hidden"  value="${referencia}" >
                <input name="amount"        type="hidden"  value="${total}"   >
                <input name="currency"      type="hidden"  value="${currency}" >
                <input name="signature"     type="hidden"  value="${signature}"  >
                <input name="test"          type="hidden"  value="1" >
                <input name="buyerEmail"    type="hidden"  value="${email}" >
                <input name="confirmationUrl"    type="hidden"  value="https://us-central1-lacava-a1dab.cloudfunctions.net/addPagoPayU" >
                <input name="Submit" style="background: #17A589;
                width: 100%;
                height: 130px;
                border: 0;
                border-radius: 10px;
                color: #fff;
                font-size: 50px;" type="submit" value="Continuar">
            </form></div></div>`;
        this.setState({ html })
    };
    
    render() {
        const { html } = this.state
        return  <View style={{...styles.container, alignItems: 'center', justifyContent: 'center'}}>
            <WebView 
                textZoom={100}
                containerStyle={{width: '100%', flex: 1}}
                source={{ html }} 
            />
        </View>
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1, 
        backgroundColor:'white'
    }
})