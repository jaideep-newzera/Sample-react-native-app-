import React, { Component,useState,useEffect } from 'react';
import type {Node} from 'react';
import { render } from 'react-dom';
import Icon from 'react-native-vector-icons/Ionicons';
import {gql, useMutation, useQuery} from '@apollo/client';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProgressBar from 'react-native-progress/Bar';
import * as Progress from 'react-native-progress';
import * as ImagePicker from 'expo-image-picker';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  ImageView,
  Image,
  View,
} from 'react-native';

import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";


const link = new createHttpLink({uri: 'http://192.168.1.107:4000/'});
const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
});

const Accountid = 3;

const Get_Account = gql`
query GetAccounts($accountsId: ID!){
  Accounts(id: $accountsId){
      Name
      Bio
      Photo
      id
  }
}
`;

const Updatepic = gql`
mutation Addpic($updateprofilepicId: ID!, $photo: String) {
  updateprofilepic(id: $updateprofilepicId,Photo: $photo) {
      Name
      Bio
      Photo
      id
  }
} 
`;


function Homescreen({ navigation }){
  const [image, setImage] = useState('https://reactjs.org/logo-og.png');
  const [Name, setName] = useState("Profile Name");
  const [Bio, setBio] = useState("Your Bio");
  // setImage('./assets/download.png');
  const {error, data, loading} = useQuery(Get_Account, {
    variables: {accountsId: Accountid},
  });
  const [mutateFunction, response] = useMutation(Updatepic);

 useEffect(() => {
   console.log(loading, data, error)
  if (loading) {
  } else {
    const Account = data.Accounts[0];
    console.log(Account);
    setImage(Account.Photo);
    setName(Account.Name);
    setBio(Account.Bio);
  }
}, [loading, data, error]);


  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);
    if (!result.cancelled) {
      mutateFunction({
        variables: {
          updateUserId: Accountid,
          photo: result.uri,
        },
      });
      setImage(result.uri);
    }
  };
  return(
    <SafeAreaView>
    <View style={{}}>
      <View style={{}}>
          <Icon name="chevron-back" size={30} style={{ position:'absolute',left:20,top: 20 }} color="#fdbb21" />
          <Icon name="menu" size={30} style={{ position:'absolute',right:20,top: 20 }} color="#fdbb21" />
      </View>
      <View
        style={{marginLeft: 130, marginTop: 200,heigth: 120}}>
        <TouchableOpacity onPress={() => navigation.navigate('Story')} onLongPress={(pickImage)}>
          { <Image source={{uri: image}} style={styles.image} />}
          {/* <Image source={require('./assets/download.png')} style={styles.image} /> */}
        </TouchableOpacity>
      </View>
      <View
        style={{marginTop: 20,alignItems: 'center', textAlign: 'center'}}>
        <Text style={{fontSize: 20 }}>{Name}</Text>
      </View>
      <View
        style={{marginTop: 10,alignItems: 'center', textAlign: 'center'}}>
        <Text styles={{}}>{Bio}</Text>
      </View>
      {/* <View
        style={{
           borderBottomColor: '#fdbb21',
          borderBottomWidth: 1,
        }}
      /> */}
      <View style={{}}>
      <View
        style={{
          marginTop: 240,
           borderBottomColor: '#fdbb21',
          borderBottomWidth: 1,
        }}
      /> 
          <Icon name="square" size={30} style={{ position:'absolute',left:50,top: 250 }} color="#fdbb21" />
          <Icon name="triangle" size={30} style={{ position:'absolute',right:50,top: 250 }} color="#fdbb21" />
      </View>
    </View>
  </SafeAreaView>
  );
}
function Story({navigation}){
  const [count, setCount] = useState(0);
  let myTimer=setTimeout(() => {
    if(count>=1){navigation.pop();return;}
    setCount(count+0.1);
  }, 500);
  return(
        <View style={{backgroundColor: 'blue',height: 700}}>
          <Progress.Bar progress={count} width={200} style={{marginLeft: 80,marginTop: 100,borderColor:'white'}}/>
          <View style={{justifyContent:'center',alignItems:'center',}}>
          <Image source={require('./assets/3.jpeg')} style={{height: "60%",width:"80%"}}/>
          </View>
          <View style={{alignItems:'center' }}>
            <Text style={{fontSize:15,color: 'yellow'}}> Such an Amazing news! You must read it! </Text>
          </View>
        </View>
  );
}
const Stack = createNativeStackNavigator();
export default function App(){
  return (
    <ApolloProvider client={client}>
    <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Account" component={Homescreen} />
      <Stack.Screen name="Story" component={Story} />
    </Stack.Navigator>
  </NavigationContainer>
   </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    // flexDirection: 'row',
    // justifyContent: 'center',
    // alignItems: 'center',
    // resizeMode: 'contain',
    // height: 100,
    // width: 100,
    //backgroundColor: 'red',
  },
  button: {
    alignItems: 'center',
    resizeMode: 'contain',
    height: 50,
    width: 50,
    backgroundColor: '#859a9b',
  },
  image: {
    height: 100,
    width: 100,
    borderRadius:60,
    borderColor: '#fdbb21',
    borderWidth: 2,
  },
  text: {
    //flex: 1,
  },
});
