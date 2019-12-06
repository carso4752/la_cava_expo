import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default class buscador extends Component {
    render() {
        return <View style={styles.container}>
            <Text style={styles.textContainer}>Resultados de busqueda</Text>
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