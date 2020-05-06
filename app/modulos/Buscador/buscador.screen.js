import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, Modal, Platform, Dimensions } from 'react-native';
import { SearchBar, ListItem, Icon, Button, Image } from 'react-native-elements';
import normalize from 'react-native-normalize';
import Colors from '../../theme/colors';
import { ActivityIndicator } from 'react-native-paper';
import { getShop, setShop } from '../Shop/shop.utils'
import { inject, observer } from 'mobx-react';
import { firebaseApp } from '../Database/Firebase'
import * as firebase from 'firebase';
import 'firebase/firestore'
import { FireSQL } from 'firesql'

var fireSql = null
const HeightScreen = Dimensions.get('window').height
const url_default = 'https://firebasestorage.googleapis.com/v0/b/lacava-a1dab.appspot.com/o/productos%2Fsin_imagen.jpg?alt=media&token=45b98d82-76c2-44a1-a8b4-911acc895e56'

class Buscador extends Component {
  
    state = {
        cargando: false,
        textBuscador: "",
        resultados: false,
        modalVisible: false,
        cantidad: 1,
        selectProd: []
    }

    async componentDidMount(){
        fireSql = new FireSQL(firebase.firestore(firebaseApp));
    }

    renderResultados(){
        const { resultados, cargando, modalVisible } = this.state
        if(cargando){
            return <View style={{ flex: 1, justifyContent:'center' }}>
                <ActivityIndicator size="small" animating={true} color={Colors.primaryButton} />
            </View>
        }
        if(resultados){
            if(resultados.length == 0){
                return <View style={styles.result}>
                    <View style={{ marginTop: normalize(10, 'height'), marginBottom: normalize(3, 'height') }}>
                        <Icon type="material-community" name="close-circle" size={normalize(45)} color={'#EF4C4C'}/>
                    </View>
                    <Text style={{ textAlign:'center', fontSize: normalize(20) }}>¡Sin Resultados!</Text>
                    <Text style={{ textAlign:'center', fontSize: normalize(14) }}>No encontramos productos con esa descripción</Text>
                    <Text style={{ textAlign:'center', fontSize: normalize(13) }}>Intentelo nuevamente o buscá con las categorías</Text>
                </View>
            }
            return <ScrollView>
                {(resultados).map((item, index) => {
                    let costo = '$' + (item.prod_costo).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                    let url = item.prod_url ? item.prod_url : url_default;
                    return <ListItem
                        key={index}
                        titleStyle={{ fontSize: normalize(15) }}
                        title={item.prod_nombre}
                        subtitle={costo}
                        leftAvatar={{
                            title: item.prod_nombre[0],
                            size:'medium',
                            source: { uri: url },
                            overlayContainerStyle: { backgroundColor: 'white' },
                            imageProps: { resizeMode: 'contain' }
                        }}
                        rightIcon={
                            <Icon type="material-community" name="chevron-right" />
                        }
                        onPress={()=>{
                            this.setState({ modalVisible: !modalVisible, selectProd: item })
                        }}
                        bottomDivider
                    />
                })}
            </ScrollView>
        } else{
            return <View style={styles.result}>
                <Text style={{ textAlign:'center', fontSize: normalize(15) }}>Resultados de la búsqueda</Text>
            </View>
        }
    }

    renderModal = () => {
        const { modalVisible, cantidad, selectProd } = this.state
        const { prod_costo, prod_nombre, prod_url } = this.state.selectProd
        let costo = (prod_costo * cantidad).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        return <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                this.setState({ modalVisible: !modalVisible })
            }}>
            <View style={styles.containerModal}>
                <View style={styles.modal}>
                    {Platform.OS === "ios" && <View style={{ alignItems:'flex-end', paddingRight: normalize(25) }}>
                        <Icon type='material-community' name='chevron-down' color={Colors.Menu} size={normalize(30)} onPress={() => {
                            this.setState({ modalVisible: !modalVisible })
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
                        <Button title={"Agregar $" + costo} buttonStyle={{ backgroundColor: Colors.Menu }} onPress={()=>{
                            this.agregarCarrito(selectProd, cantidad)
                            this.setState({ modalVisible: !modalVisible, cantidad: 1 })
                        }}/>
                    </View>
                </View>
            </View>
        </Modal>
    }

    agregarCarrito = async(item, cantidad) =>{
        const { setShopBadge } = this.props.store
        let data = await getShop();
        let encontro = data.find(e => e.prod_imagen == item.prod_imagen)
        if(encontro){
            let index = data.findIndex(e => e.prod_imagen == item.prod_imagen)
            encontro.prod_cantidad = encontro.prod_cantidad + cantidad
            data[index] = encontro
        } else {
            item.prod_cantidad = cantidad
            data.push(item)
        }
        await setShop(data);
        setShopBadge(data.length)
    }

    render() {
        const { textBuscador, cargando } = this.state        
        return <View style={styles.container}>
            <SearchBar
                placeholder={"Buscar..."}
                value={textBuscador}
                round={true}
                containerStyle={styles.containerSearch}
                inputContainerStyle={styles.inputSearch}
                keyboardType={'web-search'}
                returnKeyType={'search'}
                inputStyle={{ fontSize: normalize(16), backgroundColor:'white', color:'#000' }}
                onChangeText={(text)=>{
                    let textBuscador = text
                    this.setState({ textBuscador })
                }}
                onSubmitEditing={async()=>{
                    if(textBuscador){
                        this.setState({ cargando: !cargando })
                        let texto = textBuscador.toUpperCase();
                        const productos = fireSql.query(`SELECT * FROM tbl_productos WHERE prod_nombre LIKE '${texto}%'`)
                        await productos.then(result =>{
                            this.setState({ resultados: result, cargando: false })
                        }).catch(err => {
                            console.log("err", err)
                        });
                    } else {
                        Alert.alert("Alerta", "Se debe ingresar información para la busqueda")
                    }
                }}
                />
                {this.renderResultados()}
                {this.renderModal()}
        </View>
    }
}

export default inject("store")(observer(Buscador))

const styles = StyleSheet.create({
    container:{
        flex: 1, 
        backgroundColor:'white'
    },
    inputSearch:{
        height: normalize(40, 'height'), 
        backgroundColor:'white', 
        borderTopWidth: normalize(1, 'height'), 
        borderBottomWidth: normalize(1, 'height'), 
        borderWidth: 1
    },
    containerSearch:{
        backgroundColor:'white', 
        borderBottomWidth: normalize(0, 'height'), 
        borderTopWidth: normalize(0, 'height')
    },
    result:{
        marginTop: normalize(15, 'height'), 
        paddingHorizontal: normalize(15)
    },
    containerModal:{
        height: normalize(HeightScreen, 'height'), 
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
    },
    imageModal:{
        width: normalize(160),
        height: normalize(130, 'height')
    }
})