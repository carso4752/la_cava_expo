import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, KeyboardAvoidingView } from 'react-native';
import { Button, Image, Input, Icon } from 'react-native-elements';
import Colors from '../../theme/colors';
import { firebaseApp } from '../Database/Firebase';
import * as Firebase from 'firebase';
import 'firebase/firestore';
import Toast, {DURATION} from 'react-native-easy-toast';
import normalize from 'react-native-normalize';
import { ActivityIndicator } from 'react-native-paper'

const DeviceScreen = Dimensions.get('screen')

export default class Registro extends Component {

    db = null;

    constructor(){
        super();

        this.state = {
            FormValue:{
                email: "",
                password: "",
                confirmPassword: ""
            },
            hideConfirmPassword: true,
            hidePassword: true,
            registro: false
        }

        this.db = Firebase.firestore(firebaseApp);
    }

    _renderRegistro = async() => {
        const { password, confirmPassword, email } = this.state.FormValue
        const { registro } = this.state

        let mailformat = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;

        if(email == "" || password == "" || confirmPassword == ""){
            this.refs.toastError.show('Complete todos los campos', 1000);
        } else if(!mailformat.test(email)){
            this.refs.toastError.show('Correo electronico invalido', 1000);
        } else if(password.length < 6 || confirmPassword.length < 6){
            this.refs.toastError.show('La contraseña debe contener minimo 6 caracteres', 1000);
        } else if(password == confirmPassword){
            await this.setState({ registro: !registro })
            Firebase.auth().createUserWithEmailAndPassword(email, password).then(result => {
                this.db.collection("tbl_usuario_rol").doc(result.user.uid).set({
                    id_rol: 2
                })
                this.refs.toast.show('Registro Exitoso', 500, () =>{
                    this.setState({ registro: false })
                    this.props.navigation.navigate('Perfil')
                });
            }).catch(err => {
                console.log("Error en el Registro", err)
                this.refs.toastError.show('El correo ya esta en uso', 500, ()=>{
                    this.setState({ registro: false })
                });
            })
        } else{
            this.refs.toastError.show('Las contraseñas no coinciden', 1000);
        }
    }

    render() {
        const { FormValue, hideConfirmPassword, hidePassword, registro } = this.state
        const { password, confirmPassword, email } = this.state.FormValue
        let toast = (DeviceScreen.height < 600 ? 130 : 180)
        return <View style={styles.container}>
                <KeyboardAvoidingView>
                <View style={styles.containerLogo}>
                    <Image
                        PlaceholderContent={<ActivityIndicator color={Colors.primaryButton} />}
                        source={require("../../assets/images/logo_laCava.png")}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>
                <Input
                    containerStyle={{ marginBottom: normalize(15, 'height') }}
                    placeholder='Example@email.com'
                    label='Correo Electronico'
                    value={email}
                    inputStyle={styles.input}
                    rightIconContainerStyle={{ paddingRight: normalize(15) }}
                    rightIcon={
                        <Icon 
                        type='material-community'
                        name='at'
                        color='grey'
                        size={normalize(25)}
                        />
                    }
                    onChangeText={ text => {
                        let data = FormValue
                        data.email = text
                        this.setState({ FormValue: {...data} })
                    }}
                    autoCapitalize={"none"}
                    keyboardType='email-address'
                />
                <Input
                    containerStyle={{ marginBottom: normalize(15, 'height') }}
                    placeholder='Minimo 6 caracteres'
                    secureTextEntry={hidePassword}
                    password={true}
                    label='Contraseña'
                    value={password}
                    inputStyle={styles.input}
                    rightIconContainerStyle={{ paddingRight: normalize(15) }}
                    rightIcon={
                        <Icon 
                        type='material-community'
                        name={hidePassword ? 'eye-off-outline': 'eye'}
                        color='grey'
                        size={normalize(25)}
                        onPress={()=> this.setState({ hidePassword: !hidePassword })}
                        />
                    }
                    onChangeText={ text => {
                        let data = FormValue
                        data.password = text
                        this.setState({ FormValue: {...data} })
                    }}
                    autoCapitalize={"none"}
                />
                 <Input
                    containerStyle={{ marginBottom: normalize(15, 'height') }}
                    placeholder='Minimo 6 caracteres'
                    secureTextEntry={hideConfirmPassword}
                    password={true}
                    label='Confirmar Contraseña'
                    value={confirmPassword}
                    inputStyle={styles.input}
                    rightIconContainerStyle={{ paddingRight: normalize(15) }}
                    rightIcon={
                        <Icon 
                        type='material-community'
                        name={hideConfirmPassword ? 'eye-off-outline': 'eye'}
                        color='grey'
                        size={normalize(25)}
                        onPress={()=> this.setState({ hideConfirmPassword: !hideConfirmPassword })}
                        />
                    }
                    onChangeText={ text => {
                        let data = FormValue
                        data.confirmPassword = text
                        this.setState({ FormValue: {...data} })
                    }}
                    autoCapitalize={"none"}
                />
                </KeyboardAvoidingView>
                {!registro ? <Button 
                    buttonStyle={{ backgroundColor: Colors.Menu }} 
                    containerStyle={styles.button} title="Registrar" 
                    onPress={() => this._renderRegistro()} 
                /> : 
                <View style={{ justifyContent:'center', marginVertical: normalize(20, 'height') }}>
                    <ActivityIndicator size="small" animating={true} color={Colors.primaryButton} />
                </View>}
                <Toast
                    ref="toastError"
                    style={{backgroundColor:'red'}}
                    position='bottom'
                    positionValue={normalize(toast, 'height')}
                    opacity={0.8}
                    textStyle={{color:'white'}}
                />
                <Toast
                    ref="toast"
                    position='bottom'
                    positionValue={normalize(toast, 'height')}
                    opacity={0.8}
                    textStyle={{color:'white'}}
                />
            </View>
  }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        paddingHorizontal: normalize(30),
        backgroundColor:'#FFF',
    },
    containerLogo:{
        alignItems:'center',
        marginVertical: normalize(25, 'height')
    },
    button:{
        marginVertical: normalize(20, 'height')
    },
    logo:{
        width: normalize(120),
        height: normalize(120, 'height')
    },
    input:{
        fontSize: normalize(16),
        height: normalize(40, 'height')
    }
})