import React,{useState}from "react";
import { FlatList,Text,TextInput,TouchableOpacity,View ,StyleSheet} from "react-native";
import { modes } from "../Lists";


function Shiftseven({navigation}){
 
const[Id,setSelectedId]=useState('');

  
const HandleShiftModeItems=(id)=>{
  
}

const showshiftmodes=({item})=>{
return(
<View style={{width:300,marginLeft:50,borderRadius:5,borderWidth:1,backgroundColor:'#434547',borderColor:'#83888d'}}>
<TouchableOpacity style={styles.item} onPress={()=>{HandleShiftModeItems(item.id)}} >
    <View style={{flexDirection:'row',alignItems:'center'}}>
        <View style={{width:180}}>
        <Text style={styles.itemText}>{item.upper}</Text>
<Text style={{fontSize:12,color:'white',marginTop:5}}>{item.lower}</Text>
        </View>
    
    <View style={{marginLeft:30}}>
        <Text style={{color:'white',fontSize:17,fontWeight:'bold',marginLeft:30}}>{item.actual}</Text>
    </View>
    </View>
    
</TouchableOpacity>


</View>
);
  }  

return(
    <View  style={styles.container}>
        
       <FlatList
       data={modes.shiftseven}
       renderItem={showshiftmodes}
       keyExtractor={(item,index)=>index.toString()}
       >
       
       </FlatList>
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
      fontSize: 14,
      color: 'white',
      fontWeight:'bold'
    },
    underline: {
      height: 2,
      backgroundColor: 'blue',
      marginTop: 4,
    },
  });
export default Shiftseven;
