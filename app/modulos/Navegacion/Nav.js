import React from 'react';
import { createAppContainer, createStackNavigator, createBottomTabNavigator, createSwitchNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome'
import IconM from 'react-native-vector-icons/MaterialCommunityIcons'
import Colors from '../../theme/colors'
import { Image } from 'react-native-elements'

import ProductoScreen from '../Productos/productos.screen';
import HomeScreen from '../Home/home.screen';
import BuscadorScreen from '../Buscador/buscador.screen';
import PerfilScreen from '../Perfil/perfil.screen';
import RegistroScreen from '../Registro/registro.screen';
import LoginScreen from '../Login/login.screen';
import { View } from 'react-native';

const HomeStack = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: ({ navigation }) => ({
      title: "Inicio",
      headerLeft: (
        <View style={{ marginLeft: 20 }}>
          <Image 
            source={require('../../assets/images/logo_laCava.png')} 
            style={{ width: 35, height: 35 }}
            resizeMode="contain"
          />
        </View>
      ),
      headerRight: (
        <View style={{ marginRight: 10 }}>
          <IconM name="cart" type="material-community" size={25} />
        </View>
      )
    })
  }
});

const BuscadorStack = createStackNavigator({
  Buscador: {
    screen: BuscadorScreen,
    navigationOptions: ({ navigation }) => ({
      title: "Buscador",
      headerLeft: (
        <View style={{ marginLeft: 20 }}>
          <Image 
            source={require('../../assets/images/logo_laCava.png')} 
            style={{ width: 35, height: 35 }}
            resizeMode="contain"
          />
        </View>
      ),
      headerRight: (
        <View style={{ marginRight: 10 }}>
          <IconM name="cart" type="material-community" size={25} />
        </View>
      )
    })
  }
});

const ProductosStack = createStackNavigator({
  Productos: {
    screen: ProductoScreen,
    navigationOptions: ({ navigation }) => ({
      title: "Productos",
      headerLeft: (
        <View style={{ marginLeft: 20 }}>
          <Image 
            source={require('../../assets/images/logo_laCava.png')} 
            style={{ width: 35, height: 35 }}
            resizeMode="contain"
          />
        </View>
      ),
      headerRight: (
        <View style={{ marginRight: 10 }}>
          <IconM name="cart" type="material-community" size={25} />
        </View>
      )
    })
  }
});

const PerfilStack = createStackNavigator({
  Perfil: {
    screen: PerfilScreen,
    navigationOptions: ({ navigation }) => ({
      title: "Perfil",
      headerLeft: (
        <View style={{ marginLeft: 20 }}>
          <Image 
            source={require('../../assets/images/logo_laCava.png')} 
            style={{ width: 35, height: 35 }}
            resizeMode="contain"
          />
        </View>
      ),
      headerRight: (
        <View style={{ marginRight: 10 }}>
          <IconM name="cart" type="material-community" size={25} />
        </View>
      )
    })
  }
});

const RegistroStack = createStackNavigator({
  Registro: {
    screen: RegistroScreen,
    navigationOptions: ({ navigation }) => ({
      title: "Registro",
      headerLeft: (
        <View style={{ marginLeft: 20, flexDirection: 'row', alignItems:'center' }}>
          <IconM name={'arrow-left'} size={25} onPress={ () => navigation.navigate('Login') } />  
        </View>
      ),
    })
  }
});

const RootStack = createBottomTabNavigator({
    Home:{
      screen: HomeStack,
      navigationOptions:({ navigation }) => ({
        tabBarLabel:"Inicio",
        tabBarIcon: ({ tintColor }) => (
          <Icon name={'home'} type={'font-awesome'} size={25} color={tintColor} />
        )
      })
    },
    Buscar:{
      screen: BuscadorStack,
      navigationOptions:({ navigation }) => ({
        tabBarLabel:"Buscar",
        tabBarIcon: ({ tintColor }) => (
          <Icon name={'search'} type={'font-awesome'} size={25} color={tintColor} />
        )
      })
    },
    Productos:{
      screen: ProductosStack,
      navigationOptions:({ navigation }) => ({
        tabBarLabel:"Productos",
        tabBarIcon: ({ tintColor }) => (
          <Icon name={'home'} type={'font-awesome'} size={25} color={tintColor} />
        )
      })
    },
    Perfil:{
      screen: PerfilStack,
      navigationOptions:({ navigation }) => ({
        tabBarLabel:"Perfil",
        tabBarIcon: ({ tintColor }) => (
          <Icon name={'user'} type={'font-awesome'} size={25} color={tintColor} />
        )
      })
    }
  },
  {
    initialRouteName:'Home',
    order:['Home','Buscar','Productos','Perfil'],
    tabBarOptions:{
      inactiveTintColor: "black",
      activeTintColor: Colors.primary
    }
  }
)

const AppNavigator = createSwitchNavigator({
  Login: LoginScreen,
  Tabs: RootStack,
  Registro: RegistroStack,
});

export default createAppContainer(AppNavigator)