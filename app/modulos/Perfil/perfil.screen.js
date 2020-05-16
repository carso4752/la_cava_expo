import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert, Dimensions, Linking } from 'react-native';
import { Icon, Avatar, ListItem, Overlay, SocialIcon } from 'react-native-elements';
import normalize from 'react-native-normalize';
import * as firebase from 'firebase';
import * as Permission from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import Colors from '../../theme/colors';
import { ActivityIndicator } from 'react-native-paper';
import Toast, {DURATION} from 'react-native-easy-toast';

import Nombre from './components/nombre.screen';
import Email from './components/email.screen';
import Phone from './components/phone.screen';
import Password from './components/password.screen';

const DeviceScreen = Dimensions.get('screen')

export default class perfil extends Component{

    constructor(){
        super();
        this.state = {
            usuario: null,
            avatar: null,
            reloadUser: true,
            modalVisible: false,
            hideConfirmPassword: true,
            hidePassword: true,
            passwordActual: null,
        }
    }
    
    vistaComponente = <View />
    menuOptions = [
        {
          title: "Cambiar nombre de usuario",
          iconType: "material-community",
          iconNameLeft: "account-circle",
          iconColorLeft: "#ccc",
          iconNameRight: "chevron-right",
          iconColorRight: "#ccc",
          onPress: () => this.selectedComponent("name")
        },
        {
          title: "Cambiar correo electrónico",
          iconType: "material-community",
          iconNameLeft: "at",
          iconColorLeft: "#ccc",
          iconNameRight: "chevron-right",
          iconColorRight: "#ccc",
          onPress: () => this.selectedComponent("email")
        },
        {
          title: "Cambiar número celular",
          iconType: "material-community",
          iconNameLeft: "cellphone-android",
          iconColorLeft: "#ccc",
          iconNameRight: "chevron-right",
          iconColorRight: "#ccc",
          onPress: () => this.selectedComponent("phone")
        },
        {
          title: "Cambiar contraseña",
          iconType: "material-community",
          iconNameLeft: "lock-reset",
          iconColorLeft: "#ccc",
          iconNameRight: "chevron-right",
          iconColorRight: "#ccc",
          onPress: () => this.selectedComponent("password")
        }
    ];
    
    componentDidMount(){
        let user = firebase.auth().currentUser
        index = user.providerData.length - 1;
        if(user){
            let data = {...user.providerData[index]};
            data.phoneNumber = user.phoneNumber
            this.setState({ usuario: {...data}, reloadUser: false})
        }
        firebase.storage().ref(`avatar/avatar.png`).getDownloadURL().then(url =>{
            this.setState({ avatar: url })
        })
    }

