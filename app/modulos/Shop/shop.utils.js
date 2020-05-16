import {AsyncStorage} from 'react-native';

export async function getShop(uid) {
  try {
    const value = await AsyncStorage.getItem(uid);
    if (value !== null) {
      return JSON.parse(value);
    }
    return [];
  } catch (error) {
    console.log('Error', error);
  }
}

export async function setShop(uid, value) {
  try {
    await AsyncStorage.setItem(uid, JSON.stringify(value));
  } catch (error) {
    console.log('Error', error);
  }
}

export async function getPedidos() {
  try {
    const value = await AsyncStorage.getItem('Pedidos');
    if (value !== null) {
      return JSON.parse(value);
    }
    return [];
  } catch (error) {
    console.log('Error', error);
  }
}

export async function setPedidos(value) {
  try {
    await AsyncStorage.setItem('Pedidos', JSON.stringify(value));
  } catch (error) {
    console.log('Error', error);
  }
}

export async function getRol() {
  try {
    const value = await AsyncStorage.getItem('Role');

    return value;
  } catch (error) {
    console.log('Error', error);
  }
}

export async function setRol(value) {
  try {
    await AsyncStorage.setItem('Role', ""+value);
  } catch (error) {
    console.log('Error', error);
  }
}
