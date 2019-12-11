import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { SearchBar, ListItem } from 'react-native-elements';
import normalize from 'react-native-normalize';

export default class Buscador extends Component {
  
    state ={
        cargando: false,
        textBuscador: "",
        resultadosSugerencias: false,
    }

    componentDidMount(){
    }
    
    renderResultados(){
        if(this.state.resultadosSugerencias){
            return <ScrollView>
                <View>
                {(this.state.resultadosSugerencias || []).map((item, index) => {
                    return <ListItem 
                        key={index}
                        title={item.nombreOpcion}
                        subtitle={item.tipo}
                        bottomDivider
                    />
                })}
                </View> 
            </ScrollView>
        } else{
            return <View style={{ marginTop: normalize(15) }}>
                <Text style={{ textAlign:'center' }}>Resultados de la búsqueda</Text>
            </View>
        }
    }

    render() {
        return (
        <View style={styles.container}>
            <SearchBar
                placeholder={"Buscar..."}
                value={this.state.textBuscador}
                round={true}
                showLoading={this.state.cargando}
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
                    if(this.state.textBuscador){
                        await this.setState({ cargando: true })
                        db.consultarSugerencias(this.state.textBuscador).then((resultadosSugerencias)=>{
                            this.setState({ resultadosSugerencias, cargando: false })
                        });
                    } else {
                        Alert.alert("Alerta", "Se debe ingresar información para busqueda")
                    }
                }}
                />
        </View>
        );
    }
}

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
    }
})