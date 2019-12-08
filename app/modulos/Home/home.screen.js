import React, { Component, useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Card, Icon, Text, Button, Image } from  'react-native-elements';
import { SliderBox } from 'react-native-image-slider-box';
import Colors from '../../theme/colors';
import normalize from 'react-native-normalize';

const DeviceWidth = Dimensions.get('screen').width

export default class home extends Component {

    constructor() {
        super();

        this.state = {
          images: [
            'https://source.unsplash.com/1024x768/?nature',
            'https://source.unsplash.com/1024x768/?water',
            'https://source.unsplash.com/1024x768/?girl',
            'https://source.unsplash.com/1024x768/?tree'
          ]
        };
    }

    render(){
        let ancho = DeviceWidth - 20
        console.log(this.state.images)
        return <View style={styles.container}>
            <ScrollView>
                <SliderBox sliderBoxHeight={normalize(150, 'height')} images={this.state.images} />
                <View style={{ paddingHorizontal: normalize(15), marginVertical: normalize(10, 'height') }}>
                    <Text style={{ fontSize: normalize(18), color:'black', fontWeight:'bold', borderBottomWidth: normalize(2, 'height'), borderColor: '#ccc' }}>Categorías</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent:'flex-end', marginTop: normalize(5, 'height') }}>
                    <TouchableOpacity>
                    <View style={styles.categoria}>
                        <Image
                            source={require('../../assets/categorias/AGUARDIENTE.png')}
                            style={{ height: normalize(100, 'height') }}
                            resizeMode="contain" 
                        />
                    </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    categoria :{
        flex: 1,
        backgroundColor: 'red',
        marginHorizontal: normalize(10)
    }
})