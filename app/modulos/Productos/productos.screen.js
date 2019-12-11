import React, { Component } from 'react';
import { Image, Icon, Button, colors } from 'react-native-elements'
import normalize from 'react-native-normalize';
import { View, Text, StyleSheet, ScrollView, Dimensions, Modal, Platform, ImageBackground } from 'react-native';
import TouchableNative from '../shared/touchableNative'
import Colors from '../../theme/colors'

const DeviceScreen = Dimensions.get('screen')
const desface = DeviceScreen.width > 320 ? true : false

const product = [{
    precio: "10000",
    nombre: "Cerveza1"
},{
    precio: "20000",
    nombre: "Cerveza2"
},{
    precio: "30000",
    nombre: "Cerveza3"
},{
    precio: "40000",
    nombre: "Cerveza4"
},{
    precio: "50000",
    nombre: "Cerveza5"
},{
    precio: "60000",
    nombre: "Cerveza6"
},{
    precio: "70000",
    nombre: "Cerveza7"
},{
    precio: "80000",
    nombre: "Cerveza8"
}]

export default class productos extends Component {
    
    constructor(){
        super();
        this.state={
            modalVisible: false,
            selectProd: [],
            cantidad: 1
        }

    }

    renderModal(){
        const { modalVisible, cantidad } = this.state
        const { precio, nombre } = this.state.selectProd
        let costo = (precio*cantidad).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        return <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                this.setState({ modalVisible: !modalVisible})
        }}>
            <ImageBackground style={{ width: '100%', height: '100%'}} resizeMode='cover' source={require('../../../assets/splash.png')}> 
                <View style={styles.containerModal}>
                    <View style={styles.modal}>
                        {Platform.OS === "ios" && <Icon type='material-community' name='close' color={Colors.Menu} size={normalize(25)} />}
                        <View style={{ alignItems:'center', marginBottom: normalize(15, 'height') }}>
                            <Image style={styles.imageModal} resizeMode='stretch' source={require('../../assets/productos/AGUARDIENTE-ANT-BOTELLA-SIN-AZUCAR.png')} /> 
                            <Text style={{ fontSize: normalize(16), marginTop: normalize(5, 'height')}}>{nombre}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' , justifyContent: 'space-around', marginVertical: normalize(15, 'height') }}>
                            <View style={{ flexDirection: 'row', alignItems:'center', paddingBottom: normalize(2, 'height'), borderWidth: 0.3, borderRadius: normalize(5) }}>
                                <Icon reverse  name='minus' type='material-community' color={Colors.accent} size={normalize(12)} onPress={()=>{
                                    let restar = cantidad == 1 ? 1 : cantidad - 1 
                                    this.setState({ cantidad: restar })
                                }} />
                                <Text style={styles.textCantidad}>{cantidad}</Text>
                                <Icon reverse name='plus' type='material-community' color={Colors.primaryButton} size={normalize(12)} onPress={()=>{
                                    this.setState({ cantidad: cantidad + 1 })
                                }}/>
                            </View>
                            <Button title={"Agregar $"+costo} buttonStyle={{ backgroundColor: Colors.Menu }}/>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        </Modal>
    }

    render() {
        const { modalVisible } = this.state
        return <ScrollView>
            {this.renderModal()}
            <View style={styles.container}>
                {product.map((item, index)=>{
                    let costo = (item.precio).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                    return <View key={"filtro_"+ index} style={styles.producto}>
                        <Image placeholder='Hola' containerStyle={{ borderWidth: 0.2, borderRadius: normalize(5)}} style={styles.imageProduct} resizeMode='contain' source={require('../../assets/productos/AGUARDIENTE-ANT-BOTELLA-SIN-AZUCAR.png')} /> 
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <View style={{ flexGrow: 2 }}>
                                <Text style={{ fontSize: normalize(16) }}>{item.nombre}</Text>
                                <Text style={{ fontSize: normalize(12) }}>$ {costo}</Text>
                            </View>
                            <View style={{ flexGrow: 1 }}>
                                <Icon type='material-community' name='plus-circle' color={Colors.Menu} size={normalize(25)} onPress={()=>{
                                    this.setState({ modalVisible: !modalVisible, selectProd: item })
                                }} />
                            </View>
                        </View>
                    </View>
                })}
            </View>
        </ScrollView>
    }
}

const styles = StyleSheet.create({
    container:{
        flexDirection:'row', 
        marginVertical: normalize(5, 'height'), 
        flexWrap: 'wrap', 
        flexShrink: 1,
    },
    producto:{
        marginVertical: normalize(10, 'height'),
        width: DeviceScreen.width/3.1,
        paddingLeft: normalize(desface ? 9 : 4),
        marginLeft: normalize(desface ? 5 : 3),
    },
    imageProduct:{
        width: normalize(110),
        height: normalize(80, 'height')
    },
    imageModal:{
        width: normalize(160),
        height: normalize(130, 'height')
    },
    containerModal:{
        flex: 1, 
        justifyContent:'flex-end', 
    },
    modal:{
        backgroundColor: 'rgba(255,255,255, 0.9)', 
        marginHorizontal: normalize(5), 
        borderTopLeftRadius: normalize(30),
        borderTopRightRadius: normalize(30),
        paddingTop: normalize(20, 'height'),
    },
    textCantidad:{
        fontSize: normalize(25),
        fontWeight: 'bold',
        marginHorizontal: normalize(20),
    }
})