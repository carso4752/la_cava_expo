import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export default class payU extends Component {
    render() {
        return  <View style={styles.container}>
            <WebView source={{
            html: ` <form method="post" action="https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/">
                <input name="merchantId"    type="hidden"  value="508029"   >
                <input name="accountId"     type="hidden"  value="512321" >
                <input name="description"   type="hidden"  value="Test PAYU"  >
                <input name="referenceCode" type="hidden"  value="TestPayULaCava" >
                <input name="amount"        type="hidden"  value="20000"   >
                <input name="tax"           type="hidden"  value="3193"  >
                <input name="taxReturnBase" type="hidden"  value="16806" >
                <input name="currency"      type="hidden"  value="COP" >
                <input name="signature"     type="hidden"  value="6928fa98ccf437c507699f6332d3be02"  >
                <input name="test"          type="hidden"  value="1" >
                <input name="buyerEmail"    type="hidden"  value="test@test.com" >
                <input name="responseUrl"    type="hidden"  value="http://www.test.com/response" >
                <input name="confirmationUrl"    type="hidden"  value="http://www.test.com/confirmation" >
                <input name="Submit"        type="submit"  value="Enviar" >
                </form>`
            }} />
        </View>
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1, 
        backgroundColor:'white'
    }
})