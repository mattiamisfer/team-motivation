/*Example of Expandable ListView in React Native*/
import React, { Component } from 'react';
//import react in our project
import {
    LayoutAnimation,
    StyleSheet,
    View,
    Text,
    ScrollView,
    UIManager,
    TouchableOpacity,
    Platform,
    Image,
    Alert
} from 'react-native';
//import basic react native components
import { Card, ListItem, Button, Icon } from 'react-native-elements'
import AsyncStorage from '@react-native-async-storage/async-storage';

import Logo from '../components/MinLogo';

class ExpandableItemComponent extends Component {


    //Custom Component for the Expandable List
    constructor() {
        super();
        // this.state = {
        //   layoutHeight: 0,
        // };

        // this.onPress = this.onPress.bind(this);
    }
    state = {
        layoutHeight: 0,

    }
    static getDerivedStateFromProps (nextProps,prevState) {
        if (nextProps.item.isExpanded) {

            return {
                layoutHeight: null,
            };

        } else {

            return {
                layoutHeight: 0,
            };

        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.layoutHeight !== nextState.layoutHeight) {
            return true;
        }
        return false;
    }



    render() {


        return (
            <View>
                {/*Header of the Expandable List Item*/}
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={this.props.onClickFunction}
                    style={styles.header}>
                    <Text style={styles.headerText}>{this.props.item.category_name}...</Text>
                </TouchableOpacity>
                <View
                    style={{
                        height: this.state.layoutHeight,
                        overflow: 'hidden',
                        marginVertical:5
                    }}>
                    {/*Content under the header of the Expandable List Item*/}
                    {this.props.item.subcategory.map((item, key) => (

                        <>
                            {item.complated != 'complated' ?
                        <TouchableOpacity
                            key={key}
                            style={styles.content}
                        >
                            {/* <Text style={styles.text}>
                {key}. {item.title}
              </Text> */}
                            <Card
                                title={item.title}  >
                                <View style={{flexDirection:'row',flex:1,justifyContent:'space-between',}}>
                                    <View  style={styles.block3}>
                                        <Image source={{uri: item.pimg}} style={{width: 40, height: 40}} />




                                    </View>
                                    <View style={{flexDirection:'row',justifyContent:'space-between',flex:1}}>
                                        <View style={styles.block3}>
                                            <Icon

                                                name='star'
                                                type='font-awesome'
                                                color='#517fa4'
                                            />
                                            <Text style={styles.blockText}>{item.subjectMark} Marks</Text>

                                        </View>
                                        <View style={styles.block3}>
                                            <Icon

                                                name='question'
                                                type='font-awesome'
                                                color='#517fa4'
                                            />
                                            <Text style={styles.blockText}>{item.total_question} Questions</Text>

                                        </View>
                                        <View style={styles.block3}>
                                            <Icon

                                                name='clockcircleo'
                                                type='antdesign'
                                                color='#517fa4'
                                            />
                                            <Text style={styles.blockText}>{item.max_time} Min</Text>

                                        </View>
                                        <View style={styles.block3}>

                                            {/*{item.display =='show' ?*/}

                                            {/*    item.complated == 'complated' ?*/}

                                            {/*        <TouchableOpacity>*/}
                                            {/*            <Icon*/}

                                            {/*                name='play-circle'*/}
                                            {/*                type='font-awesome'*/}
                                            {/*                color='#ff0000'*/}
                                            {/*            />*/}
                                            {/*        </TouchableOpacity> :*/}
                                                    <TouchableOpacity     onPress={  this.props.onPressFunction}>
                                                        <Icon

                                                            name='play-circle'
                                                            type='font-awesome'
                                                            color='#23ca2f'
                                                        />


                                                    </TouchableOpacity>




                                                 {/*:*/}
                                                {/*<Image source={require('../assets/src/paid.png')} style={{width: 40, height:40}} />*/}


                                             {/*}*/}

                                        </View>

                                    </View>

                                </View>
                            </Card>
                            <View style={styles.separator} />
                        </TouchableOpacity> : null
                            }
                        </>
                    ))}
                </View>
            </View>
        );
    }
}

export default class NotifcationScreen extends Component {
    //Main View defined under this Class
    constructor() {
        super();
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
        this.state = { listDataSource: [],


        };
    }





 async   fetchData() {


        try {
            let userData = await AsyncStorage.getItem("userData");
            let _userID = await AsyncStorage.getItem("userID");
            let _locationID = await AsyncStorage.getItem("locationID");

            const data = JSON.parse(userData);
            const userID = JSON.parse(_userID);
            const locationID = JSON.parse(_locationID);


            //Alert.alert( userID + "|||" + locationID);
            this.setState({ loggedIn: data });
            this.setState({ userID: userID });
            this.setState({locationID:locationID});
            return fetch('https://teammotivation.in/onlinetest/appmotivenew/test-topic-notification.php', {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    // userID : this.props.navigation.state.params.userID,
                    // locationID: this.props.navigation.state.params.locationID,




                    locationID: this.state.locationID,
                    userID: this.state.userID



                })
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    //  console.log('My Data' + responseJson)
                    this.setState({

                        listDataSource: responseJson
                    }, function() {
                        // In this block you can do something with new state.
                    });
                })
                .catch((error) => {
                    console.error(error);
                });

        }
        catch (e) {

        }

    }


    componentDidMount() {
        this.fetchData();
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


            Alert.alert( userID + "|||" + locationID);
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


    updateLayout = index => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        const array = [...this.state.listDataSource];
        //For Single Expand at a time
        array.map((value, placeindex) =>
            placeindex === index
                ? (array[placeindex]['isExpanded'] = !array[placeindex]['isExpanded'])
                : (array[placeindex]['isExpanded'] = false)
        );

        //For Multiple Expand at a time
        //array[index]['isExpanded'] = !array[index]['isExpanded'];
        this.setState(() => {
            return {
                listDataSource: array,
            };
        });
    };
    onPress(id) {
        // Alert.alert('Value' + JSON.stringify(id));

        const { navigate } = this.props.navigation;
        navigate('Instuction',{ chapter_id:id });
    }
    render() {
        return (
            <View style={styles.container}>

                <ScrollView>
                    {this.state.listDataSource.map((item, key) => (
                        <ExpandableItemComponent
                            key={item.category_name}
                            onClickFunction={this.updateLayout.bind(this, key)}
                            onPressFunction={this.onPress.bind(this, item.chapter_id)}
                            item={item}
                        />
                    ))}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 0,
        backgroundColor: '#555dff',
    },
    topHeading: {
        paddingLeft: 10,
        fontSize: 20,
    },
    header: {
        backgroundColor: '#F5FCFF',
        padding: 16,
    },
    headerText: {
        fontSize: 16,
        fontWeight: '500',
    },
    separator: {
        height: 0.5,
        backgroundColor: '#808080',
        width: '95%',
        marginLeft: 16,
        marginRight: 16,
    },
    text: {
        fontSize: 10,
        color: '#606070',
        padding: 10,
    },
    content: {
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#fff',
    },

    block3: {
        flexDirection:'column',
        alignContent:'space-between',
        alignItems:'stretch'



    },
    blockText: {
        fontSize:10
    },
    logOut: {
        marginRight:10
    },
});

//Dummy content to show
//You can also use dynamic data by calling webservice
