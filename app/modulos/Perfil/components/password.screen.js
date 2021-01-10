import React, { Component } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { Button, Input, Icon } from 'react-native-elements';
import normalize from 'react-native-normalize';
import Colors from '../../../theme/colors';

class Password extends Component {
        
    constructor(){
        super();
        this.state = {
            hidePassword: true,
            password: null,
            hidePasswordConfirm: true,
            passwordConfirm: null,
            hidePasswordNew: true,
            passwordNew: null,
        }
    }

    render(){
        const { password, passwordConfirm, passwordNew, hidePassword, hidePasswordConfirm, hidePasswordNew } = this.state
        return <View style={styles.containerModal}>
            {Platform.OS === "ios" && <View style={{ alignItems: 'flex-end', paddingRight: normalize(5) }}>
                <Icon type='material-community' name='close' color={Colors.Menu} size={normalize(30)} onPress={() => {
                    this.props.cerrar()
                }} />
            </View>}
            <Input
                containerStyle={styles.containerInput}
                label={"Contraseña actual"}
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
            />
            <Input
                containerStyle={styles.containerInput}
                label={"Nueva contraseña"}
                placeholder={"Minimo 6 caracteres"}
                value={passwordNew}
                secureTextEntry={hidePasswordNew}
                password={true}
                inputStyle={styles.input}
                leftIconContainerStyle={{ paddingRight: normalize(15) }}
                leftIcon={
                    <Icon 
                    type='material-community'
                    name={hidePasswordNew ? 'eye-off-outline': 'eye'}
                    color='grey'
                    size={normalize(25)}
                    onPress={()=> this.setState({ hidePasswordNew: !hidePasswordNew })}
                    />
                }
                onChangeText={async text => {
                    await this.setState({ passwordNew: text })
                }}
                autoCapitalize={"none"}
            />
            <Input
                containerStyle={styles.containerInput}
                label={"Confirmar contraseña"}
                placeholder={"Minimo 6 caracteres"}
                value={passwordConfirm}
                secureTextEntry={hidePasswordConfirm}
                password={true}
                inputStyle={styles.input}
                leftIconContainerStyle={{ paddingRight: normalize(15) }}
                leftIcon={
                    <Icon 
                    type='material-community'
                    name={hidePasswordConfirm ? 'eye-off-outline': 'eye'}
                    color='grey'
                    size={normalize(25)}
                    onPress={()=> this.setState({ hidePasswordConfirm: !hidePasswordConfirm })}
                    />
                }
                onChangeText={async text => {
                    await this.setState({ passwordConfirm: text })
                }}
                autoCapitalize={"none"}
            />
            <Button
                buttonStyle={{ backgroundColor: Colors.Menu, marginTop: 10, marginBottom: 10 }}
                containerStyle={styles.button}
                title="Cambiar"
                onPress={async() => {
                    if(password && passwordNew && passwordConfirm){
                        this.props.guardar(password, passwordNew, passwordConfirm)
                    }
                }}
            />
        </View>
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
    },
    containerModal:{ 
        backgroundColor: '#FFF', 
        padding: normalize(15), 
        marginHorizontal: normalize(20)
    }
})

export default Password