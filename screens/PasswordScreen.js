
import React,{Component } from 'react';
import { StyleSheet,View,Text,TextInput,ImageBackground,Image,TouchableOpacity, Button,
  KeyboardAvoidingView,Alert,Keyboard,ToastAndroid

  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import Icon from 'react-native-vector-icons/FontAwesome';
import { Input,Icon } from 'react-native-elements';

import SwitchButton from 'switch-button-react-native';
import Logo from '../components/MinLogo';
import DeviceInfo from 'react-native-device-info';

const Toast = (props) => {
    if (props.visible) {
      ToastAndroid.showWithGravityAndOffset(
        props.message,
        ToastAndroid.LONG,
        ToastAndroid.TOP,
        25,
        400,
      );
      return null;
    }
    return null;
  };
class PasswordScreen extends Component {
    constructor(props) {


        super(props);
        this.state = {
        userEmail:'',
        userPassword:'',
        visible: false,
        emailvisible:false,
        userData:{},
        activeSwitch: 1,
        userName:'',
        phone:'',
        university:'',
        repassword:'',
        keyboardStatus:true,
        msg:''

        };
      }



      async storeToken(user) {
        try {
           await AsyncStorage.setItem("userData",JSON.stringify(user));

        } catch (error) {
          console.log("Something went wrong", error);
        }
      }
      async storeUserID(user) {
        try {
           await AsyncStorage.setItem("userID",JSON.stringify(user));

        } catch (error) {
          console.log("Something went wrong", error);
        }
      }
      async storeLocation(user) {
        try {
           await AsyncStorage.setItem("locationID",JSON.stringify(user));

        } catch (error) {
          console.log("Something went wrong", error);
        }
      }
      static navigationOptions = ({ navigation })  => {

        return {

         headerTitle: (props) => <Logo />
         , headerRightStyle: {
          backgroundColor:'#4A94FB',
          borderBottomColor: 'transparent',
         }


         }
     }



      UserLoginFunction =  () =>{
        const { userEmail }  = this.state ;




          if(userEmail == '') {
            Alert.alert('Email Fields are required');
                      }
            else {
                   // Alert.alert(userEmail + userPassword);

              return     fetch('https://teammotivation.in/onlinetest/appmotivenew/ac-forgot.php', {
                     method: 'POST',
                     headers: {
                       'Accept': 'application/json',
                       'Content-Type': 'application/json',
                     },
                     body: JSON.stringify({

                       email: userEmail,
                       deviceID:DeviceInfo.getUniqueId()



                     })

                   }).then((response) => response.json())
                         .then((responseJson) => {

                            console.log(responseJson);
                           // If server response message same as Data Matched

                           if(responseJson === 1) {
                            this.setState(
                                {
                                  visible: true,
                                  msg:'Password  has been Sent to  your Email!'
                                },
                                () => {
                                  this.hideToast();
                                },
                              );
                              setTimeout(() =>


                              {
                                this.props.navigation.navigate('Login');
                                this.setState({timePassed: true})}, 5000)
                           } else {

                            this.setState(
                                {
                                  visible: true,
                                  msg:'Sorry your Email ID not Exist'
                                },
                                () => {
                                  this.hideToast();
                                },
                              );
                              setTimeout(() =>


                              {
                                this.props.navigation.navigate('Login');
                                this.setState({timePassed: true})}, 5000)

                           }


                         }).catch((error) => {
                           console.error(error);
                         });

                         Keyboard.dismiss();
                        }


         }

         hideToast = () => {
            this.setState({
              visible: false,
            });
          };
      render() {
    return (
      <>
        <KeyboardAvoidingView style={styles.body} behavior="padding" enabled>


        {/* <View style={ styles.container}>
          <Image source={require('../assets/src/logo.png')} style={{width: 300, height:48}} />


        </View>   */}



        <View style={styles.inputContainer}>


        <View>

<Text style={{fontSize:18,color:'white',fontWeight:'bold'}}>Reset your Password</Text>
</View>


 <View style={styles.userInput }>
<Input
style ={ styles.textInput}
  placeholder='Email'
  leftIcon={
    <Icon
    name='email'
    type='material'
    size={24}
      color='black'
  />

  }

  onChangeText={userEmail => this.setState({userEmail})}

/>
 </View>













 <View style={styles.userInputPass} >
   <TouchableOpacity>
     <Button      title="Password Reset "
          color="#f194ff"
          onPress={this.UserLoginFunction}/>
   </TouchableOpacity>
 </View>
 <Toast visible={this.state.visible} message={this.state.msg} />


        </View>

        </KeyboardAvoidingView>
      </>

    );
}
}


const styles = StyleSheet.create({
  body: {

    flex:1,
    backgroundColor:'#2758d4',
    alignItems:'center'
  },
container: {

    width:'100%',
    height:90,
    backgroundColor:'white',
    borderBottomLeftRadius:60,
    borderBottomRightRadius:60,
    alignItems:'center',
    justifyContent:'center'
},
textInput: {
 borderBottomColor:'black',
 borderBottomWidth:0.3,
 backgroundColor:'white',
 height:45
},
userInput: {
width:'100%',
backgroundColor:'white',
marginVertical:5,
    height:45
 },

    userInputPass: {
        width:'100%',
        backgroundColor:'white',
        marginVertical:5,
        height:36
    },
inputContainer: {

  width:'100%',
  maxWidth:'80%',
  alignItems:'center',
  justifyContent:'center',
  // shadowOffset: { width:0, height:2},
  // shadowRadius:5,
  // shadowOpacity:0.26,
  // backgroundColor:'white',
  // elevation:5,
  marginTop:100


}
});

export default PasswordScreen;
