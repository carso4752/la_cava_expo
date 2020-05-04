import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export default class payU extends Component {

    state = {
        compras: [],
        html: null
    }

    async componentDidMount() {
        const { params } = this.props.route
        if (params && params.pedido) {
            await this.setState({ compras: params.pedido })
            this.renderHTML();
        }
    }
    
    renderHTML = () => {
        const {compras} = this.state;
        let html = "<ul style='list-style:none'><h1 style='text-align:center; font-size: 48px'>Tu pedido</h1>";
        let total = 0;
        for (let index = 0; index < compras.length; index++) {
            const item = compras[index];
            total = total + item.prod_costo * item.prod_cantidad;
            let costo = '$' + (item.prod_costo * item.prod_cantidad).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            html += `<li style="display: flex; margin-top: 5px; margin-bottom: 15px">
                    <img src="${item.prod_url}" width="200px">
                    <div style="margin-left: 15px">
                        <p style="font-size: 40px; margin-bottom: 0px">
                            ${item.prod_nombre + ' X ' + item.prod_cantidad}
                        </p>
                        <p style="font-size: 40px; margin-top: -3px">
                            ${costo}
                        </p>
                    </div>
                </li>`;
        }
    
        html += `</ul> <form method="post" action="https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/">
                <input name="merchantId"    type="hidden"  value="508029"   >
                <input name="accountId"     type="hidden"  value="512321" >
                <input name="description"   type="hidden"  value="Test PAYU"  >
                <input name="referenceCode" type="hidden"  value="TestPayULaCava" >
                <input name="amount"        type="hidden"  value="${total}"   >
                <input name="tax"           type="hidden"  value="3193"  >
                <input name="taxReturnBase" type="hidden"  value="16806" >
                <input name="currency"      type="hidden"  value="COP" >
                <input name="signature"     type="hidden"  value="6928fa98ccf437c507699f6332d3be02"  >
                <input name="test"          type="hidden"  value="1" >
                <input name="buyerEmail"    type="hidden"  value="test@test.com" >
                <input name="responseUrl"    type="hidden"  value="http://www.test.com/response" >
                <input name="confirmationUrl"    type="hidden"  value="http://www.test.com/confirmation" >
                <input name="Submit" style="background: #17A589;
                width: 100%;
                height: 130px;
                border: 0;
                border-radius: 15px;
                color: #fff;
                font-size: 42px;" type="submit" value="Continuar">
            </form>`;
        this.setState({ html })
    };
    
    render() {
        const { html } = this.state
        return  <View style={styles.container}>
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