import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default class productos extends Component {
    render() {
        return <View style={styles.container}>
            <Text style={styles.textContainer}>Hola desde productos</Text>
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