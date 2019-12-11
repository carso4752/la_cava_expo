import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import normalize from 'react-native-normalize';
import * as firebase from 'firebase'


export default class perfil extends Component{
    
    render(){        
        return <View style={styles.container}>
            <Text style={styles.textContainer}>Cerrar sesión</Text>
            <Icon raised type='material-community' name='power' color='red' size={normalize(25)} onPress={()=>{
                firebase.auth().signOut()
                this.props.navigation.navigate('Login')
            }} />
        </View>
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'row',
        alignItems: "center",
        justifyContent:"center"
    },
    textContainer:{
        fontSize: 20
    }
})