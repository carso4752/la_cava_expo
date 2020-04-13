import React from 'react';
import { createAppContainer, createStackNavigator, createBottomTabNavigator, createSwitchNavigator } from 'react-navigation';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons'
import Colors from '../../theme/colors'
import { Image, Icon } from 'react-native-elements'
import normalize from 'react-native-normalize';
import ProductoScreen from '../Productos/productos.screen';
import HomeScreen from '../Home/home.screen';
import BuscadorScreen from '../Buscador/buscador.screen';
import PerfilScreen from '../Perfil/perfil.screen';
import RegistroScreen from '../Registro/registro.screen';
import LoginScreen from '../Login/login.screen';
import AgregarItemScreen from '../Productos/agregarItem.screen';
import { View } from 'react-native';

const HomeStack = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: ({ navigation }) => ({
      title: "Inicio",
      headerLeft: (
        <View style={{ marginLeft: normalize(20) }}>
          <Image 
            source={require('../../assets/images/logo_laCava.png')} 
            style={{ width: normalize(40), height: normalize(40, 'height') }}
            resizeMode="contain"
          />
        </View>
      ),
      headerRight: (
        <View style={{ marginRight: normalize(10) }}>
          <IconM name="cart-outline" type="material-community" size={normalize(28)} />
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
        <View style={{ marginLeft: normalize(20) }}>
          <Image 
            source={require('../../assets/images/logo_laCava.png')} 
            style={{ width: normalize(40), height: normalize(40, 'height') }}
            resizeMode="contain"
          />
        </View>
      ),
      headerRight: (
        <View style={{ marginRight: normalize(10) }}>
          <IconM name="cart-outline" type="material-community" size={normalize(28)} />
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
        <View style={{ marginLeft: normalize(20) }}>
          <Image 
            source={require('../../assets/images/logo_laCava.png')} 
            style={{ width: normalize(40), height: normalize(40, 'height') }}
            resizeMode="contain"
          />
        </View>
      ),
      headerRight: (
        <View style={{ marginRight: normalize(10) }}>
          <IconM name="cart-outline" type="material-community" size={normalize(28)} />
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
        <View style={{ marginLeft: normalize(20) }}>
          <Image 
            source={require('../../assets/images/logo_laCava.png')} 
            style={{ width: normalize(40), height: normalize(40, 'height') }}
            resizeMode="contain"
          />
        </View>
      ),
      headerRight: (
        <View style={{ marginRight: normalize(10) }}>
          <IconM name="cart-outline" type="material-community" size={normalize(28)} />
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
        <View style={{ marginLeft: normalize(20), flexDirection: 'row', alignItems:'center' }}>
          <IconM name={'arrow-left'} size={normalize(28)} onPress={ () => navigation.navigate('Login') } />  
        </View>
      ),
    })
  }
});

const AgregarItemStack = createStackNavigator({
  Item: {
    screen: AgregarItemScreen,
    navigationOptions: ({ navigation }) => ({
      title: "Agregar Producto",
      headerLeft: (
        <View style={{ marginLeft: normalize(20), flexDirection: 'row', alignItems:'center' }}>
          <IconM name={'arrow-left'} size={normalize(28)} onPress={ () => navigation.navigate('Productos') } />  
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
          <Icon name={navigation.isFocused() ? 'home-circle' : 'home-outline'} type={'material-community'} size={normalize(28)} color={tintColor} />
        )
      })
    },
    Buscar:{
      screen: BuscadorStack,
      navigationOptions:({ navigation }) => ({
        tabBarLabel:"Buscar",
        tabBarIcon: ({ tintColor }) => (
          <Icon name={navigation.isFocused() ? 'keyboard' : 'magnify'} type={'material-community'} size={normalize(28)} color={tintColor} />
        )
      })
    },
    Productos:{
      screen: ProductosStack,
      navigationOptions:({ navigation }) => ({
        tabBarLabel:"Productos",
        tabBarIcon: ({ tintColor }) => (
          <Icon name={navigation.isFocused() ? 'glass-cocktail' : 'tag-text-outline'} type={'material-community'} size={normalize(28)} color={tintColor} />
        )
      })
    },
    Perfil:{
      screen: PerfilStack,
      navigationOptions:({ navigation }) => ({
        tabBarLabel:"Perfil",
        tabBarIcon: ({ tintColor }) => (
          <Icon name={navigation.isFocused() ? 'human-greeting' : 'account-outline'} type={'material-community'} size={normalize(28)} color={tintColor} />
        )
      })
    }
  },
  {
    initialRouteName:'Productos',
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
  Item: AgregarItemStack
});

export default createAppContainer(AppNavigator)