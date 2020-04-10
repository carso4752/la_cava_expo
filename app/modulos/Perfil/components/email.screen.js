import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Input, Icon } from 'react-native-elements';
import normalize from 'react-native-normalize';
import Colors from '../../../theme/colors';

class Email extends Component {
        
    constructor(){
        super();
        this.state = {
            usuario: null,
            hidePassword: true,
            password: null,
            confirm: false
        }
    }

    async componentDidMount(){        
        await this.setState({ usuario: this.props.data })
    }

    render(){
        const { usuario, hidePassword, password, confirm } = this.state
        let tituloBtn = confirm ? "Confirmar" : "Cambiar";
        return <>
            <Input
                containerStyle={styles.containerInput}
                label={"Correo electrónico"}
                placeholder={"Ingrese correo electrónico"}
                value={usuario && usuario.email ? usuario.email : ''}
                inputStyle={styles.input}
                leftIconContainerStyle={{ paddingRight: normalize(15) }}
                leftIcon={{
                    type: "material-community",
                    name: "account-circle",
                    color: 'grey',
                    size: normalize(25)
                }}
                onChangeText={async text => {
                    let data = usuario
                    data.email = text;
                    await this.setState({ usuario: {...data} })
                }}
                autoCapitalize={"none"}
                keyboardType='email-address'
            />
            {confirm && <Input
                containerStyle={styles.containerInput}
                label={"Contraseña requerida"}
                placeholder={"Ingrese la contraseña"}
                value={password}
                secureTextEntry={hidePassword}
                password={true}
                inputStyle={styles.input}
                leftIconContainerStyle={{ paddingRight: normalize(15) }}
                leftIcon={
                    <Icon 
                    type='material-community'
                    name={hidePassword ? 'eye-off-outline': 'eye'}
                    color='grey'
                    size={normalize(25)}
                    onPress={()=> this.setState({ hidePassword: !hidePassword })}
                    />
                }
                onChangeText={async text => {
                    await this.setState({ password: text })
                }}
                autoCapitalize={"none"}
            />}
            <Button
                buttonStyle={{ backgroundColor: Colors.Menu, marginTop: confirm ? 10 : 5, marginBottom: confirm ? 10 : 0 }}
                containerStyle={styles.button}
                title={tituloBtn}
                onPress={async() => {
                    if(confirm){
                        if(password){
                            this.props.guardar(usuario, password)
                        }
                    } else {
                       await this.setState({ confirm: true })
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

export default Email