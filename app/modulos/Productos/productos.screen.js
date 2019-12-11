import React, { Component } from 'react';
import { Image, Icon, Button, colors } from 'react-native-elements'
import normalize from 'react-native-normalize';
import { View, Text, StyleSheet, ScrollView, Dimensions, Modal, Platform } from 'react-native';
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
        let IOS = Platform.OS === "ios"
        console.log(Platform)
        const { modalVisible, cantidad } = this.state
        const { precio, nombre } = this.state.selectProd

        return <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                this.setState({ modalVisible: !modalVisible})
        }}>
            <View style={styles.containerModal}>
                <View style={styles.modal}>
                    {Platform.OS === "ios" && <Icon type='material-community' name='close' color={Colors.Menu} size={normalize(25)} />}
                    <View style={{ alignItems:'center', marginBottom: normalize(40, 'height') }}>
                        <Image style={styles.imageModal} resizeMode='cover' source={require('../../assets/categorias/OTROS.png')} /> 
                        <Text style={{ fontSize: normalize(18)}}>Producto: {nombre}</Text>
                    </View>
                    <View style={{ marginBottom: normalize(40, 'height') }}>
                        <Text style={{ fontSize: normalize(18)}}>Precio Total: $ {precio*cantidad}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' , justifyContent: 'space-around', marginVertical: normalize(5, 'height') }}>
                        <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.textCantidad}>{cantidad}</Text>
                        </View>
                        <Button title="Agregar " containerStyle={{ justifyContent: 'center' }} buttonStyle={{ backgroundColor: Colors.Menu }} iconRight={true} icon={
                            <Icon type='material-community' name='send' color={'#FFF'} size={normalize(20)} /> 
                        }/>
                    </View>
                </View>
            </View>
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
                            <Image style={styles.imageProduct} resizeMode='cover' source={require('../../assets/categorias/OTROS.png')} /> 
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
        width: normalize(190),
        height: normalize(150, 'height')
    },
    containerModal:{
        flex: 1, 
        justifyContent:'flex-end', 
        backgroundColor: 'rgba(170,183,184, 0.5)',
    },
    modal:{
        backgroundColor: '#FFF', 
        marginHorizontal: normalize(5), 
        borderTopLeftRadius: normalize(15),
        borderTopRightRadius: normalize(15),
        paddingTop: normalize(20, 'height'),
    },
    textCantidad:{
        fontSize: normalize(30),
        fontWeight: 'bold',
        borderWidth: normalize(1),
    }
})