import React, { Component, useState } from 'react'
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native'
import { Card, Icon, Text, Button, Image } from  'react-native-elements'
import { SliderBox } from 'react-native-image-slider-box';
import Colors from '../../theme/colors'

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
        console.log(this.state.images)
        return <View style={styles.container}>
            <ScrollView>
                <SliderBox images={this.state.images} />
                <View style={{ paddingHorizontal: 15, marginTop: 10, marginBottom: 10 }}>
                    <Text style={{ fontSize: 18, color:'black', borderBottomWidth: 2, borderColor: '#ccc' }}>Categorías</Text>
                </View>
                <Image
                    source={require('../../assets/images/Logo.png')}
                    style={{ width: 410, height: 390 }}
                    resizeMode="contain"
                >
                <View style={{ flexDirection: 'row', justifyContent:'flex-end', marginTop: 5 }}>
                    <TouchableOpacity>
                    <View style={{ flexDirection: 'row',alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.8)', borderTopLeftRadius: 35, borderBottomLeftRadius: 35, borderWidth: 1, borderColor:'#ccc' }}>
                        <Icon reverse name="beer" type="material-community" size={25} color='#D5DBDB' />
                        <View style={{ width: DeviceWidth - 100, paddingHorizontal: 5 }}>
                            <Text h4 style={{  color:'white' }}>Aguardientes</Text>
                            <Text numberOfLines={1} ellipsizeMode='tail' style={{ color:'white', fontSize: 12 }}>Pilsen, Aguila, Club Colombia, Corona, Budweiser, Heineken, Sol</Text>
                        </View>
                    </View>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', justifyContent:'flex-end', marginTop: 5 }}>
                    <TouchableOpacity>
                    <View style={{ flexDirection: 'row',alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.8)', borderTopLeftRadius: 35, borderBottomLeftRadius: 35, borderWidth: 1, borderColor:'#ccc' }}>
                        <Icon reverse name="cup" type="material-community" size={25} color='#F39C12' />
                        <View style={{ width: DeviceWidth - 100, paddingHorizontal: 5 }}>
                            <Text h4 style={{  color:'white' }}>Rones</Text>
                            <Text numberOfLines={1} ellipsizeMode='tail' style={{ color:'white', fontSize: 12 }}>Pilsen, Aguila, Club Colombia, Corona, Budweiser, Heineken, Sol</Text>
                        </View>
                    </View>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', justifyContent:'flex-end', marginTop: 5 }}>
                    <TouchableOpacity>
                    <View style={{ flexDirection: 'row',alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.8)', borderTopLeftRadius: 35, borderBottomLeftRadius: 35, borderWidth: 1, borderColor:'#ccc' }}>
                        <Icon reverse name="glass-stange" type="material-community" size={25} color='#52BE80' />
                        <View style={{ width: DeviceWidth - 100, paddingHorizontal: 5 }}>
                            <Text h4 style={{  color:'white' }}>Tequilas</Text>
                            <Text numberOfLines={1} ellipsizeMode='tail' style={{ color:'white', fontSize: 12 }}>Pilsen, Aguila, Club Colombia, Corona, Budweiser, Heineken, Sol</Text>
                        </View>
                    </View>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', justifyContent:'flex-end', marginTop: 5 }}>
                    <TouchableOpacity>
                    <View style={{ flexDirection: 'row',alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.8)', borderTopLeftRadius: 35, borderBottomLeftRadius: 35, borderWidth: 1, borderColor:'#ccc' }}>
                        <Icon reverse name="glass-wine" type="material-community" size={25} color='#C40A91' />
                        <View style={{ width: DeviceWidth - 100, paddingHorizontal: 5 }}>
                            <Text h4 style={{  color:'white' }}>Vinos</Text>
                            <Text numberOfLines={1} ellipsizeMode='tail' style={{ color:'white', fontSize: 12 }}>Pilsen, Aguila, Club Colombia, Corona, Budweiser, Heineken, Sol</Text>
                        </View>
                    </View>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', justifyContent:'flex-end', marginTop: 5, marginBottom: 5 }}>
                    <TouchableOpacity>
                    <View style={{ flexDirection: 'row',alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.8)', borderTopLeftRadius: 35, borderBottomLeftRadius: 35, borderWidth: 1, borderColor:'#ccc' }}>
                        <Icon reverse name="glass-mug" type="material-community" size={25} color='#F1C40F' />
                        <View style={{ width: DeviceWidth - 100, paddingHorizontal: 5 }}>
                            <Text h4 style={{  color:'white' }}>Cervezas</Text>
                            <Text numberOfLines={1} ellipsizeMode='tail' style={{ color:'white', fontSize: 12 }}>Pilsen, Aguila, Club Colombia, Corona, Budweiser, Heineken, Sol</Text>
                        </View>
                    </View>
                    </TouchableOpacity>
                </View>
                </Image>
            </ScrollView>
        </View>
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    }
})