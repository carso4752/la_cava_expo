import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ListItem, Icon, colors } from 'react-native-elements';
import normalize from 'react-native-normalize';
import { getShop, setShop } from './shop.utils';
import Colors from '../../theme/colors';

export default class Shop extends Component {
  
    state = {
        compras: [],
    }

    componentDidMount(){
        this.cargarProductos();
        const unsubscribe = this.props.navigation.addListener('focus', async () => {
            this.cargarProductos();
        });
    }

    cargarProductos = async() =>{
        const items = await getShop();
        this.setState({ compras: items })
    }

    eliminarProducto = async(item) =>{
        var data = await getShop();
        let index = data.findIndex(e => e.prod_imagen == item.prod_imagen)
        data.splice(index, 1)
        await setShop(data);
    }

    renderResultados(){
        const { compras } = this.state
        let total = 0
        return <>
            { compras.length == 0 ? <View style={styles.result}>
                <View style={{ marginTop: normalize(10, 'height'), marginBottom: normalize(3, 'height') }}>
                    <Icon type="material-community" name="cart-arrow-down" size={normalize(80)} color={'grey'}/>
                </View>
                <Text style={{ textAlign:'center', fontSize: normalize(18) }}>Agrega productos al carrito</Text>
            </View> :
            <ScrollView>
                {(compras).map((item, index) => {
                    total = total + (item.prod_costo * item.prod_cantidad);
                    let costo = '$' + (item.prod_costo * item.prod_cantidad).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                    return <ListItem
                        key={index}
                        titleStyle={{ fontSize: normalize(15) }}
                        title={item.prod_nombre + ' X ' + item.prod_cantidad}
                        subtitle={costo}
                        leftAvatar={{
                            title: item.prod_nombre[0],
                            size:'medium',
                            source: { uri: item.prod_url },
                            overlayContainerStyle: { backgroundColor: 'white' },
                            imageProps: { resizeMode: 'contain' }
                        }}
                        rightIcon={
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent:'space-between' }}>
                                <View style={styles.cantidad}>
                                    <Icon reverse name='minus' type='material-community' color={Colors.accent} size={normalize(12)} onPress={() => {
                                        let restar = compras
                                        restar[index].prod_cantidad = item.prod_cantidad == 1 ? 1 : item.prod_cantidad - 1;
                                        this.setState({ compras: restar })
                                    }} />
                                    <Icon reverse name='plus' type='material-community' color={Colors.primaryButton} size={normalize(12)} onPress={() => {
                                        let sumar = compras
                                        sumar[index].prod_cantidad = item.prod_cantidad + 1; 
                                        this.setState({ compras: sumar })
                                    }} />
                                </View>
                                <Icon type="material-community" name="trash-can-outline" size={normalize(32)} onPress={async() => {
                                    await this.eliminarProducto(item)
                                    this.cargarProductos();
                                }}/>
                            </View>
                        }
                    />
                })}
            </ScrollView> }
            <View style={styles.total}>
                <Text style={{ fontSize: normalize(25), color:'#fff' }}>TOTAL</Text>
                <Text style={{ fontSize: normalize(22), color:'#fff' }}>$ {(total).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</Text>
            </View>
        </>
    }

    render() {
        return <View style={styles.container}>
            {this.renderResultados()}
        </View>
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1, 
        backgroundColor:'white'
    },
    result:{
        flex: 1,
        marginTop: normalize(15, 'height'), 
        paddingHorizontal: normalize(15),
        justifyContent:'center'
    },
    total:{
        justifyContent:'space-between',
        flexDirection:'row',
        backgroundColor: Colors.primary,
        paddingHorizontal: normalize(15),
        paddingVertical: normalize(5, 'height')
    },
    cantidad: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    }
})