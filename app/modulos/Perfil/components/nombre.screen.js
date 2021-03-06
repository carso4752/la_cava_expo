import React, { Component } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { Button, Input, Icon } from 'react-native-elements';
import normalize from 'react-native-normalize';
import Colors from '../../../theme/colors';

class Nombre extends Component {
        
    constructor(){
        super();
        this.state = {
            usuario: null,
        }
    }

    async componentDidMount(){        
        await this.setState({ usuario: this.props.data })
    }
    
    render(){
        const { usuario } = this.state
        return <View style={styles.containerModal}>
            {Platform.OS === "ios" && <View style={{ alignItems: 'flex-end', paddingRight: normalize(5) }}>
                <Icon type='material-community' name='close' color={Colors.Menu} size={normalize(30)} onPress={() => {
                    this.props.cerrar()
                }} />
            </View>}
            <Input
                containerStyle={styles.containerInput}
                label={"Nombre de usuario"}
                placeholder={"Ingrese nombre de usuario"}
                value={usuario && usuario.displayName ? usuario.displayName : ''}
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
                    data.displayName = text;
                    await this.setState({ usuario: {...data} })
                }}
                autoCapitalize={"none"}
            />
            <Button
                buttonStyle={{ backgroundColor: Colors.Menu, marginTop: 5 }}
                containerStyle={styles.button}
                title="Cambiar"
                onPress={() => {
                    this.props.guardar(usuario)
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

export default Nombre