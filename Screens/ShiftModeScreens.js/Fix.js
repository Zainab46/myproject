import React,{useState} from "react";
import { FlatList,Text,TextInput,TouchableOpacity,View ,StyleSheet} from "react-native";



function Fix({navigation}){
 
const[Id,setSelectedId]=useState('');



return(
    <View  style={styles.container}>
        <Text style={{color:'white',fontSize:20,fontWeight:'bold',marginLeft:10}}>Fix 0 ~ 9 </Text>
       
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
export default Fix;
