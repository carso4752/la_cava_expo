import React, { Component } from 'react';
import { Image, Icon, Button } from 'react-native-elements'
import normalize from 'react-native-normalize';
import { View, Text, StyleSheet, Alert, Dimensions, Modal, Platform, FlatList } from 'react-native';
import TouchableNative from '../shared/touchableNative';
import Colors from '../../theme/colors';
import { ActivityIndicator } from 'react-native-paper'

import { firebaseApp } from '../Database/Firebase'
import * as firebase from 'firebase';
import 'firebase/firestore'

const DeviceScreen = Dimensions.get('screen')
const desface = DeviceScreen.width > 320 ? true : false
const url_default = 'https://firebasestorage.googleapis.com/v0/b/lacava-a1dab.appspot.com/o/productos%2Fsin_imagen.jpg?alt=media&token=45b98d82-76c2-44a1-a8b4-911acc895e56'
const limite = 12

export default class Productos extends Component {
    
    constructor(){
        super();
        this.state={
            productos: null,
            startProductos: null,
            cargando: true,
            modalVisible: false,
            selectProd: [],
            cantidad: 1,
            categoria: null
        }
    }

    componentDidMount(){
        console.log("params", this.props.route.params?.categoria)
        this.cargarProductos();
    }
    
    renderModal = () => {
        const { modalVisible, cantidad } = this.state
        const { prod_costo, prod_nombre, prod_url } = this.state.selectProd
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
                    <View style={{ flexDirection: 'row' , justifyContent: 'space-around', marginVertical: normalize(15, 'height') }}>
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
                    </View>
                </View>
            </View>
        </Modal>
    }
    
    urlImagen = (uid, index) =>{
        firebase.storage().ref(`productos/${uid}.png`).getDownloadURL().then(result => {
            const { productos } = this.state
            let item = productos[index]
            let id = item.prod_imagen;
            
            if(item.prod_estado){
                item.prod_url = result;
                item.prod_url_agotado = item.prod_url_agotado ? item.prod_url_agotado : '';
            } else {
                item.prod_url = item.prod_url ? item.prod_url : '';
                item.prod_url_agotado = result;
            }
            this.updateData(id, item)

        }).catch((err)=>{
            let { productos } = this.state
            productos[index].prod_url = url_default
            productos[index].prod_url_agotado = url_default
        });
    }

    updateData = (id, item) =>{
        const db = firebase.firestore(firebaseApp);
        db.doc(`tbl_productos/${id}`).set(item).then(()=>{
            console.log("Actualización correcta", id)
        }).catch((err)=>{
            console.log("Error Actualización", err)
        })
    }

    renderProductos = ({item, index}) => {
        try {
            const { modalVisible } = this.state
            if (item.prod_estado){
                if(!item.prod_url){
                    this.urlImagen(item.prod_imagen, index)
                }
            } else {
                if(!item.prod_url_agotado){
                    this.urlImagen(item.prod_imagen_agotado, index)
                }
            }
            let costo = (item.prod_costo).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            return <TouchableNative onPress={()=>{
                    if(item.prod_estado){
                        this.setState({ modalVisible: !modalVisible, selectProd: item })
                    } else {
                        Alert.alert("Producto agotado")
                    }
                }}>
                <View style={styles.pintarProduct}>
                    <Image placeholderStyle={{ backgroundColor: 'white' }} style={styles.imageProduct} resizeMode='contain' source={{ uri: item.prod_estado == true ? item.prod_url : item.prod_url_agotado }} PlaceholderContent={<ActivityIndicator size="small" animating={true} color={Colors.primaryButton} />} /> 
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                        <View style={{ flexGrow: 2 }}>
                            <Text ellipsizeMode={'tail'} numberOfLines={2} style={{ fontSize: normalize(16), paddingLeft: normalize(8) }}>{item.prod_nombre}</Text>
                            <Text ellipsizeMode={'tail'} numberOfLines={1} style={{ fontSize: normalize(14), paddingLeft: normalize(8) }}>${costo}</Text>
                        </View>
                    </View>
                </View>
            </TouchableNative>
        } catch (error) {
            console.log("item", item)
            console.log("error", error)
        }
    }

    cargarProductos = async() => {
        const { categoria } = this.state
        let resultProductos = []
        const db = firebase.firestore(firebaseApp);
        const items = categoria ?
            db.collection("tbl_productos").where("prod_tipo", "==", categoria).orderBy("prod_nombre", "asc").limit(limite):
            db.collection("tbl_productos").orderBy("prod_nombre", "asc").limit(limite);
        await items.get().then(result =>{
            this.setState({ totalProductos: result.size, startProductos: result.docs[result.docs.length - 1].data() })
            
            result.forEach(element => {
                resultProductos.push(element.data());
            });
            this.setState({ productos: resultProductos })
        });
    }

    agregarProductos = async() => {
        const { startProductos, productos, cargando, categoria } = this.state
        let resultProductos = productos
        
        const db = firebase.firestore(firebaseApp);
        const items = categoria ?
            db.collection("tbl_productos").where("prod_tipo", "==", categoria).orderBy("prod_nombre", "asc").startAfter(startProductos.prod_nombre).limit(limite):
            db.collection("tbl_productos").orderBy("prod_nombre", "asc").startAfter(startProductos.prod_nombre).limit(limite);
        
        await items.get().then(result =>{
            if(result.docs.length > 0){
                this.setState({ startProductos: result.docs[result.docs.length - 1].data() })
            } else {
                this.setState({ cargando: !cargando })
            }
            
            result.forEach(element => {
                resultProductos.push(element.data());
            });
            this.setState({ productos: resultProductos })
        });
    }

    renderFooter = () =>{
        return <View style={{ marginVertical: normalize(10, 'height'), alignItems:'center' }}>
            {this.state.cargando ? <ActivityIndicator size="small" animating={true} color={Colors.primaryButton} /> :
            <Text>No quedan productos por cargar</Text>}
        </View>
    }

    render() {
        const { productos } = this.state
        if(!productos){
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
                onEndReachedThreshold={0.5}
                ListFooterComponent={this.renderFooter}
            />
        </>
    }
}

const styles = StyleSheet.create({
    pintarProduct:{
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