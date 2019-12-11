import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, Image } from  'react-native-elements';
import { SliderBox } from 'react-native-image-slider-box';
import normalize from 'react-native-normalize';
import * as firebase from 'firebase';
import TouchableNative from '../shared/touchableNative'

const DeviceWidth = Dimensions.get('screen').width
const banner = ['banner_1.png','banner_2.png','banner_3.png']

export default class home extends Component {

    constructor() {
        super();

        this.state = {
          images: []
        };
    }

    componentDidMount(){
        const { images } = this.state
        let data = images
        banner.map(async(value) => {
            await firebase.storage().ref(`banner/`+ value).getDownloadURL().then(url =>{
                data.push(url)
            })
            this.setState({ images: data })
        })
    }

    render(){
        let ancho = (DeviceWidth / 2) - normalize(10)
        return <View style={styles.container}>
            <ScrollView>
                <SliderBox sliderBoxHeight={normalize(170, 'height')} images={this.state.images} />
                <View style={{ paddingHorizontal: normalize(15), marginVertical: normalize(15, 'height') }}>
                    <Text style={{ fontSize: normalize(20), color:'white', borderBottomWidth: normalize(2, 'height'), borderColor: '#ccc' }}>Categorías</Text>
                </View>
                <View style={styles.categoria}>
                    <TouchableNative onPress={()=>{
                        this.props.navigation.navigate('Buscar', { categoria: 'AGUARDIENTE' })
                    }}>
                    <Image
                        source={require('../../assets/categorias/AGUARDIENTE.png')}
                        style={{ width: ancho, height: normalize(90, 'height') }}
                        resizeMode='center'
                    />
                    </TouchableNative>
                    <TouchableNative onPress={()=>{
                        this.props.navigation.navigate('Buscar', { categoria: 'CERVEZA' })
                    }}>
                    <Image
                        source={require('../../assets/categorias/CERVEZA.png')}
                        style={{ width: ancho, height: normalize(90, 'height') }}
                        resizeMode='center'
                    />
                    </TouchableNative>
                </View>
                <View style={styles.categoria}>
                    <TouchableNative onPress={()=>{
                        this.props.navigation.navigate('Buscar', { categoria: 'RON' })
                    }}>
                    <Image
                        source={require('../../assets/categorias/RON.png')}
                        style={{ width: ancho, height: normalize(90, 'height') }}
                        resizeMode='center'
                    />
                    </TouchableNative>
                    <TouchableNative onPress={()=>{
                        this.props.navigation.navigate('Buscar', { categoria: 'TEQUILA' })
                    }}>
                    <Image
                        source={require('../../assets/categorias/TEQUILA.png')}
                        style={{ width: ancho, height: normalize(90, 'height') }}
                        resizeMode='center'
                    />
                    </TouchableNative>
                </View>
                <View style={styles.categoria}>
                    <TouchableNative onPress={()=>{
                        this.props.navigation.navigate('Buscar', { categoria: 'WHISKY' })
                    }}>
                    <Image
                        source={require('../../assets/categorias/WHISKY.png')}
                        style={{ width: ancho, height: normalize(90, 'height') }}
                        resizeMode='center'
                    />
                    </TouchableNative>
                    <TouchableNative onPress={()=>{
                        this.props.navigation.navigate('Buscar', { categoria: 'VODKA' })
                    }}>
                    <Image
                        source={require('../../assets/categorias/VODKA.png')}
                        style={{ width: ancho, height: normalize(90, 'height') }}
                        resizeMode='center'
                    />
                    </TouchableNative>
                </View>
                <View style={styles.categoria}>
                    <TouchableNative onPress={()=>{
                        this.props.navigation.navigate('Buscar', { categoria: 'VINO' })
                    }}>
                    <Image
                        source={require('../../assets/categorias/VINO.png')}
                        style={{ width: ancho, height: normalize(90, 'height') }}
                        resizeMode='center'
                    />
                    </TouchableNative>
                    <TouchableNative onPress={()=>{
                        this.props.navigation.navigate('Buscar', { categoria: 'OTROS' })
                    }}>
                    <Image
                        source={require('../../assets/categorias/OTROS.png')}
                        style={{ width: ancho, height: normalize(90, 'height') }}
                        resizeMode='center'
                    />
                    </TouchableNative>
                </View>
            </ScrollView>
        </View>
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor:'#000',
    },
    categoria :{
        flexDirection: 'row',
        justifyContent:'space-around',
        marginBottom: normalize(3, 'height')
    }
})