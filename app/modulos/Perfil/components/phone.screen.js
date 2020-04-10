import React, { Component } from 'react';
import { StyleSheet, Keyboard } from 'react-native';
import { Button, Input, Icon } from 'react-native-elements';
import normalize from 'react-native-normalize';
import Colors from '../../../theme/colors';
import * as firebase from 'firebase';
import { FirebaseRecaptchaVerifierModal, FirebaseAuthApplicationVerifier } from 'expo-firebase-recaptcha';

class Phone extends Component {
        
    constructor(){
        super();
        this.state = {
            usuario: null,
            confirm: false,
            verificationId: null,
            verificationCode: null,
        }
    }
    recaptchaVerifier = FirebaseAuthApplicationVerifier;

    async componentDidMount(){        
        await this.setState({ usuario: this.props.data })
    }

    SendCode = async () => {
        const { usuario } = this.state;
        const phoneProvider = new firebase.auth.PhoneAuthProvider();
        const verificationId = await phoneProvider.verifyPhoneNumber(
            "+57" + usuario.phoneNumber,
            this.recaptchaVerifier
        ).then(()=>{
            this.setState({ verificationId, confirm: true });
        }).catch((err)=>{
            console.log("err", err)
            this.props.guardar(usuario, null, verificationId, err)
        });
    };

    render(){
        const { usuario, verificationCode, verificationId, confirm } = this.state
        let tituloBtn = confirm ? "Confirmar" : "Generar Código";
        return <>
            <FirebaseRecaptchaVerifierModal
                ref={ref => this.recaptchaVerifier = ref}
                firebaseConfig={firebase.app().options} 
            />
            <Input
                containerStyle={styles.containerInput}
                label={"Número de celular"}
                placeholder={"Ingrese número de celular"}
                inputStyle={styles.input}
                value={usuario && usuario.phoneNumber ? usuario.phoneNumber.slice(-10) : ''}
                leftIconContainerStyle={{ paddingRight: normalize(15) }}
                leftIcon={{
                    type: "material-community",
                    name: "cellphone-android",
                    color: 'grey',
                    size: normalize(25)
                }}
                onChangeText={async text => {
                    let data = usuario
                    data.phoneNumber = text;
                    await this.setState({ usuario: {...data} })
                }}
                autoCapitalize={"none"}
                keyboardType='phone-pad'
            />
            {confirm && <Input
                containerStyle={styles.containerInput}
                label={"Código Verificación"}
                placeholder={"Ingrese el código"}
                value={verificationCode}
                inputStyle={styles.input}
                leftIconContainerStyle={{ paddingRight: normalize(15) }}
                leftIcon={
                    <Icon 
                    type='material-community'
                    name={'shield-check'}
                    color='grey'
                    size={normalize(25)}
                    />
                }
                onSubmitEditing={Keyboard.dismiss}
                onChangeText={async text => {
                    await this.setState({ verificationCode: text })
                }}
                autoCapitalize={"none"}
            />}
            <Button
                buttonStyle={{ backgroundColor: Colors.Menu, marginTop: confirm ? 10 : 5, marginBottom: confirm ? 10 : 0 }}
                containerStyle={styles.button}
                title={tituloBtn}
                onPress={async() => {
                    if(confirm){
                        if(verificationCode){
                            this.props.guardar(usuario, verificationCode, verificationId)
                        }
                    } else {
                        if(usuario.phoneNumber){
                            this.SendCode();
                        }
                    }
                }}
            />
        </>
    }
}

const styles = StyleSheet.create({
    input:{
        fontSize: normalize(18),
        height: normalize(40, 'height')
    },
    containerInput:{
        marginBottom: normalize(15, 'height'),
        paddingHorizontal: normalize(20)
    }
})

export default Phone