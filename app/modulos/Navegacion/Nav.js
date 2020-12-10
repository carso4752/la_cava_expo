import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Colors from '../../theme/colors';
import {Image, Icon} from 'react-native-elements';
import normalize from 'react-native-normalize';
import ProductoScreen from '../Productos/productos.screen';
import HomeScreen from '../Home/home.screen';
import BuscadorScreen from '../Buscador/buscador.screen';
import PerfilScreen from '../Perfil/perfil.screen';
import RegistroScreen from '../Registro/registro.screen';
import LoginScreen from '../Login/login.screen';
import ShopScreen from '../Shop/shop.screen';
import PayUScreen from '../Shop/payU.screen';
import NotificacionesScreen from '../Notificaciones/index.screen'
import App from '../App/App';
import {View, Linking, Alert} from 'react-native';
import * as RootNavigation from './RootNavigation';
import WithBadge from './components/badge';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function renderWhatsapp(){
  let text = "Hola. Estoy interesad@ en... ";
  let phoneNumber = '+57 3137050608';
  let link = `whatsapp://send?text=${text}&phone=${phoneNumber}`;
  Linking.openURL(link).then(supported => {
      if (!supported) {
          Alert.alert('Instala la aplicación para brindarte una mejor experiencia');
      } else {
          return Linking.openURL(link);
      }
  }).catch(err => console.error(err));
}

function Carrito({item}) {
  return (
    <View
      style={{
        marginRight: normalize(10),
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: normalize(120),
      }}
    >
      <Icon
          name="whatsapp"
          type="material-community"
          size={normalize(28)}
          onPress={renderWhatsapp}
      />
      <WithBadge
        value="n"
        options={{}}
        Icon={
          <Icon
            name="bell-outline"
            type="material-community"
            size={normalize(28)}
            onPress={() => RootNavigation.navigate('Notificaciones')}
          />
        }
        onPress={() => RootNavigation.navigate('Notificaciones')}
      />
      <WithBadge
        value="s"
        options={{}}
        Icon={
          <Icon
            name="cart-outline"
            type="material-community"
            size={normalize(28)}
            onPress={() => RootNavigation.navigate('Shop')}
          />
        }
        onPress={() => RootNavigation.navigate('Shop')}
      />
      
    </View>
  );
}

function Logo() {
  return (
    <View style={{marginLeft: normalize(20)}}>
      <Image
        source={require('../../assets/images/logo_laCava.png')}
        style={{width: normalize(40), height: normalize(40, 'height')}}
        resizeMode="contain"
      />
    </View>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({navigation}) => ({
          title: 'La Cava',
          headerTitleAlign: 'left',
          headerLeft: () => <Logo />,
          headerRight: () => {
            return <Carrito />;
          },
        })}
      />
    </Stack.Navigator>
  );
}

function BuscadorStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Buscador"
        component={BuscadorScreen}
        options={({navigation}) => ({
          title: 'La Cava',
          headerTitleAlign: 'left',
          headerLeft: () => <Logo />,
          headerRight: () => {
            return <Carrito />;
          },
        })}
      />
    </Stack.Navigator>
  );
}

function ProductosStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Producto"
        component={ProductoScreen}
        options={({navigation}) => ({
          title: 'La Cava',
          headerTitleAlign: 'left',
          headerLeft: () => <Logo />,
          headerRight: () => {
            return <Carrito />;
          },
        })}
      />
    </Stack.Navigator>
  );
}

function PerfilStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Perfil"
        component={PerfilScreen}
        options={({navigation}) => ({
          title: 'La Cava',
          headerTitleAlign: 'left',
          headerLeft: () => <Logo />,
          headerRight: () => {
            return <Carrito />;
          },
        })}
      />
    </Stack.Navigator>
  );
}

function ShopStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Shop"
        component={ShopScreen}
        options={({navigation}) => ({
          title: 'Mis compras',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <View
              style={{
                marginLeft: normalize(20),
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Icon
                name={'arrow-left'}
                type={'material-community'}
                size={normalize(28)}
                onPress={() => navigation.navigate('Productos')}
              />
            </View>
          ),
        })}
      />
    </Stack.Navigator>
  );
}

function NotificacionesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PayU"
        component={NotificacionesScreen}
        options={({navigation}) => ({
          title: 'Notificaciones',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <View
              style={{
                marginLeft: normalize(20),
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Icon
                name={'arrow-left'}
                type={'material-community'}
                size={normalize(28)}
                onPress={() => navigation.navigate('Home')}
              />
            </View>
          ),
        })}
      />
    </Stack.Navigator>
  );
}

function PayUStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PayU"
        component={PayUScreen}
        options={({navigation}) => ({
          title: 'Pago en Linea',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <View
              style={{
                marginLeft: normalize(20),
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Icon
                name={'arrow-left'}
                type={'material-community'}
                size={normalize(28)}
                onPress={() => navigation.navigate('Shop')}
              />
            </View>
          ),
        })}
      />
    </Stack.Navigator>
  );
}

function AppTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        inactiveTintColor: 'black',
        activeTintColor: Colors.primary,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={({navigation}) => ({
          tabBarLabel: 'Inicio',
          tabBarIcon: ({color}) => (
            <Icon
              name={navigation.isFocused() ? 'gesture-tap' : 'home-outline'}
              type={'material-community'}
              size={normalize(28)}
              color={color}
            />
          ),
        })}
      />
      <Tab.Screen
        name="Buscar"
        component={BuscadorStack}
        options={({navigation}) => ({
          tabBarLabel: 'Buscar',
          tabBarIcon: ({color}) => (
            <Icon
              name={navigation.isFocused() ? 'keyboard' : 'magnify'}
              type={'material-community'}
              size={normalize(28)}
              color={color}
            />
          ),
        })}
      />
      <Tab.Screen
        name="Productos"
        component={ProductosStack}
        options={({navigation}) => ({
          tabBarLabel: 'Productos',
          tabBarIcon: ({color}) => {
            return (
              <Icon
                name={
                  navigation.isFocused() ? 'glass-cocktail' : 'tag-text-outline'
                }
                type={'material-community'}
                size={normalize(28)}
                color={color}
              />
            );
          },
        })}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilStack}
        options={({navigation}) => ({
          tabBarLabel: 'Perfil',
          tabBarIcon: ({color}) => (
            <Icon
              name={
                navigation.isFocused() ? 'human-greeting' : 'account-outline'
              }
              type={'material-community'}
              size={normalize(28)}
              color={color}
            />
          ),
        })}
      />
    </Tab.Navigator>
  );
}

function NavegacionAuth() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Registro"
        component={RegistroScreen}
        options={({navigation}) => ({
          title: '',
          headerLeft: () => (
            <View
              style={{
                marginLeft: normalize(20),
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Icon
                name={'arrow-left'}
                type={'material-community'}
                size={normalize(28)}
                onPress={() => navigation.navigate('Login')}
              />
            </View>
          ),
        })}
      />
      <Stack.Screen name="App" component={App} options={{headerShown: false}} />
    </Stack.Navigator>
  );
}

function NavegacionTabs({route, navigation}) {
  return (
    <Stack.Navigator
      initialRouteName="Tabs"
      screenOptions={{headerShown: false}}
    >
      <Stack.Screen name="Tabs" component={AppTabs} />
      <Stack.Screen name="Shop" component={ShopStack} />
      <Stack.Screen name="PayU" component={PayUStack} />
      <Stack.Screen name="Notificaciones" component={NotificacionesStack} />
    </Stack.Navigator>
  );
}

export {NavegacionAuth, NavegacionTabs};
