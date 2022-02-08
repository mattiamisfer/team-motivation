
import React,{Component } from 'react';
import { StyleSheet,View,Text,TextInput,ImageBackground,Image,TouchableOpacity, Button,
  KeyboardAvoidingView,
  Alert,
  Keyboard,
  ToastAndroid
  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';
 import DeviceInfo from 'react-native-device-info';
import firebase from '@react-native-firebase/app';

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
class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        userEmail:'',
        userPassword:'',
        visible: false,
        userData:{},
        password:true,
        icon:'eye-slash',
        getUniqueId:DeviceInfo.getUniqueId(),
        fcmToken:''
        };
      }









      async componentDidMount() {
        this.checkPermission();
        this.createNotificationListeners(); //add this line
      }

      componentWillUnmount() {

       // Alert.alert(this.state.fcmToken);
        this.notificationListener;
        this.notificationOpenedListener;
        this.messageListener;
      }

      //1
      async checkPermission() {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
          this.getToken();
          console.log('Permitions got');
        } else {
          this.requestPermission();
        }
      }

      //3
      async getToken(user) {
        let fcmToken = await AsyncStorage.getItem('fcmToken');
        if (!fcmToken) {
          fcmToken = await firebase.messaging().getToken();
          if (fcmToken) {
            // user has a device token
            console.log('fcmToken:', fcmToken);
            this.setState({
              fcmToken:fcmToken
            })
            await AsyncStorage.setItem('fcmToken', fcmToken);
          }
        }
        console.log('fcmToken:', fcmToken);
      }

      //2
      async requestPermission() {
        try {
          await firebase.messaging().requestPermission();
          // User has authorised
          console.log('permission allowed');
          this.getToken();
        } catch (error) {
          // User has rejected permissions
          console.log('permission rejected');
        }
      }

      async createNotificationListeners() {
        /*
        * Triggered when a particular notification has been received in foreground
        * */
        this.notificationListener = firebase.notifications().onNotification((notification) => {
          const { title, body } = notification;
          console.log('onNotification:');

            const localNotification = new firebase.notifications.Notification({
              sound: 'sampleaudio',
              show_in_foreground: true,
            })
            .setSound('sampleaudio.wav')
            .setNotificationId(notification.notificationId)
            .setTitle(notification.title)
            .setBody(notification.body)
            .android.setChannelId('fcm_FirebaseNotifiction_default_channel') // e.g. the id you chose above
            .android.setSmallIcon('@drawable/ic_launcher') // create this icon in Android Studio
            .android.setColor('#000000') // you can set a color here
            .android.setVibrate(500)
            .android.setPriority(firebase.notifications.Android.Priority.High);

            firebase.notifications()
              .displayNotification(localNotification)
              .catch(err => console.error(err));
        });

        const channel = new firebase.notifications.Android.Channel('fcm_FirebaseNotifiction_default_channel', 'Demo app name', firebase.notifications.Android.Importance.High)
          .setDescription('Demo app description')
          .setSound('sampleaudio.wav');
        firebase.notifications().android.createChannel(channel);

        /*
        * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
        * */
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
          const { title, body } = notificationOpen.notification;
          console.log('onNotificationOpened:');
          Alert.alert(title, body)
        });

        /*
        * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
        * */
        const notificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {
          const { title, body } = notificationOpen.notification;
          console.log('getInitialNotification:');
          Alert.alert(title, body)
        }
        /*
        * Triggered for data only payload in foreground
        * */
        this.messageListener = firebase.messaging().onMessage((message) => {
          //process data message
          console.log("JSON.stringify:", JSON.stringify(message));
        });
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



      UserLoginFunction =  () =>{
        const { userEmail }  = this.state ;
        const { userPassword }  = this.state ;


       // Alert.alert(userEmail + userPassword);

  return     fetch('https://teammotivation.in/onlinetest/appmotivenew/ac-login.php', {
         method: 'POST',
         headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({

           email: userEmail,

           password: userPassword,
           getUniqueId:this.state.getUniqueId

         })

       }).then((response) => response.json())
             .then((responseJson) => {

                console.log(responseJson.id);
               // If server response message same as Data Matched
              if(responseJson.id === 1)
               {

             //   Alert.alert('im working');

                   //Then open Profile activity and send user email to profile activity.
                  // console.log('Name' + responseJson.name);
                  this.storeToken(JSON.stringify(responseJson.id));
                  this.storeUserID(responseJson.uniqueID);
                  this.storeLocation(responseJson.location);
                  //console.log('userData' + this.state.userData);

            this.props.navigation.navigate('tabNav',{studentID:responseJson.uniqueID});


               }
               else{


                this.setState(
                    {
                      visible: true,
                    },
                    () => {
                      this.hideToast();
                    },
                  );
              //   Alert.alert(responseJson);
               }

             }).catch((error) => {
               console.error(error);
             });

             Keyboard.dismiss();

         }

         hideToast = () => {
            this.setState({
              visible: false,
            });
          };

          onP = () => {

            Alert.alert('hello')
          }

          changeIcon() {



            this.setState(prevState => ({
              icon: prevState.icon =='eye' ? 'eye-slash' : 'eye',
              password:!prevState.password
            }));

          }
      render() {
    return (
      <>
        <KeyboardAvoidingView style={styles.body} behavior="padding" enabled>
        <View style={ styles.container}>
          <Image source={require('../assets/src/logo.png')} style={{width: 300, height:60}} />


        </View>
        <View style={styles.inputContainer}>
        <View style={styles.userInput }>
<Input
style ={ styles.textInput}
  placeholder='Username'
  leftIcon={
    <Icon
      name='user'
      size={24}
      color='black'

    />
  }

  onChangeText={userEmail => this.setState({userEmail})}

/>
 </View>

 <View style={styles.userInput }>
<Input
style ={ styles.textInput}
secureTextEntry={this.state.password}
  placeholder='Password'
  leftIcon={

      <Icon
      name='lock'
      size={24}
      color='black'

    />

  }

 rightIcon={
    <TouchableOpacity  onPress={() => this.changeIcon()}>
        <Icon
        name= {this.state.icon}
        size={24}
        color='black'

      />
    </TouchableOpacity>
    }

  onChangeText={userPassword => this.setState({userPassword})}
  keyboardType={"numeric"}
/>
 </View>

 <View style={styles.userInputlogin} >
   <TouchableOpacity>
     <Button      title="Login "
          color="#f194ff"
          onPress={this.UserLoginFunction}/>
   </TouchableOpacity>
 </View>

 <View style={{  flexDirection:'column',alignContent:'center',marginTop:10}}>

  <View  >
  <TouchableOpacity    onPress={() => {this.props.navigation.navigate('password')}}
>

<Text style={{color:'white',fontSize:16,fontWeight:'bold'}}>Forgot your Password</Text>

   </TouchableOpacity>
      </View>

     </View>

 <View style={{  flexDirection:'row',alignContent:'center',marginTop:10}}>

 <View  >
     <Text style={{color:'white'}}>Don't have account </Text>
     </View>
  <View  >
  <TouchableOpacity    onPress={() => {this.props.navigation.navigate('_signUp')}}
>

<Text style={{color:'white',fontSize:16,fontWeight:'bold'}}>Sign Up</Text>

   </TouchableOpacity>
  </View>
 </View>
 <Toast visible={this.state.visible} message="Username or Password Wrong" />


        </View>

        </KeyboardAvoidingView>
      </>

    );
}
}
LoginScreen.navigationOptions = {
    header:null
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
 height:40
},
userInput: {
width:'100%',
backgroundColor:'white',
marginVertical:5,
    height:48
 },

    userInputlogin: {
        width:'100%',
        backgroundColor:'white',
        marginVertical:5,

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
  marginTop:150


}
});

export default LoginScreen;
