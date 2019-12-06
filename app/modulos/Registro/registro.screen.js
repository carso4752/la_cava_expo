import React, { Component } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, StatusBar, Dimensions } from 'react-native';
import { Button, Image, Input, Icon } from 'react-native-elements';
import Colors from '../../theme/colors';
import * as Firebase from 'firebase';
import Toast, {DURATION} from 'react-native-easy-toast';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import normalize from 'react-native-normalize';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const DeviceScreen = Dimensions.get('screen')

export default class Registro extends Component {

    constructor(){
        super();

        this.state = {
            FormValue:{
                email: "",
                password: "",
                confirmPassword: ""
            },
            hideConfirmPassword: true,
            hidePassword: true
        }
    }

    _renderRegistro = () => {
        const { password, confirmPassword, email } = this.state.FormValue

        let mailformat = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;

        if(email == "" || password == "" || confirmPassword == ""){
            this.refs.toastError.show('Complete todos los campos', 1000);
        } else if(!mailformat.test(email)){
            this.refs.toastError.show('Correo electronico invalido', 1000);
        } else if(password.length < 6 || confirmPassword.length < 6){
            this.refs.toastError.show('La contraseña debe contener minimo 6 caracteres', 1000);
        } else if(password == confirmPassword){
            Firebase.auth().createUserWithEmailAndPassword(email, password).then(result => {
                this.refs.toast.show('Registro Exitoso', 500, () =>{
                    this.props.navigation.navigate('Login')
                });
            }).catch(err => {
                console.log("Error en el Registro", err)
                this.refs.toastError.show('El correo ya esta en uso', 1000);
            })
        } else{
            this.refs.toastError.show('Las contraseñas no coinciden', 1000);
        }
    }

    render() {
        const { FormValue, hideConfirmPassword, hidePassword } = this.state
        const { password, confirmPassword, email } = this.state.FormValue
        let toast = (DeviceScreen.height < 600 ? 130 : 180)
        return <>
            <StatusBar hidden={true} />
            <View style={styles.container}>
                <KeyboardAwareScrollView>
                <View style={styles.containerLogo}>
                    <Image
                        PlaceholderContent={<ActivityIndicator />}
                        source={require("../../assets/images/logo_laCava.png")}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>
                <Input
                    containerStyle={{ marginBottom: normalize(15, 'height') }}
                    placeholder='Example@mail.com'
                    label='Correo Electronico'
                    value={email}
                    inputStyle={styles.input}
                    rightIconContainerStyle={{ paddingRight: normalize(15) }}
                    rightIcon={
                        <Icon 
                        type='material-community'
                        name='at'
                        color='grey'
                        size={normalize(22)}
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
                        size={22}
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
                        size={normalize(22)}
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
                <Button 
                    buttonStyle={{ backgroundColor: Colors.Menu }} 
                    containerStyle={styles.button} title="Registrar" 
                    onPress={() => this._renderRegistro()} 
                />
                </KeyboardAwareScrollView>
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
        </>
  }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        paddingHorizontal: normalize(30),
        backgroundColor:'#FFF'
    },
    containerLogo:{
        alignItems:'center',
        marginVertical: normalize(25, 'height')
    },
    button:{
        marginVertical: normalize(20, 'height')
    },
    logo:{
        width: normalize(155),
        height: normalize(155, 'height')
    },
    input:{
        fontSize: normalize(16),
        height: normalize(40, 'height')
    }
})