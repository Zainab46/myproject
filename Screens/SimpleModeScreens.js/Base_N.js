import React,{useState} from "react";
import { FlatList,Text,TextInput,TouchableOpacity,View ,StyleSheet} from "react-native";
import { modes } from "../Lists";


function Base_N({navigation}){



return(
    <View  style={styles.container}>
       <Text style={{color:'white',fontSize:20,fontWeight:'bold',marginLeft:340,marginTop:100}}> Dec </Text>
       <TextInput placeholder="0" style={{height:40,
    backgroundColor:'#D3EBD3',
    borderRadius:2}}></ TextInput>
    </View>
);


}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#222', 
      paddingTop: 20,
    },
    header: {
      fontSize: 22,
      fontWeight: 'bold',
      textAlign: 'center',
      color: 'white',
      marginBottom: 10,
    },
    item: {
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#444',
    },
    itemText: {
      fontSize: 18,
      color: 'white',
      fontWeight:'bold'
    },
    underline: {
      height: 2,
      backgroundColor: 'blue',
      marginTop: 4,
    },
  });
export default Base_N;
