import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';

export default class perfil extends Component{
    
    render(){        
        return <View style={styles.container}>
            <Text style={styles.textContainer}>Hola desde Perfil</Text>
            <Button containerStyle={{ margin: 10 }} title="ir a Registro" onPress={()=> this.props.navigation.navigate('Registro')}/>
        </View>
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems: "center",
        justifyContent:"center"
    },
    textContainer:{
        fontSize: 20
    }
})