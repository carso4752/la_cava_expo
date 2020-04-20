import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Colors from '../../theme/colors'
import { Image, Icon } from 'react-native-elements'
import normalize from 'react-native-normalize';
import ProductoScreen from '../Productos/productos.screen';
import AgregarItemScreen from '../Productos/agregarItem.screen';
import HomeScreen from '../Home/home.screen';
import BuscadorScreen from '../Buscador/buscador.screen';
import PerfilScreen from '../Perfil/perfil.screen';
import RegistroScreen from '../Registro/registro.screen';
import LoginScreen from '../Login/login.screen';
import ShopScreen from '../Shop/shop.screen';
import App from '../App/App';
import { View } from 'react-native';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function Carrito(navigation){
  return <View style={{ marginRight: normalize(5), flexDirection:'row', justifyContent: 'space-around', width: normalize(80) }}>
      <Icon name="bell-outline" type="material-community" size={normalize(28)} onPress={() => navigation.navigate('Home')}/>
      <Icon name="cart-outline" type="material-community" size={normalize(28)} onPress={() => navigation.navigate('Home')}/>
  </View>
}

function Logo(){
  return <View style={{ marginLeft: normalize(20) }}>
    <Image
      source={require('../../assets/images/logo_laCava.png')}
      style={{ width: normalize(40), height: normalize(40, 'height') }}
      resizeMode="contain"
    />
  </View>
}

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={({ navigation }) => ({
        title:'La Cava',
        headerTitleAlign: 'left',
        headerLeft: () => (
          <Logo />
        ),
        headerRight: () => {
          return <Carrito navigation={navigation} />
        }
      })} />
    </Stack.Navigator>
  );
}


function BuscadorStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Buscador" component={BuscadorScreen} options={({ navigation }) => ({
        title:'La Cava',
        headerTitleAlign: 'left',
        headerLeft: () => (
          <Logo />
        ),
        headerRight: () => {
          return <Carrito navigation={navigation} />
        }
      })} />
    </Stack.Navigator>
  );
}

function ProductosStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Producto" component={ProductoScreen} options={({ navigation }) => ({
        title:'La Cava',
        headerTitleAlign: 'left',
        headerLeft: () => (
          <Logo />
        ),
        headerRight: () => {
          return <Carrito navigation={navigation} />
        }
      })} />
    </Stack.Navigator>
  );
}

function PerfilStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Perfil" component={PerfilScreen} options={({ navigation }) => ({
        title:'La Cava',
        headerTitleAlign: 'left',
        headerLeft: () => (
          <Logo />
        ),
        headerRight: () => {
          return <Carrito navigation={navigation} />
        }
      })} />
    </Stack.Navigator>
  );
}

function AppTabs() {
  return (
    <Tab.Navigator initialRouteName='Home'
      tabBarOptions={{
        inactiveTintColor: "black",
        activeTintColor: Colors.primary
      }}>
      <Tab.Screen name="Home" component={HomeStack} options={({ navigation }) => ({
        tabBarLabel: "Inicio",
        tabBarIcon: ({ color }) => (
          <Icon name={navigation.isFocused() ? 'gesture-tap' : 'home-outline'} type={'material-community'} size={normalize(28)} color={color} />
        )
      })} />
      <Tab.Screen name="Buscar" component={BuscadorStack} options={({ navigation }) => ({
        tabBarLabel: "Buscar",
        tabBarIcon: ({ color }) => (
          <Icon name={navigation.isFocused() ? 'keyboard' : 'magnify'} type={'material-community'} size={normalize(28)} color={color} />
        )
      })} />
      <Tab.Screen name="Productos" component={ProductosStack} options={({ navigation }) => ({
         tabBarLabel: "Productos",
         tabBarIcon: ({ color }) => {
           return <Icon name={navigation.isFocused() ? 'glass-cocktail' : 'tag-text-outline'} type={'material-community'} size={normalize(28)} color={color} />
         }
      })} />
      <Tab.Screen name="Perfil" component={PerfilStack} options={({ navigation }) => ({
        tabBarLabel: "Perfil",
        tabBarIcon: ({ color }) => (
          <Icon name={navigation.isFocused() ? 'human-greeting' : 'account-outline'} type={'material-community'} size={normalize(28)} color={color} />
        )
      })} />
    </Tab.Navigator>
  )
}

function NavegacionAuth() {
  return <Stack.Navigator initialRouteName="Login">
    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Registro" component={RegistroScreen} options={({ navigation }) => ({
      title: "",
      headerTitleAlign: 'center',
      headerLeft: () => (
        <View style={{ marginLeft: normalize(20), flexDirection: 'row', alignItems: 'center' }}>
          <Icon name={'arrow-left'} type={'material-community'} size={normalize(28)} onPress={() => navigation.navigate('Login')} />
        </View>
      ),
    })} />
    <Stack.Screen name="App" component={App} options={{ headerShown: false }} />
  </Stack.Navigator>
}

function NavegacionTabs({ route, navigation }) {
  return <Stack.Navigator initialRouteName="Tabs" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Tabs" component={AppTabs} />
    <Stack.Screen name="Item" component={AgregarItemScreen} options={({ navigation }) => ({
      title: "Agregar Producto",
      headerLeft: () => (
        <View style={{ marginLeft: normalize(20), flexDirection: 'row', alignItems: 'center' }}>
          <Icon name={'arrow-left'} type={'material-community'} size={normalize(28)} onPress={() => navigation.navigate('Login')} />
        </View>
      ),
    })} />
    <Stack.Screen name="Shop" component={ShopScreen} options={({ navigation }) => ({
      title: "Carrito de Compras",
      headerLeft: () => (
        <View style={{ marginLeft: normalize(20), flexDirection: 'row', alignItems: 'center' }}>
          <Icon name={'arrow-left'} type={'material-community'} size={normalize(28)} onPress={() => navigation.navigate('Productos')} />
        </View>
      ),
    })} />
  </Stack.Navigator>
}

export {
  NavegacionAuth,
  NavegacionTabs
}