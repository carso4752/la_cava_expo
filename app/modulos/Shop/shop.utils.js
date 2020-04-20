import {
    AsyncStorage
} from 'react-native';

export async function getShop() {
    try {
        const value = await AsyncStorage.getItem('Item');
        if (value !== null) {
            return JSON.parse(value);
        }
        return [];
    } catch (error) {
        console.log("Error", error)
    }
}

export async function setShop(value) {
    try {
        await AsyncStorage.setItem('Item', JSON.stringify(value));
    } catch (error) {
        console.log("Error", error)
    }
}