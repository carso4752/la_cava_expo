import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator, StatusBar, Text, Dimensions } from 'react-native';
import { Button, Image, Input, Icon } from 'react-native-elements';
import Colors from '../../theme/colors';
import * as Firebase from 'firebase';
import Toast, {DURATION} from 'react-native-easy-toast';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import normalize from 'react-native-normalize';

const DeviceScreen = Dimensions.get('screen')

export default class Login extends Component {
    
    constructor(){
        super();
        this.state = {
            FormValue:{
              email: "",
              password: ""
            },
            login: null,
            hidePassword: true
        }
    }

    componentDidMount() {
        this.validarLogin()
    }

    validarLogin(){
        Firebase.auth().onAuthStateChanged(user => {
            let login = user ? true : false
            this.setState({ login })
        })
    }

    _renderIngreso(){
        const { password, email } = this.state.FormValue

        let mailformat = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;

        if(email == "" || password == ""){
            this.refs.toastError.show('Complete todos los campos', 1000);
        } else if(!mailformat.test(email)){
            this.refs.toastError.show('Correo electronico invalido', 1000);
        } else if (password.length < 6){
            this.refs.toastError.show('La contraseña debe contener minimo 6 caracteres', 1000);
        } else {
            Firebase.auth().signInWithEmailAndPassword(email, password).then(result => {
                this.refs.toast.show('Login Exitoso', 500, () =>{
                    this.props.navigation.navigate('Home')
                });
            }).catch(err => {
                console.log("Error en el Login", err)
                this.refs.toastError.show('Usuario y/o contraseña invalido', 1000);
            })
        }
    }

    render(){
        const { login, FormValue, hidePassword } = this.state
        const { password, email } = this.state.FormValue
        let toast = (DeviceScreen.height < 600 ? 90 : 130)
        if (login == null){
            return <View style={{ flex: 1, justifyContent:'center' }}>
                <ActivityIndicator size="large" animating={true} color={Colors.primary} />
            </View>
        }
        if(login){
            this.props.navigation.navigate('Home')
        }
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
                    placeholder='Ingrese correo electronico'
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
                    placeholder='Ingrese la contraseña'
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
                <Button
                    buttonStyle={{ backgroundColor: Colors.Menu }}
                    containerStyle={styles.button}
                    title="Iniciar Sesion"
                    onPress={this._renderIngreso.bind(this)}
                />
                <Text style={{ color: Colors.primaryText, alignSelf: 'center' }}>
                    ¿Aún no tienes una cuenta?
                    <Text 
                        style={{ fontWeight: 'bold', color: Colors.primaryButton }}
                        onPress={()=> this.props.navigation.navigate('Registro')}
                    > Registrate</Text>
                </Text>
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
        marginVertical: normalize(50,'height')
    },
    button:{
        marginVertical: normalize(20, 'height')
    },
    logo:{
        width: normalize(180),
        height: normalize(180, 'height')
    },
    input:{
        fontSize: normalize(16),
        height: normalize(40, 'height')
    }
});