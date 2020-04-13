import React, { Component } from 'react';
import { Image, Icon, Button } from 'react-native-elements'
import normalize from 'react-native-normalize';
import { View, Text, StyleSheet, ScrollView, Dimensions, Modal, Platform, FlatList } from 'react-native';
import TouchableNative from '../shared/touchableNative';
import Colors from '../../theme/colors';
import { ActivityIndicator } from 'react-native-paper'

import { firebaseApp } from '../Database/Firebase'
import * as firebase from 'firebase';
import 'firebase/firestore'

const DeviceScreen = Dimensions.get('screen')
const desface = DeviceScreen.width > 320 ? true : false
const url_default = 'https://firebasestorage.googleapis.com/v0/b/lacava-a1dab.appspot.com/o/productos%2Fsin_imagen.jpeg?alt=media&token=c0205d4c-1ce8-4681-a3a1-e7bc4b08a4e8'
const limite = 6

export default class Productos extends Component {
    
    constructor(){
        super();
        this.state={
            productos: [],
            startProductos: null,
            cargando: false,
            totalProductos: 0,
            modalVisible: false,
            selectProd: [],
            cantidad: 1,
        }
    }

    async componentDidMount(){
        const db = firebase.firestore(firebaseApp);
        db.collection('tbl_productos').get().then(result =>{
            console.log("totalProductos:", result.size)
            this.setState({ totalProductos: result.size })
        });
        await this.cargarProductos();
    }
    
