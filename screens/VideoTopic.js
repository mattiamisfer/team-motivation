import React from 'react';
import {StyleSheet, FlatList, Text, View, Alert, ActivityIndicator, Platform,TouchableOpacity} from 'react-native';
// import { ListItem } from 'react-native-elements'
import { ListItem,Icon } from 'react-native-elements'
// import { ListItem,Icon } from 'react-native-elements'

import Logo from '../components/MinLogo';


class VideoTopic extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading:true,
            userID :this.props.navigation.state.params.userID,
            locationID:this.props.navigation.state.params.locationID


        }
    }

    fetchData = () => {
      return fetch('https://teammotivation.in/onlinetest/appmotivenew/videolist.php', {
        method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({

        locationID: this.state.locationID,
        userID: this.state.userID



      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
       console.log(responseJson)
       this.setState({
        isLoading: false,
        dataSource: responseJson
      }, function() {
        // In this block you can do something with new state.
      });
      })
      .catch((error) => {
        console.error(error);
      });
    }

    componentDidMount() {
      this.fetchData();
   //   Alert.alert(this.state.userID);
   this.props.navigation.setParams({ logout: this._logout });


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



      keyExtractor = (item, index) => index.toString();
      renderItem = ({ item }) => (

        <TouchableOpacity style={{width:'100%'}}

        // disabled={item.user}
        onPress={() => {this.props.navigation.navigate('VideoSubTopic', {
          userID:this.state.userID,
          locationID:this.state.locationID,
          topicID:item.id,


        })}}>
        <ListItem style={{width:'100%',backgroundColor:'orange'}}
          title={item.setName}
          subtitle={item.attend}

          leftAvatar={{ source: { uri: item.imagePath } }}
          bottomDivider
          chevron
        />



        </TouchableOpacity>

      )


render() {
  if (this.state.isLoading) {
    return (
      <View style={{flex: 1, paddingTop: 20}}>
        <ActivityIndicator />
      </View>
    );
  }
    const { navigation } = this.props;
    return (
        <View style={styles.screen}>

    {/* <Text>User ids { navigation.state.params.userID} || { navigation.state.params.locationID}</Text> */}



   <View style={{width:'100%'}}>
   <FlatList
      keyExtractor={this.keyExtractor}
      data={ this.state.dataSource }
      renderItem={this.renderItem}
    />
   </View>



        </View>
   );
}
};


const styles = StyleSheet.create({
screen: {
    flex:1,
    justifyContent:'center',
    alignItems:'center'
},
logOut: {
  marginRight:10
},
});

export default VideoTopic;