    async renderAvatar(uid){
        const permisoCamara = await Permission.askAsync(Permission.CAMERA_ROLL);
        const estadoPermiso = permisoCamara.permissions.cameraRoll.status;
        if(estadoPermiso === "denied"){
            Alert.alert("Permiso denegado", "Se deben conceder los permisos necesarios para acceder a la galeria de imagenes")
        } else {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspectRatio: [4,3]
            })
            if(result.cancelled){
                this.refs.toastError.show('Has cerrado la galeria sin seleccionar ninguna imagen', 2000);
            } else{
                this.uploadImage(result.uri, uid).then(() => {
                    this.updateImageUrl(uid);
                }).catch(()=>{
                    this.refs.toastError.show('No se pudo cargar la imagen, intentelo nuevamente', 2000);
                    this.setState({ reloadUser: false })
                })
            }
        }
    }

    uploadImage = async(uri, uid) =>{
        this.setState({ reloadUser: true })
        const response = await fetch(uri);
        const blob = await response.blob();
        const ref = firebase.storage().ref().child(`avatar/${uid}`);
        return ref.put(blob);
    }

    updateImageUrl = (uid) =>{
        firebase.storage().ref(`avatar/${uid}`).getDownloadURL().then(async result => {
            const update = {
                photoURL: result
            }
            await firebase.auth().currentUser.updateProfile(update);
            const { usuario } = this.state
            usuario.photoURL = result;
            this.setState({ usuario, reloadUser: false });
        }).catch(() => {
            console.log("No se encontro el usuario en el servidor")
        })
    }

    updateComponentName = (data) => {
        const { usuario } = this.state

        if(!data.displayName || usuario.displayName == data.displayName){
            this.refs.toastError.show('El nombre no puede ser el mismo o estar vacío', 2000);
        } else {
            firebase.auth().currentUser.updateProfile(data)
            .then(async()=>{
                await this.setState({ usuario: data, modalVisible: false });
                return this.refs.toast.show('Nombre de usuario actualizado correctamente', 2000);
            }).catch(()=>{
                this.refs.toastError.show('Error al actualizar la información', 1500);
            })
        }
        this.setState({ modalVisible: false })
    }

    updateComponentEmail = (data, password) => {
        const { usuario } = this.state

        let mailformat = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
        
        if(!mailformat.test(data.email)){
            this.refs.toastError.show('Correo electrónico invalido', 1500);
        }
        else if(!data.email || usuario.email == data.email){
            this.refs.toastError.show('El correo no puede ser el mismo o estar vacío', 2000);
        } else {
            let user = firebase.auth().currentUser
            let credenciales = firebase.auth.EmailAuthProvider.credential(user.email, password)
            
            user.reauthenticateWithCredential(credenciales).then(()=>{
                firebase.auth().currentUser.updateEmail(data.email)
                .then(async()=>{
                    await this.setState({ usuario: data, modalVisible: false });
                    return this.refs.toast.show('Correo electrónico actualizado correctamente', 2000);
                }).catch(()=>{
                    this.refs.toastError.show('Error al actualizar la información', 1500);
                })
            }).catch(()=>{
                this.refs.toastError.show('Contraseña incorrecta', 1500);
            })
        }
        this.setState({ modalVisible: false })
    }

    updateComponentPhone = (err, data, verificationCode, verificationId) => {
        const { usuario } = this.state

        if(err){
            this.refs.toastError.show('No fue posible generar un código para el número celular ingresado', 4000);
        }
        else if(usuario.phoneNumber == data.phoneNumber){
            this.refs.toastError.show('El celular no puede ser el mismo', 1500);
        } else {
            let user = firebase.auth().currentUser
            let credenciales = firebase.auth.PhoneAuthProvider.credential(verificationId,verificationCode);

            user.updatePhoneNumber(credenciales).then(async()=>{
                await this.setState({ usuario: data, modalVisible: false });
                return this.refs.toast.show('Celular actualizado correctamente', 2000);
            }).catch(()=>{
                this.refs.toastError.show('Código no valido', 1500);
            })
        }
        this.setState({ modalVisible: false })
    }

    updateComponentPassword = (password, passwordNew, passwordConfirm) => {

        if(passwordNew.length < 6 || passwordConfirm.length < 6){
            this.refs.toastError.show('La contraseña debe contener minimo 6 caracteres', 1500);
        } else if(password == passwordNew){
            this.refs.toastError.show('La contraseña no puede ser la misma', 1500);
        } else if(passwordNew == passwordConfirm){
            let user = firebase.auth().currentUser
            let credenciales = firebase.auth.EmailAuthProvider.credential(user.email, password)
            
            user.reauthenticateWithCredential(credenciales).then(()=>{
                firebase.auth().currentUser.updatePassword(passwordNew)
                .then(async()=>{
                    await this.setState({ modalVisible: false })
                    return this.refs.toast.show('Contraseña actualizada correctamente', 2000);
                }).catch(()=>{
                    this.refs.toastError.show('Error al actualizar la información', 1500);
                })
            }).catch(()=>{
                this.refs.toastError.show('Contraseña erronea', 1500);
            })
        } else{
            this.refs.toastError.show('Las contraseñas no coinciden', 1500);
        }
        this.setState({ modalVisible: false })
    }

    selectedComponent(key){ 
        const { usuario } = this.state   
        this.setState({ modalVisible: true })
        switch (key) {
            case 'name':
                this.vistaComponente=(<Nombre guardar={this.updateComponentName} data={usuario} />)
                break;
            case 'email':
                this.vistaComponente=(<Email guardar={this.updateComponentEmail} data={usuario} />)
                break;
            case 'phone':
                this.vistaComponente=(<Phone guardar={this.updateComponentPhone} data={usuario} />)
                break;
            case 'password':
                this.vistaComponente=(<Password guardar={this.updateComponentPassword} />)
                break;
        }
    }

    renderModal(){
        const {modalVisible} = this.state
        return <Overlay
            isVisible={modalVisible}
            windowBackgroundColor='rgba(218,218,218, 0.8)'
            overlayBackgroundColor='transparent'
            overlayStyle={styles.modal}
            onBackdropPress={() => {
                this.setState({ modalVisible: false })
            }}>
            {this.vistaComponente}
        </Overlay>
    }

    renderWhatsapp = () =>{
        let text = "Qué Tal Unas Cervezas Pa' Hoy ?";
        let phoneNumber = '+57 3137050608';
        let link = `whatsapp://send?text=${text}&phone=${phoneNumber}`;
        Linking.canOpenURL(link).then(supported => {
            if (!supported) {
                Alert.alert('Instala la aplicación para brindarte una mejor experiencia');
            } else {
                return Linking.openURL(link);
            }
        }).catch(err => console.error(err));
    }

    renderInstagram = () =>{
        let link = 'https://www.instagram.com/distribuidoralacava/';
        Linking.canOpenURL(link).then(supported => {
            if (!supported) {
                Alert.alert('Instala la aplicación para brindarte una mejor experiencia');
            } else {
                return Linking.openURL(link);
            }
        }).catch(err => console.error(err));
    }

    renderFacebook = () =>{
        let link = 'https://www.facebook.com/DistribuidoraLaCava.co/';
        Linking.canOpenURL(link).then(supported => {
            if (!supported) {
                Alert.alert('Instala la aplicación para brindarte una mejor experiencia');
            } else {
                return Linking.openURL(link);
            }
        }).catch(err => console.error(err));
    }

    render(){ 
        const { usuario, avatar, reloadUser } = this.state;
        let toast = (DeviceScreen.height < 600 ? 100 : 150);
        if(reloadUser){
            return <View style={{ flex: 1, justifyContent:'center' }}>
                <ActivityIndicator size="small" animating={true} color={Colors.primaryButton} />
            </View>
        }
        return <>
            {this.renderModal()}
            <View style={styles.container}>
                <View style={{ flexDirection: 'row' }}>
                    <Avatar 
                        rounded
                        showEditButton
                        size='large'
                        title='US'
                        onEditPress={() =>{
                            this.renderAvatar(usuario.uid);
                        }}
                        source={{ uri: usuario && usuario.photoURL ? usuario.photoURL : avatar }}
                        />
                    <View style={styles.infoUser}>
                        <Text>{usuario && usuario.displayName ? usuario.displayName : 'Anonimo'}</Text>
                        <Text>{usuario && usuario.email ? usuario.email : 'Example@email.com'}</Text>
                        <Text>{usuario && usuario.phoneNumber ? usuario.phoneNumber.slice(-10) : 'Número celular'}</Text>
                    </View>
                </View>
                <Toast 
                    ref="toastError"
                    style={{backgroundColor:'red'}}
                    position='bottom'
                    positionValue={normalize(toast, 'height')}
                    opacity={0.8}
                    textStyle={{color:'white'}}
                />
                <Toast 
                    ref="toast"
                    position='bottom'
                    positionValue={normalize(toast, 'height')}
                    opacity={0.8}
                    textStyle={{color:'white'}}
                />
            </View>
            <View>
                {this.menuOptions.map((menu, index) => (
                    <ListItem
                    key={index}
                    title={menu.title}
                    leftIcon={{
                        type: menu.iconType,
                        name: menu.iconNameLeft,
                        color: menu.iconColorLeft
                    }}
                    rightIcon={{
                        type: menu.iconType,
                        name: menu.iconNameRight,
                        color: menu.iconColorRight
                    }}
                    onPress={menu.onPress}
                    containerStyle={styles.menuItem}
                    />
                ))}
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <SocialIcon
                    type='whatsapp'
                    iconSize={20}
                    style={{ backgroundColor: '#36A62B', width: normalize(40), height: normalize(40, 'height'), position:'absolute', top: 10, left: normalize(20) }}
                    onPress={this.renderWhatsapp}
                />
                <SocialIcon
                    light={true}
                    type='instagram'
                    iconSize={20}
                    iconStyle={{ color: '#E91E63'}}
                    style={{ width: normalize(40), height: normalize(40, 'height'), position:'absolute', top: 10, left: normalize(70) }}
                    onPress={this.renderInstagram}
                />
                <SocialIcon
                    type='facebook'
                    iconSize={20}
                    style={{ backgroundColor: '#1976D2', width: normalize(40), height: normalize(40, 'height'), position:'absolute', top: 10, left: normalize(120) }}
                    onPress={this.renderFacebook}
                />
                <View style={styles.cerrarSesion}>
                    <Icon type='material-community' name='power' color='red' size={normalize(45)} onPress={()=>{
                        firebase.auth().signOut()
                        this.props.navigation.navigate('Login')
                    }} />
                </View>
            </View>
        </>
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems: "center",
        paddingTop: normalize(50, 'height'),
        paddingBottom: normalize(50, 'height'),
        borderBottomWidth: normalize(3, 'height'),
        borderBottomColor: "#e3e3e3"
    },
    infoUser:{
        justifyContent: 'center',
        marginLeft: normalize(10)
    },
    cerrarSesion:{
        flex: 1,
        flexDirection: 'row',
        alignSelf:'flex-end',
        justifyContent: 'flex-end',
        marginBottom: normalize(35, 'height'),
        marginRight: normalize(35)
    },
    menuItem: {
        borderBottomWidth: normalize(3, 'height'),
        borderBottomColor: "#e3e3e3"
    },
    modal:{
        height:'auto',
        width: normalize(350),
        backgroundColor:'#fff',
    },
    button:{
        marginVertical: normalize(10, 'height'),
        marginHorizontal: normalize(10)
    },
    componente:{
        backgroundColor: 'white',
        marginHorizontal: normalize(10),
        paddingTop: normalize(20, 'height'),
        borderRadius: 3
    }
})