    renderModal = () => {
        const { modalVisible, cantidad } = this.state
        const { prod_costo, prod_nombre, prod_url, prod_estado } = this.state.selectProd
        let costo = (prod_costo * cantidad).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        return <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                this.setState({ modalVisible: !modalVisible})
            }}>
            <View style={styles.containerModal}>
                <View style={styles.modal}>
                    {Platform.OS === "ios" && <View style={{ alignItems:'flex-end', paddingRight: normalize(20) }}>
                        <Icon type='material-community' name='close-box-outline' color={Colors.Menu} size={normalize(30)} onPress={() => {
                            this.setState({ modalVisible: !modalVisible})
                        }} />
                    </View>}
                    <View style={{ alignItems:'center', marginBottom: normalize(15, 'height') }}>
                        <Image placeholderStyle={{ backgroundColor: 'white' }} style={styles.imageModal} resizeMode='stretch' source={{ uri: prod_url }} PlaceholderContent={<ActivityIndicator size="small" animating={true} color={Colors.primaryButton} />} /> 
                        <Text style={{ fontSize: normalize(16), marginTop: normalize(5, 'height')}}>{prod_nombre}</Text>
                    </View>
                    {prod_estado == true && <View style={{ flexDirection: 'row' , justifyContent: 'space-around', marginVertical: normalize(15, 'height') }}>
                        <View style={styles.cantidad}>
                            <Icon reverse  name='minus' type='material-community' color={Colors.accent} size={normalize(12)} onPress={()=>{
                                let restar = cantidad == 1 ? 1 : cantidad - 1 
                                this.setState({ cantidad: restar })
                            }} />
                            <Text style={styles.textCantidad}>{cantidad}</Text>
                            <Icon reverse name='plus' type='material-community' color={Colors.primaryButton} size={normalize(12)} onPress={()=>{
                                this.setState({ cantidad: cantidad + 1 })
                            }}/>
                        </View>
                        <Button title={"Agregar $" + costo} buttonStyle={{ backgroundColor: Colors.Menu }}/>
                    </View>}
                </View>
            </View>
        </Modal>
    }

    renderProductos = ({item, index}) => {
        const { modalVisible } = this.state
        let costo = (item.prod_costo).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        return <TouchableNative onPress={()=>{
                this.setState({ modalVisible: !modalVisible, selectProd: item })
            }}>
            <View style={styles.producto}>
                <Image placeholderStyle={{ backgroundColor: 'white' }} style={styles.imageProduct} resizeMode='contain' source={{ uri: item.prod_url }} PlaceholderContent={<ActivityIndicator size="small" animating={true} color={Colors.primaryButton} />} /> 
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                    <View style={{ flexGrow: 2 }}>
                        <Text ellipsizeMode={'tail'} numberOfLines={2} style={{ fontSize: normalize(16), paddingLeft: normalize(8) }}>{item.prod_nombre}</Text>
                        <Text ellipsizeMode={'tail'} numberOfLines={1} style={{ fontSize: normalize(14), paddingLeft: normalize(8) }}>${costo}</Text>
                    </View>
                </View>
            </View>
        </TouchableNative>
    }

    cargarProductos = async() => {
        let resultProductos = []
        const db = firebase.firestore(firebaseApp);
        const items = db.collection("tbl_productos").orderBy("prod_nombre", "asc").limit(12);

        await items.get().then(result =>{
            result.forEach(async element => {
                let data = element.data();
                let uid = data.prod_estado == true ? data.prod_imagen : data.prod_imagen_agotado;
                await firebase.storage().ref(`productos/${uid}.png`).getDownloadURL().then(result => {
                    data.prod_url = result
                }).catch((err)=>{
                    data.prod_url = url_default
                });
                resultProductos.push(data);
                if(resultProductos.length == result.size){
                    this.setState({ productos: resultProductos, startProductos: data })
                }
            });
        });
    }

    agregarProductos = async() => {
        const { productos, startProductos, totalProductos, cargando } = this.state
        productos.length < totalProductos && this.setState({ cargando: !cargando })
        let resultProductos = productos
        const db = firebase.firestore(firebaseApp);
        const items = db.collection("tbl_productos").where("prod_nombre", ">", startProductos.prod_nombre).orderBy("prod_nombre", "asc").limit(limite);
        
        await items.get().then(result =>{
            let resultCargados = result.size + productos.length
            result.forEach(async element => {
                let data = element.data();
                let uid = data.prod_estado == true ? data.prod_imagen : data.prod_imagen_agotado;
                await firebase.storage().ref(`productos/${uid}.png`).getDownloadURL().then(result => {
                    data.prod_url = result
                }).catch((err)=>{
                    data.prod_url = url_default
                });
                resultProductos.push(data);

                if(resultProductos.length == resultCargados){                    
                    this.setState({ productos: resultProductos, startProductos: data, cargando: !cargando })
                }
            });
        });
    }

    renderFooter = () =>{
        const { cargando, totalProductos, productos } = this.state
        let mensaje = (totalProductos == productos.length) ? 'No quedan productos por cargar' : '';
        if(cargando){
            return <View style={{ marginVertical: normalize(10, 'height'), alignItems:'center' }}>
                <ActivityIndicator size="small" animating={true} color={Colors.primaryButton} />
            </View>
        } else {
            return <Text>{mensaje}</Text>
        }
    }

    render() {
        const { productos } = this.state
        if(productos.length < limite ){
            return <View style={{ flex: 1, justifyContent:'center' }}>
                <ActivityIndicator size="small" animating={true} color={Colors.primaryButton} />
            </View>
        }
        return <>
            {this.renderModal()}
            <FlatList
                data={productos}
                numColumns={3}
                renderItem={this.renderProductos}
                keyExtractor={(item, index) => index.toString()}
                onEndReached={this.agregarProductos}
                onEndReachedThreshold={1}
                ListFooterComponent={this.renderFooter}
            />
        </>
    }
}

const styles = StyleSheet.create({
    producto:{
        marginVertical: normalize(10, 'height'),
        width: DeviceScreen.width/3.1,
        paddingLeft: normalize(desface ? 9 : 4),
        marginLeft: normalize(desface ? 5 : 2),
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
        backgroundColor: 'rgba(218,218,218, 0.8)'
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
    },
    cantidad:{
        borderWidth: 1,
        flexDirection: 'row', 
        alignItems:'center', 
        paddingBottom: normalize(2, 'height'), 
        borderRadius: normalize(5) 
    }
})