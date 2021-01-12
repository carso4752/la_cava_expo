import React, { Component } from 'react';
import { Image, Icon, Button } from 'react-native-elements'
import normalize from 'react-native-normalize';
import { View, Text, StyleSheet, Alert, Dimensions, Modal, Platform, FlatList } from 'react-native';
import TouchableNative from '../shared/touchableNative';
import Colors from '../../theme/colors';
import { ActivityIndicator } from 'react-native-paper';
import { getShop, setShop } from '../Shop/shop.utils'
import { firebaseApp } from '../Database/Firebase'
import * as firebase from 'firebase';
import 'firebase/firestore'
import { inject, observer } from "mobx-react";

const DeviceScreen = Dimensions.get('screen')
const HeightScreen = Dimensions.get('window').height
const desface = DeviceScreen.width > 320 ? true : false
const url_default = 'https://firebasestorage.googleapis.com/v0/b/lacava-a1dab.appspot.com/o/productos%2Fsin_imagen.jpg?alt=media&token=45b98d82-76c2-44a1-a8b4-911acc895e56'
const limite = 15
var db = null

class Productos extends Component {

    constructor() {
        super();
        this.state = {
            productos: null,
            startProductos: null,
            cargando: true,
            modalVisible: false,
            selectProd: [],
            cantidad: 1,
            categoria: null,
            refreshing: false,
            id: null
        }
    }

