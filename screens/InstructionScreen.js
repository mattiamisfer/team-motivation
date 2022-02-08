import React from 'react';
import {StyleSheet,View,Text,Button,TouchableOpacity} from 'react-native';
import {  Icon } from 'react-native-elements'

import Logo from '../components/MinLogo';

 class InstructionScreen extends React.Component{

    constructor(props) {
        super(props) 
        this.state = {
            instruction:'',
            max_mark:'',
            max_time:'',
            title:'',
            total:'',
            topicID:''
        }
    }

    fetchData = () => {
        return fetch('https://teammotivation.in/onlinetest/appmotivenew/instruction.php', {
          method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
 
    
    chaperID:this.props.navigation.state.params.chapter_id
          
          // locationID: this.state.locationID,
          // userID: this.state.userID
       
    
       
        })
      })
        .then((response) => response.json())
        .then((responseJson) => {

            console.log(responseJson.title)
       //  console.log('My Data' + responseJson)
         this.setState({
          instruction:responseJson.instruction,
          max_mark:responseJson.max_mark,
          max_time:responseJson.max_time,
          title:responseJson.title,
          total:responseJson.total,
          topicID:responseJson.topicID

    
        }, function() {
          // In this block you can do something with new state.
        });
        })
        .catch((error) => {
          console.error(error);
        });
      }


   


      _logout = () => {
        //alert('logout');
        this.props.navigation.navigate('_signOut');
      }
      static navigationOptions = ({ navigation })  => {
 
        return {
         
         headerTitle: (props) => <Logo />,
         headerRight: () => (
           <TouchableOpacity style={styles.logOut} onPress={navigation.getParam('logout')} >
           <Icon
          
           name='md-log-in'
           type='ionicon'
           color='#496bea' 
           size={30}
          
           />
           </TouchableOpacity>
     
         ), headerRightStyle: {
          backgroundColor:'#4A94FB',
          borderBottomColor: 'transparent',
         }
     
          
         }
     }

    async getToken(user) {
        try {
          let userData = await AsyncStorage.getItem("userData");
          let _userID = await AsyncStorage.getItem("userID");
          let _locationID = await AsyncStorage.getItem("locationID");

          const data = JSON.parse(userData);
          const userID = JSON.parse(_userID);
          const locationID = JSON.parse(_locationID);
        this.setState({ loggedIn: data }); 
        this.setState({ userID: userID }); 
        this.setState({locationID:locationID});
        // this.state.userData.map((data) => {
        // console.log(data.id);
        // });
       // Alert.alert(data);
        console.log('results' + data);
          
        } catch (error) {
          console.log("Something went wrong", error);
        }
    }
 
    componentDidMount(){
      this.fetchData();
      this.props.navigation.setParams({ logout: this._logout });

  }
   render() {
    return (
        <View style={styles.screen}>
 
    <View style={{width:'90%',flex:1,marginTop:10,alignItems:'center',alignContent:'center',marginVertical:20}}>
        <View style={{ backgroundColor:'white',width:'90%',alignItems:'center',paddingVertical:4,marginVertical:5}}>
        <Text>{this.state.title}</Text>
        </View>

        <View style={{ backgroundColor:'#9c8bf1',width:'90%',alignItems:'center',paddingVertical:4,marginVertical:5}}>
        <Text>{this.state.max_mark} Marks</Text>
        </View>
        <View style={{ backgroundColor:'#9c8bf1',width:'90%',alignItems:'center',paddingVertical:4,marginVertical:5}}>
        <Text>{this.state.total} Questions</Text>
        </View>
        <View style={{ backgroundColor:'#9c8bf1',width:'90%',alignItems:'center',paddingVertical:4,marginVertical:5}}>
        <Text>{this.state.max_time} Minutes</Text>
        </View>

     
    </View>
    <View style={{flex:1,flexDirection:'column',width:'90%',alignItems:'center',marginTop:60}}>
    <View>
<Text style={{fontSize:18,fontWeight:'100',color:'white' }}>General Instruction</Text>
</View>
<View>
<Text style={{color:'white' }}>{this.state.instruction}</Text>
</View>



    </View>

  <View style={{flex:1,flexDirection:'column',alignContent:"center",width:'100%',marginTop:120}}>
  <View style={{   flexDirection:'row',flex:1,alignContent:'center',alignItems:'center',flex:1,backgroundColor:'white',alignItems:'center'}}>
 <View style={{paddingVertical:10,  flex:1 , alignContent:'flex-start',backgroundColor:'#01c943',alignItems:'center'}} >

<TouchableOpacity onPress={() =>  {this.props.navigation.navigate('QuestionList',{
  topicID:this.state.topicID
})}}  >
   <Text >Ready </Text>
    </TouchableOpacity> 

     </View>

     <View style={{paddingVertical:10,  flex:1 , alignContent:'flex-start',backgroundColor:'#e92323',alignItems:'center'}} >
<TouchableOpacity onPress={() =>  {this.props.navigation.navigate('Home')}}>
    <Text>Decline</Text>
    </TouchableOpacity> 

     </View>
   
     
</View>
  </View>

        </View>
   );
   }
};

 
const styles = StyleSheet.create({
screen: {
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    flexDirection: 'column',
    backgroundColor:'#5e44e1',
    alignContent:'center'
},
logOut: {
  marginRight:10
},
});

export default InstructionScreen