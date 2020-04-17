import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import IconM from 'react-native-vector-icons/MaterialCommunityIcons'
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
import App from '../App/App';
import { View } from 'react-native';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{
        title: "Inicio",
        headerLeft: () => (
          <View style={{ marginLeft: normalize(20) }}>
            <Image
              source={require('../../assets/images/logo_laCava.png')}
              style={{ width: normalize(40), height: normalize(40, 'height') }}
              resizeMode="contain"
            />
          </View>
        ),
        headerRight: () => (
          <View style={{ marginRight: normalize(10) }}>
            <IconM name="cart-outline" type="material-community" size={normalize(28)} />
          </View>
        )
      }} />
    </Stack.Navigator>
  );
}


function BuscadorStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Buscador" component={BuscadorScreen} options={{
        title: "Buscador",
        headerLeft: () => (
          <View style={{ marginLeft: normalize(20) }}>
            <Image
              source={require('../../assets/images/logo_laCava.png')}
              style={{ width: normalize(40), height: normalize(40, 'height') }}
              resizeMode="contain"
            />
          </View>
        ),
        headerRight: () => (
          <View style={{ marginRight: normalize(10) }}>
            <IconM name="cart-outline" type="material-community" size={normalize(28)} />
          </View>
        )
      }} />
    </Stack.Navigator>
  );
}

function ProductosStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Productos" component={ProductoScreen} options={{
        title: "Productos",
        headerLeft: () => (
          <View style={{ marginLeft: normalize(20) }}>
            <Image
              source={require('../../assets/images/logo_laCava.png')}
              style={{ width: normalize(40), height: normalize(40, 'height') }}
              resizeMode="contain"
            />
          </View>
        ),
        headerRight: () => (
          <View style={{ marginRight: normalize(10) }}>
            <IconM name="cart-outline" type="material-community" size={normalize(28)} />
          </View>
        )
      }} />
    </Stack.Navigator>
  );
}

function PerfilStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Perfil" component={PerfilScreen} options={{
        title: "Perfil",
        headerLeft: () => (
          <View style={{ marginLeft: normalize(20) }}>
            <Image
              source={require('../../assets/images/logo_laCava.png')}
              style={{ width: normalize(40), height: normalize(40, 'height') }}
              resizeMode="contain"
            />
          </View>
        ),
        headerRight: () => (
          <View style={{ marginRight: normalize(10) }}>
            <IconM name="cart-outline" type="material-community" size={normalize(28)} />
          </View>
        )
      }} />
    </Stack.Navigator>
  );
}


function AppTabs() {
  return (
    <Tab.Navigator initialRouteName='Buscar'
      tabBarOptions={{
        inactiveTintColor: "black",
        activeTintColor: Colors.primary
      }}>
      <Tab.Screen name="Home" component={HomeStack} navigationOptions={({ navigation }) => ({
        tabBarLabel: "Inicio",
        tabBarIcon: ({ tintColor }) => (
          <Icon name={navigation.isFocused() ? 'home-circle' : 'home-outline'} type={'material-community'} size={normalize(28)} color={tintColor} />
        )
      })} />
      <Tab.Screen name="Buscar" component={BuscadorStack} navigationOptions={({ navigation }) => ({
        tabBarLabel: "Buscar",
        tabBarIcon: ({ tintColor }) => (
          <Icon name={navigation.isFocused() ? 'glass-cocktail' : 'tag-text-outline'} type={'material-community'} size={normalize(28)} color={tintColor} />
        )
      })} />
      <Tab.Screen name="Productos" component={ProductosStack} navigationOptions={({ navigation }) => ({
        tabBarLabel: "Productos",
        tabBarIcon: ({ tintColor }) => (
          <Icon name={navigation.isFocused() ? 'glass-cocktail' : 'tag-text-outline'} type={'material-community'} size={normalize(28)} color={tintColor} />
        )
      })} />
      <Tab.Screen name="Perfil" component={PerfilStack} navigationOptions={({ navigation }) => ({
        tabBarLabel: "Perfil",
        tabBarIcon: ({ tintColor }) => (
          <Icon name={navigation.isFocused() ? 'human-greeting' : 'account-outline'} type={'material-community'} size={normalize(28)} color={tintColor} />
        )
      })} />
    </Tab.Navigator>
  )
}

function NavegacionAuth() {
  return <Stack.Navigator initialRouteName="Login">
    <Stack.Screen name="Login" component={LoginScreen} options={({ navigation }) => ({
      title: "Login"
    })} />
    <Stack.Screen name="Registro" component={RegistroScreen} options={({ navigation }) => ({
      title: "Registro",
      headerLeft: () => (
        <View style={{ marginLeft: normalize(20), flexDirection: 'row', alignItems: 'center' }}>
          <IconM name={'arrow-left'} size={normalize(28)} onPress={() => navigation.navigate('Login')} />
        </View>
      ),
    })} />
    <Stack.Screen name="App" component={App} options={{ headerShown: false }} />
  </Stack.Navigator>
}

function NavegacionTabs() {
  return <Stack.Navigator initialRouteName="Tabs" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Tabs" component={AppTabs} />
    <Stack.Screen name="Item" component={AgregarItemScreen} options={({ navigation }) => ({
      title: "Agregar Producto",
      headerLeft: () => (
        <View style={{ marginLeft: normalize(20), flexDirection: 'row', alignItems: 'center' }}>
          <IconM name={'arrow-left'} size={normalize(28)} onPress={() => navigation.navigate('Login')} />
        </View>
      ),
    })} />
  </Stack.Navigator>
}

export {
  NavegacionAuth,
  NavegacionTabs
}