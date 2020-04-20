import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import normalize from 'react-native-normalize';
import { getShop, setShop } from './shop.utils'

export default class Shop extends Component {
  
    state = {
        compras: [],
    }

    componentDidMount(){
        this.cargarProductos();
    }

    cargarProductos = async() =>{
        const items = await getShop();
        this.setState({ compras: items })
    }

    eliminarProducto = (item) =>{

    }

    renderResultados(){
        const { compras } = this.state
        if(compras){
            let total = 0
            return <>
                <ScrollView>
                    {(compras).map((item, index) => {
                        total = total + (item.prod_costo * item.prod_cantidad);
                        let costo = '$' + (item.prod_costo * item.prod_cantidad).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                        return <ListItem
                            key={index}
                            titleStyle={{ fontSize: normalize(15) }}
                            title={item.prod_nombre}
                            subtitle={costo}
                            leftAvatar={{
                                title: item.prod_nombre[0],
                                size:'medium',
                                source: { uri: item.prod_url },
                                overlayContainerStyle: { backgroundColor: 'white' },
                                imageProps: { resizeMode: 'contain' }
                            }}
                            rightIcon={
                                <Icon type="material-community" name="trash-can" color="#EF4C4C" />
                            }
                            onPress={()=>{
                                this.eliminarProducto(item)
                            }}
                        />
                    })}
                </ScrollView>
                <View>
                    <Text>Total {total}</Text>
                </View>
            </>
        } else{
            return <View style={styles.result}>
                <Text style={{ textAlign:'center', fontSize: normalize(15) }}>Agrega productos al carrito</Text>
            </View>
        }
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
        marginTop: normalize(15, 'height'), 
        paddingHorizontal: normalize(15)
    }
})