    async componentDidMount() {
        const { params } = this.props.route
        let user = firebase.auth().currentUser;
        await this.setState({ id: user.uid })
        if (params && params.categoria) {
            await this.setState({ categoria: params.categoria })
        }
        const unsubscribe = this.props.navigation.addListener('focus', async () => {
            const { params } = this.props.route
            if (params && params.categoria) {
                await this.setState({ categoria: params.categoria, productos: null })
            }
            this.cargarProductos();
        });    
            
        db = firebase.firestore(firebaseApp);
        this.cargarProductos();
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
                    {Platform.OS === "ios" && <View style={{ alignItems: 'flex-end', paddingRight: normalize(20) }}>
                        <Icon type='material-community' name='chevron-down' color={Colors.Menu} size={normalize(30)} onPress={() => {
                            this.setState({ modalVisible: !modalVisible })
                        }} />
                    </View>}
                    <View style={{ alignItems: 'center', marginBottom: normalize(15, 'height') }}>
                        <Image placeholderStyle={{ backgroundColor: 'white' }} style={styles.imageModal} resizeMode='contain' source={{ uri: prod_url }} />
                        <Text style={{ fontSize: normalize(15), textAlign: 'center', marginHorizontal: normalize(25), marginTop: normalize(5, 'height') }}>{prod_nombre}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: normalize(15, 'height') }}>
                        <View style={styles.cantidad}>
                            <Icon reverse name='minus' type='material-community' color={Colors.accent} size={normalize(12)} onPress={() => {
                                let restar = cantidad == 1 ? 1 : cantidad - 1
                                this.setState({ cantidad: restar })
                            }} />
                            <Text style={styles.textCantidad}>{cantidad}</Text>
                            <Icon reverse name='plus' type='material-community' color={Colors.primaryButton} size={normalize(12)} onPress={() => {
                                this.setState({ cantidad: cantidad + 1 })
                            }} />
                        </View>
                        <Button title={"Agregar $" + costo} buttonStyle={{ backgroundColor: Colors.Menu }} onPress={() => {
                            this.agregarCarrito(selectProd, cantidad)
                            this.setState({ modalVisible: !modalVisible, cantidad: 1 })
                        }} />
                    </View>
                </View>
            </View>
        </Modal>
    }

    urlImagen = (uid, index) => {
        firebase.storage().ref(`productos/${uid}.png`).getDownloadURL().then(result => {
            const { productos } = this.state
            let item = productos[index]
            let id = item.prod_imagen;

            if (item.prod_estado) {
                item.prod_url = result;
                item.prod_url_agotado = item.prod_url_agotado ? item.prod_url_agotado : '';
            } else {
                item.prod_url = item.prod_url ? item.prod_url : '';
                item.prod_url_agotado = result;
            }
            this.updateData(id, item)

        }).catch((err) => {
            let { productos } = this.state
            console.log("err", err.message_)
        });
    }

    updateData = (id, item) => {
        db.doc(`tbl_productos/${id}`).set(item).then(() => {
            console.log("Actualización correcta", id)
        }).catch((err) => {
            console.log("Error Actualización", err.message_)
        })
    }

    renderProductos = ({ item, index }) => {
        try {
            const { modalVisible } = this.state
            let arrayBusqueda = item.prod_nombre.split(" ");
            let url_producto = url_default
            if (item.prod_estado) {
                if (item.prod_url) {
                    url_producto = item.prod_url;
                } else {
                    this.urlImagen(item.prod_imagen, index)
                }
            } else {
                if (item.prod_url_agotado) {
                    url_producto = item.prod_url_agotado;
                } else {
                    this.urlImagen(item.prod_imagen_agotado, index)
                }
            }
            if (!item.prod_busqueda || (item.prod_busqueda.length !== arrayBusqueda.length)) {
                let id = item.prod_imagen;
                item.prod_busqueda = arrayBusqueda;
                this.updateData(id,item)
            }
            let costo = (item.prod_costo).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            return <TouchableNative onPress={() => {
                if (item.prod_estado) {
                    this.setState({ modalVisible: !modalVisible, selectProd: item })
                } else {
                    Alert.alert("Producto agotado")
                }
            }}>
                <View style={styles.pintarProduct}>
                    <Image placeholderStyle={{ backgroundColor: 'white' }} style={styles.imageProduct} resizeMode='contain' source={{ uri: url_producto }} PlaceholderContent={<ActivityIndicator size="small" animating={true} color={Colors.primaryButton} />} />
                    <Text ellipsizeMode={'tail'} numberOfLines={2} style={{ fontSize: normalize(12), paddingLeft: normalize(8) }}>{item.prod_nombre}</Text>
                    <Text ellipsizeMode={'tail'} numberOfLines={1} style={{ fontSize: normalize(13), paddingLeft: normalize(8) }}>${costo}</Text>
                </View>
            </TouchableNative>
        } catch (err) {
            console.log("err", err.message_)
        }
    }

    cargarProductos = async () => {
        const { categoria, cargando } = this.state
        let resultProductos = []

        const items = categoria ?
            db.collection("tbl_productos").where("prod_tipo", "==", categoria).orderBy("prod_nombre", "asc").limit(limite) :
            db.collection("tbl_productos").orderBy("prod_nombre", "asc").limit(limite);
        await items.get().then(result => {
            if (result.docs.length == limite) {
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

    agregarProductos = async () => {
        const { startProductos, productos, cargando, categoria } = this.state
        let resultProductos = productos

        const items = categoria ?
            db.collection("tbl_productos").where("prod_tipo", "==", categoria).orderBy("prod_nombre", "asc").startAfter(startProductos.prod_nombre).limit(limite) :
            db.collection("tbl_productos").orderBy("prod_nombre", "asc").startAfter(startProductos.prod_nombre).limit(limite);

        await items.get().then(result => {
            if (result.docs.length > 0) {
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

    renderFooter = () => {
        return <View style={{ marginVertical: normalize(10, 'height'), alignItems: 'center' }}>
            {this.state.cargando ? <ActivityIndicator size="small" animating={true} color={Colors.primaryButton} /> :
                <Text>No quedan productos por cargar</Text>}
        </View>
    }

    agregarCarrito = async (item, cantidad) => {
        const { setShopBadge } = this.props.store;
        const { id } = this.state
        let data = await getShop(id);
        let encontro = data.find(e => e.prod_imagen == item.prod_imagen)
        if (encontro) {
            let index = data.findIndex(e => e.prod_imagen == item.prod_imagen)
            encontro.prod_cantidad = encontro.prod_cantidad + cantidad
            data[index] = encontro
        } else {
            item.prod_cantidad = cantidad
            data.push(item)
        }
        await setShop(id, data);
        setShopBadge(data.length);
    }

    refreshProductos = async () => {
        const { refreshing } = this.state
        this.setState({ refreshing: !refreshing });
        let resultProductos = []

        const items = db.collection("tbl_productos").orderBy("prod_nombre", "asc").limit(limite);
        await items.get().then(result => {
            this.setState({ startProductos: result.docs[result.docs.length - 1].data() })

            result.forEach(element => {
                resultProductos.push(element.data());
            });
            this.setState({ productos: resultProductos, refreshing: refreshing, cargando: true })
        });
    }

    render() {
        const { productos, refreshing } = this.state
        if (!productos || refreshing) {
            return <View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator size="small" animating={true} color={Colors.primaryButton} />
            </View>
        }
        return <View style={styles.container}>
            {this.renderModal()}
            <FlatList
                data={productos}
                numColumns={3}
                renderItem={this.renderProductos}
                keyExtractor={(item, index) => index.toString()}
                onEndReached={this.agregarProductos}
                onEndReachedThreshold={0.3}
                ListFooterComponent={this.renderFooter}
                refreshing={refreshing}
                onRefresh={this.refreshProductos}
            />
        </View>
    }
}

export default inject("store")(observer(Productos));

const styles = StyleSheet.create({
    pintarProduct: {
        marginVertical: normalize(10, 'height'),
        width: DeviceScreen.width / 3.1,
        paddingHorizontal: normalize(desface ? 9 : 4),
    },
    imageProduct: {
        width: normalize(110),
        height: normalize(80, 'height')
    },
    imageModal: {
        width: normalize(160),
        height: normalize(130, 'height'),
    },
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    containerModal: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(218,218,218, 0.8)'
    },
    modal: {
        backgroundColor: 'rgba(255,255,255, 0.9)',
        marginHorizontal: normalize(5),
        borderTopLeftRadius: normalize(30),
        borderTopRightRadius: normalize(30),
        paddingTop: normalize(20, 'height'),
    },
    textCantidad: {
        fontSize: normalize(25),
        fontWeight: 'bold',
        marginHorizontal: normalize(20),
    },
    cantidad: {
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: normalize(2, 'height'),
        borderRadius: normalize(5)
    }
})