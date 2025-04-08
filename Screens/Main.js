import React, {useState,useEffect} from "react";
import { View,SafeAreaView,TextInput,StyleSheet,TouchableOpacity,Text,Image} from "react-native";
import { api } from "../API";
function Main({navigation,ActualMode,setActualMode}){

const [expressionInput, setExpressionInput] = useState(''); 
const [resultInput, setResultInput] = useState('');
const [shift,setshift]=useState(false);
const [DRG,setDRG]=useState('DEG');
const[alpha,setalpha]=useState(false);
const[SA,setSA]=useState('off');
const [currentExpression, setCurrentExpression] = useState('');
const [lastResult, setLastResult] = useState('');


const handlesquare=(btnvalue)=>{
  if(btnvalue=='x²'){
    console.log('called')
    setExpressionInput(expressionInput+'^2')
  }
}


const handlevariables=(variable)=>{

if(shift==true&&variable=='a'){
  setExpressionInput(expressionInput+'A');
}
else if (shift==true&&variable=='b'){
  setExpressionInput(expressionInput+'b');
}
else if (shift==true&&variable=='c'){
  setExpressionInput(expressionInput+'c')
}
else if (shift==true&&variable=='d'){
  setExpressionInput(expressionInput+'d')
}
else if (shift==true&&variable=='e'){
  setExpressionInput(expressionInput+'e')
}
else if (shift==true&&variable=='f'){
  setExpressionInput(expressionInput+'f')
}
else if (shift==true&&variable=='t'){
  setExpressionInput(expressionInput+'t')
}
else if (shift==false && variable=='c'){
  setExpressionInput(expressionInput+'hyp');
}
else if (shift==false&& variable=='d'){
  setExpressionInput(expressionInput+'sin')
}
else if (shift==false && variable=='e'){
  setExpressionInput(expressionInput+'cos');
}
else if (shift==false && variable=='f'){
  setExpressionInput(expressionInput+'tan')
}
else if (shift==false&&variable=='('){
  setExpressionInput(expressionInput+'(')
}
else if (shift==false&&variable==')'){
  setExpressionInput(expressionInput+')')
}
else if (shift==true&&variable=='m'){
  setExpressionInput(expressionInput+'m');
}
else if(shift==false&&variable=='Log'){
  setExpressionInput(expressionInput+'log')
}
else if(shift==false&&variable=='t'){
  setExpressionInput(expressionInput+'ln')
}
else if(shift==true&&variable==')'){
  setExpressionInput(expressionInput+'x')
}
}



const handleNumberClick = (number) => {
  if (shift==true && number=='8'){
    navigation.navigate('Shifteight')
  }
  else if (shift==true && number=='7'){
    navigation.navigate('Shiftseven')
  }
  else{
  // Update expression input only
  setExpressionInput(expressionInput + number.toString());
  }

};

// Function to handle operator clicks
const handleOperatorClick = (operator) => {

  setExpressionInput(expressionInput + operator);
};

const movetograph=()=>{
  navigation.navigate('Graph', { graphvalue: expressionInput });
}

const handleDecimalClick = () => {
    // Check if the last number in the expression already has a decimal
    const parts = expressionInput.split(/[\+\-X÷]/);
    const lastPart = parts[parts.length - 1];
    
    if (!lastPart.includes('.')) {
      setExpressionInput(expressionInput + '.');
    }
  };

// Function to handle equals button
const handleEquals = () => {
  try {
    if (expressionInput) {
     handleEvaluate();
    }
  } catch (error) {
    setResultInput('Error');
    setExpressionInput('');
  }
};


 // Function to handle clear (AC) button
 const handleClear = () => {
  setExpressionInput('');
  setResultInput('');
};

const handleBackspace = () => {
  if (expressionInput.length > 0) {
    setExpressionInput(expressionInput.slice(0, -1));
  }
};

const handleAns = () => {
  if (lastResult) {
    setExpressionInput(expressionInput + lastResult);
  }
};

const ShiftHandling=()=>{
 setshift(!shift)
}

const AlphaHandling=()=>{
  setalpha(!alpha)
}

const ShiftAplhaHandling=()=>{
  if(alpha==false && shift==true){
     setSA('S');
  }
  else if(alpha==true && shift==false){
    setSA('A');
  }
  else if(alpha==false && shift==false){
    setSA('off')
  }
  else if(alpha==true && shift==true){
    setalpha(false)
    setshift(false)
    setSA('off')
  }

}

const ModeHandling=()=>{
  if(shift==true){
    navigation.navigate('ShiftMode')
  }
  else if(shift==false){
    navigation.navigate('SimpleMode')
  }
}

const DRGHandling=()=>{
  if(DRG=='DEG'){
    setDRG('RAD')
  }
  else if(DRG=='RAD'){
    setDRG('GRAD')
  }
  else{
    setDRG('DEG')
  }
}


useEffect(()=>{ShiftAplhaHandling()},[shift,alpha])
return(
 <SafeAreaView style={ss.mainView}>

   <View style={{marginTop:22}}>
      <TextInput style={ss.textInput} multiline={true}  onChangeText={setExpressionInput} value={expressionInput}  editable={true}  // Make it editable to show cursor
  showSoftInputOnFocus={false}>
      </TextInput>

      <TextInput style={ss.textInput} multiline={true}  onChangeText={setResultInput} value={resultInput} editable={false}>

      </TextInput>
    </View>
   <View style={{flexDirection:'row',marginTop:12}}>

   <View style={ss.modebtnView}>
   <TouchableOpacity style={ss.modebtn} onPress={DRGHandling}>
    <Text style={ss.modetxt}>{DRG}</Text>
   </TouchableOpacity>

   <TouchableOpacity style={ss.modebtn}>
   <Text style={{color:'white',fontSize:12,marginTop:2}}>{ActualMode}</Text> 
   </TouchableOpacity>

   <TouchableOpacity style={ss.modebtn}>
   <Text style={ss.modetxt}>{SA}</Text> 
   </TouchableOpacity>
   </View>
   <View >

   <TouchableOpacity style={ss.graphbtn} onPress={()=>movetograph()}>
   <Text style={{marginTop:2}}>GRAPH</Text> 
   </TouchableOpacity>
   </View>
  </View>

{/* row 1 */}  
  <View style={ss.row1btn} >
  <TouchableOpacity   style={shift?ss.onshiftPress:ss.withoutshiftPress}
  onPress={ShiftHandling}>
   <Text>Shift</Text> 
   </TouchableOpacity>

   <TouchableOpacity style={{alignItems:'center',marginLeft:10,backgroundColor:'#6792E9', borderRadius:10,height:25,width:50}} 
   onPress={AlphaHandling}>
   <Text>Alpha</Text> 
   </TouchableOpacity>

   <TouchableOpacity style={{alignItems:'center',marginLeft:10,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:50}}>
   <Image source={require('../Assets/leftArrow.png')} style={{height:15,width:15,marginTop:4}}></Image>
   </TouchableOpacity>

   <TouchableOpacity style={{alignItems:'center',marginLeft:10,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:50}} >
   <Image source={require('../Assets/rightArrow.png')} style={{height:15,width:15,marginTop:4}}></Image> 
   </TouchableOpacity>

   <TouchableOpacity  style={{alignItems:'center',marginLeft:20,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:70}} onPress={ModeHandling}>
   <Text>MODE</Text>
   </TouchableOpacity>
  </View>

{/* row 2 */}
  <View style={{flexDirection:'row',marginTop:8}}>
  <View>
    <Text style={{color:'white', marginLeft:15}}>solve=</Text>
    <TouchableOpacity style={{alignItems:'center',marginLeft:10,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:50}}>
    <Text style={{fontWeight:'bold',marginTop:2}}>CALC</Text>
    </TouchableOpacity>
  </View>

  <View>
    <Text style={{color:'white', marginLeft:20}}>d/dx</Text>
    <TouchableOpacity style={{alignItems:'center',marginLeft:10,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:50}}>
    <View style={{flexDirection:'row'}}>
      <View>
        <Text style={{fontSize:16,fontWeight:'bold'}}>∫</Text>
      </View>
      <View style={{flexDirection:'column',marginBottom:10}}>
      <Text style={{fontSize:8,fontWeight:'bold'}}>x</Text>
      <Text style={{fontSize:8,fontWeight:'bold'}}>y</Text>
      </View>

    </View>
    </TouchableOpacity>
  </View>

  <View>
    <Text></Text>
    <TouchableOpacity style={{alignItems:'center',marginLeft:10,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:50}}>
    <Image source={require('../Assets/upArrow.png')} style={{height:15,width:15,marginTop:4}}></Image> 
    </TouchableOpacity>
  </View>

  <View>
    <Text></Text>
    <TouchableOpacity style={{alignItems:'center',marginLeft:10,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:50}}>
    <Image source={require('../Assets/downArrow.png')} style={{height:15,width:15,marginTop:4}}></Image> 
    </TouchableOpacity>
  </View>

  <View>
    <Text style={{color:'white', marginLeft:30}}>x!</Text>
    <TouchableOpacity style={{alignItems:'center',marginLeft:10,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:50}}>
    <Text style={{fontSize:19}}>x⁻¹</Text>
    </TouchableOpacity>
  </View>

  <View>
    <Text style={{color:'white', marginLeft:30}}>∑</Text>
    <TouchableOpacity style={{alignItems:'center',marginLeft:10,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:55}}>
    <Text style={{fontSize:16}}>log₂y</Text>
    </TouchableOpacity>
  </View>
  </View>

{/* row 3 */}
<View style={{flexDirection:'row',marginTop:8}}>
<View>
  <View style={{marginLeft:11}}>
    <Image source={require('../Assets/row3_btn1.png')} style={{height:20,width:45,marginTop:2}}></Image> 
    </View>
    <TouchableOpacity style={{alignItems:'center',marginLeft:10,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:50}}>
    <Text style={{fontWeight:'bold',fontSize:16,marginBottom:4}}>x/y</Text>
    </TouchableOpacity>
  </View>

  <View>
  <View style={{marginLeft:11}}>
    <Image source={require('../Assets/row3_btn2.png')} style={{height:20,width:45,marginTop:2}}></Image> 
    </View>
    <TouchableOpacity style={{alignItems:'center',marginLeft:10,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:50}}>
    <Image source={require('../Assets/underoot_x.png')} style={{height:20,width:40,marginTop:2}}></Image>
    </TouchableOpacity>
  </View>

  <View>
  <View style={{marginLeft:11}}>
    <Image source={require('../Assets/row3_btn3.png')} style={{height:20,width:45,marginTop:2}}></Image> 
    </View>
    <TouchableOpacity style={{alignItems:'center',marginLeft:10,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:50}} onPress={()=>handlesquare('x²')}>
    <Text style={{fontSize:18}}>x²</Text>
    </TouchableOpacity>
  </View>

 
  <View>
  <View style={{marginLeft:11}}>
    <View style={{marginLeft:10}}>
    <Image source={require('../Assets/row3_btn4.png')} style={{height:20,width:30,marginTop:2}}></Image> 
    </View>
    </View>
    <TouchableOpacity style={{alignItems:'center',marginLeft:10,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:50}}>
    <Text style={{fontSize:18,marginTop:1}}>xʸ</Text>
    </TouchableOpacity>
  </View>

  <View>
  <View style={{marginLeft:11}}>
    <View style={{marginLeft:10}}>
    <Image source={require('../Assets/row3_btn5.png')} style={{height:20,width:30,marginTop:2}}></Image> 
    </View>
    </View>
    <TouchableOpacity style={{alignItems:'center',marginLeft:10,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:50}} onPress={()=>handlevariables('Log')}>
    <Text style={{marginTop:2, fontWeight:'bold'}}>Log</Text>
    </TouchableOpacity>
  </View>

  <View>
  <View style={{marginLeft:11}}>
    <View style={{marginLeft:6}}>
    <Image source={require('../Assets/row3_btn6.png')} style={{height:20,width:38,marginTop:2}}></Image> 
    </View>
    </View>
    <TouchableOpacity style={{alignItems:'center',marginLeft:10,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:50}}onPress={()=>{handlevariables('t')}}>
    <Text style={{marginTop:2, fontWeight:'bold'}}>Ln</Text>
    </TouchableOpacity>
  </View>

</View>

 {/* for next row no 4 */}
<View style={{flexDirection:'row',marginTop:8}}>
<View>
    <Text style={{color:'white', marginLeft:18}}>∠     a</Text>
    <TouchableOpacity style={{marginTop:2,alignItems:'center',marginLeft:10,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:50}} onPress={()=>{handlevariables('a')}}>
    <Text style={{fontSize:16,fontWeight:'bold'}}>(-)</Text>
    </TouchableOpacity>
  </View>

  <View>
    <Text style={{color:'white', marginLeft:10}}>FACT  b</Text>
    <TouchableOpacity style={{marginTop:2,alignItems:'center',marginLeft:10,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:50}} onPress={()=>{handlevariables('b')}}>
    <Text style={{fontSize:16,fontWeight:'bold'}}>° ' "</Text>
    </TouchableOpacity>
  </View>

  <View>
    <Text style={{color:'white', marginLeft:16}}>|x|     c</Text>
    <TouchableOpacity style={{marginTop:2,alignItems:'center',marginLeft:10,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:50}} onPress={()=>{handlevariables('c')}}>
    <Text style={{fontSize:16,fontWeight:'bold'}}>hyp</Text>
    </TouchableOpacity>
  </View>

  <View>
  <View style={{marginLeft:11}}>
    <Image source={require('../Assets/sin_inv.png')} style={{height:20,width:55}}></Image> 
    </View>
    <TouchableOpacity style={{marginTop:2,alignItems:'center',marginLeft:10,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:51}} onPress={()=>{handlevariables('d')}}>
    <Text style={{fontSize:16,fontWeight:'bold'}}>sin</Text>
    </TouchableOpacity>
  </View>


  <View>
  <View style={{marginLeft:6}}>
    <View style={{marginBottom:2}}>
    <Image source={require('../Assets/cos_inv.png')} style={{height:19,width:47}}></Image> 
    </View>
    </View>
    <TouchableOpacity style={{alignItems:'center',marginLeft:5,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:51,marginTop:2}} onPress={()=>{handlevariables('e')}}>
    <Text style={{fontSize:16,fontWeight:'bold'}}>cos</Text>
    </TouchableOpacity>
  </View>


  <View>
  <View style={{marginLeft:6}}>
    <View style={{marginBottom:2,marginLeft:5}}>
    <Image source={require('../Assets/tan_inv.png')} style={{height:19,width:47}}></Image> 
    </View>
    </View>
    <TouchableOpacity style={{alignItems:'center',marginLeft:8,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:51,marginTop:2}} onPress={()=>{handlevariables('f')}}>
    <Text style={{fontSize:16,fontWeight:'bold'}}>tan</Text>
    </TouchableOpacity>
  </View>
 </View>


{/* row 5 */}

<View style={{flexDirection:'row',marginTop:8}}>

 <View>
  <View style={{marginLeft:6,marginTop:3}}>
    <View style={{marginBottom:2,marginLeft:4}}>
    <Text style={{color:'white'}}>STO CLRv</Text>
    </View>
    </View>
    <TouchableOpacity style={{alignItems:'center',marginLeft:10,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:52,marginTop:1}}>
    <Text style={{fontSize:16,fontWeight:'bold'}}>RCL</Text>
    </TouchableOpacity>
  </View>

  <View>
  <View style={{marginLeft:6}}>
    <View style={{marginBottom:2,marginTop:3}}>
    <Text style={{color:'white'}}>i     cot</Text>
    </View>
    </View>
    <TouchableOpacity style={{alignItems:'center',backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:52,marginTop:1}}>
    <Text style={{fontSize:16,fontWeight:'bold'}}>ENG</Text>
    </TouchableOpacity>
  </View>

  <View>
  <View style={{marginLeft:6}}>
    <View style={{marginBottom:2,marginLeft:2,marginTop:3}}>
    <Image source={require('../Assets/row5_btn3.png')} style={{height:19,width:47}}></Image> 
    </View>
    </View>
    <TouchableOpacity style={{alignItems:'center',backgroundColor:'#D9D9D9',marginLeft:8, borderRadius:10,height:25,width:51,marginTop:1}} onPress={()=>{handlevariables('(')}}>
    <Text style={{fontSize:16,fontWeight:'bold'}}>(</Text>
    </TouchableOpacity>
  </View>


  <View>
  <View style={{marginLeft:6}}>
    <View style={{marginBottom:2,marginLeft:12,marginTop:3}}>
    <Text style={{color:'white',fontSize:14}}>,      x</Text>
    </View>
    </View>
    <TouchableOpacity style={{alignItems:'center',backgroundColor:'#D9D9D9',marginLeft:8,  borderRadius:10,height:25,width:52,marginTop:1}} onPress={()=>{handlevariables(')')}}>
    <Text style={{fontSize:16,fontWeight:'bold'}}>)</Text>
    </TouchableOpacity>
  </View>

  <View>
  <View style={{marginLeft:6}}>
    <View style={{marginTop:2,marginLeft:2}}>
    <Image source={require('../Assets/row5_btn5.png')} style={{height:22,width:53}}></Image> 
    </View>
    </View>
    <TouchableOpacity style={{alignItems:'center',backgroundColor:'#D9D9D9',marginLeft:8, borderRadius:10,height:25,width:51,marginTop:1}}>
    <Text style={{fontSize:16,fontWeight:'bold'}}>S⇔D</Text>
    </TouchableOpacity>
  </View>

  <View>
  <View style={{marginLeft:6}}>
    <View style={{marginBottom:2,marginTop:3}}>
    <Text style={{color:'white'}}>M-    m</Text>
    </View>
    </View>
    <TouchableOpacity style={{alignItems:'center',backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:52,marginTop:1,marginLeft:6}} onPress={()=>{handlevariables('m')}}>
    <Text style={{fontSize:16,fontWeight:'bold'}}>M+</Text>
    </TouchableOpacity>
  </View>

</View>

{/* row6 */}
<View style={{flexDirection:'row',marginTop:6}}>

<View>
  <View style={{marginLeft:6}}>
    <View style={{marginBottom:2,marginTop:6}}>
    <Text style={{marginLeft:14,color:'white'}}>CONST</Text>
    </View>
    </View>
    <TouchableOpacity style={{alignItems:'center',backgroundColor:'#D9D9D9', borderRadius:10,height:32,width:55,marginTop:1,marginLeft:18}}
    onPress={()=>handleNumberClick(7)}>
    <Text style={{alignItems:'center',fontSize:20,fontWeight:'bold',marginTop:3}}>7</Text>
    </TouchableOpacity>
  </View>

  <View>
  <View style={{marginLeft:6}}>
    <View style={{marginBottom:2,marginTop:6}}>
    <Text style={{marginLeft:6,color:'white'}}>CONV  SI</Text>
    </View>
    </View>
    <TouchableOpacity style={{alignItems:'center',backgroundColor:'#D9D9D9', borderRadius:10,height:32,width:55,marginTop:1,marginLeft:18}}
    onPress={()=>handleNumberClick(8)}>
    <Text style={{alignItems:'center',fontSize:20,fontWeight:'bold',marginTop:3}}>8</Text>
    </TouchableOpacity>
  </View>

  <View>
  <View style={{marginLeft:6}}>
    <View style={{marginBottom:2,marginTop:6}}>
    <Text style={{marginLeft:14,color:'white'}}>Limit</Text>
    </View>
    </View>
    <TouchableOpacity style={{alignItems:'center',backgroundColor:'#D9D9D9', borderRadius:10,height:32,width:55,marginTop:1,marginLeft:18}}
    onPress={()=>handleNumberClick(9)}>
    <Text style={{alignItems:'center',fontSize:20,fontWeight:'bold',marginTop:3}}>9</Text>
    </TouchableOpacity>
  </View>

  <View>
  <View style={{marginLeft:6}}>
    <View style={{marginBottom:2,marginTop:6}}>
    <Text style={{marginLeft:20,color:'white'}}></Text>
    </View>
    </View>
    <TouchableOpacity style={{alignItems:'center',backgroundColor:'#E07D31', borderRadius:10,height:32,width:55,marginTop:1,marginLeft:18}}
    onPress={()=>handleBackspace()}>
    <Text style={{color:'black',fontSize:23,fontWeight:'bold'}}>⌫</Text>
    </TouchableOpacity>
  </View>

  <View>
  <View style={{marginLeft:6}}>
    <View style={{marginBottom:2,marginTop:6}}>
    <Text style={{marginLeft:10,color:'white'}}>CLR ALL</Text>
    </View>
    </View>
    <TouchableOpacity style={{alignItems:'center',backgroundColor:'#E07D31', borderRadius:10,height:32,width:55,marginTop:1,marginLeft:15}}
    onPress={()=>handleClear()}>
    <Text style={{marginLeft:12,color:'black',fontSize:18,fontWeight:'bold',marginTop:3,marginLeft:2}}>AC</Text>
    </TouchableOpacity>
  </View>

</View>
{/* row7 */}
<View style={{flexDirection:'row',marginTop:6}}>

<View>
  <View style={{marginLeft:6}}>
    <View style={{marginBottom:2,marginTop:6}}>
    <Text style={{marginLeft:14,color:'white'}}>MATRIX</Text>
    </View>
    </View>
    <TouchableOpacity style={{alignItems:'center',backgroundColor:'#D9D9D9', borderRadius:10,height:32,width:55,marginTop:1,marginLeft:18}}
    onPress={() => handleNumberClick(4)}>
    <Text style={{alignItems:'center',fontSize:20,fontWeight:'bold',marginTop:3}}>4</Text>
    </TouchableOpacity>
  </View>

  <View>
  <View style={{marginLeft:6}}>
    <View style={{marginBottom:2,marginTop:6}}>
    <Text style={{marginLeft:8,color:'white'}}>VECTOR</Text>
    </View>
    </View>
    <TouchableOpacity style={{alignItems:'center',backgroundColor:'#D9D9D9', borderRadius:10,height:32,width:55,marginTop:1,marginLeft:18}}
    onPress={() => handleNumberClick(5)}>
    <Text style={{alignItems:'center',fontSize:20,fontWeight:'bold',marginTop:3}}>5</Text>
    </TouchableOpacity>
  </View>

  <View>
  <View style={{marginLeft:6}}>
    <View style={{marginBottom:2,marginTop:6}}>
    <Text style={{marginLeft:4,color:'white'}}>FUNC HELP</Text>
    </View>
    </View>
    <TouchableOpacity style={{alignItems:'center',backgroundColor:'#D9D9D9', borderRadius:10,height:32,width:55,marginTop:1,marginLeft:18}}
    onPress={()=>handleNumberClick(6)}>
    <Text style={{alignItems:'center',fontSize:20,fontWeight:'bold',marginTop:3}}>6</Text>
    </TouchableOpacity>
  </View>

  <View>
  <View style={{marginLeft:6}}>
    <View style={{marginBottom:2,marginTop:6}}>
    <Text style={{marginLeft:4,color:'white'}}>nPr GCD</Text>
    </View>
    </View>
    <TouchableOpacity style={{alignItems:'center',backgroundColor:'#D9D9D9', borderRadius:10,height:32,width:55,marginTop:1,marginLeft:8}}
    onPress={()=>handleOperatorClick('X')}>
    <Text style={{color:'black',fontSize:18,fontWeight:'bold',marginTop:4}}>X</Text>
    </TouchableOpacity>
  </View>

  <View>
  <View style={{marginLeft:6}}>
    <View style={{marginBottom:2,marginTop:6}}>
    <Text style={{marginLeft:4,color:'white'}}>nCr LCM</Text>
    </View>
    </View>
    <TouchableOpacity style={{alignItems:'center',backgroundColor:'#D9D9D9', borderRadius:10,height:32,width:55,marginTop:1,marginLeft:12}}
    onPress={()=>handleOperatorClick('÷')}>
    <Text style={{marginLeft:6,color:'black',fontSize:24,fontWeight:'bold',marginLeft:2}}>÷</Text>
    </TouchableOpacity>
  </View>

</View>
{/* row8 */}
<View style={{flexDirection:'row',marginTop:6}}>


<View>
  <View style={{marginLeft:6}}>
    <View style={{marginBottom:2,marginTop:6}}>
    <Text style={{marginLeft:14,color:'white'}}>STAT</Text>
    </View>
    </View>
    <TouchableOpacity style={{alignItems:'center',backgroundColor:'#D9D9D9', borderRadius:10,height:32,width:55,marginTop:1,marginLeft:18}}
    onPress={()=>handleNumberClick(1)}>
    <Text style={{alignItems:'center',fontSize:20,fontWeight:'bold',marginTop:3}}>1</Text>
    </TouchableOpacity>
  </View>

  <View>
  <View style={{marginLeft:6}}>
    <View style={{marginBottom:2,marginTop:6}}>
    <Text style={{marginLeft:8,color:'white'}}>COMPLX</Text>
    </View>
    </View>
    <TouchableOpacity style={{alignItems:'center',backgroundColor:'#D9D9D9', borderRadius:10,height:32,width:55,marginTop:1,marginLeft:18}}
    onPress={()=>handleNumberClick(2)}>
    <Text style={{alignItems:'center',fontSize:20,fontWeight:'bold',marginTop:3}}>2</Text>
    </TouchableOpacity>
  </View>

  <View>
  <View style={{marginLeft:6}}>
    <View style={{marginBottom:2,marginTop:6}}>
    <Text style={{marginLeft:16,color:'white'}}>DISTR</Text>
    </View>
    </View>
    <TouchableOpacity style={{alignItems:'center',backgroundColor:'#D9D9D9', borderRadius:10,height:32,width:55,marginTop:1,marginLeft:18}}
    onPress={()=>handleNumberClick(3)}>
    <Text style={{alignItems:'center',fontSize:20,fontWeight:'bold',marginTop:3}}>3</Text>
    </TouchableOpacity>
  </View>

  <View>
  <View style={{marginLeft:6}}>
    <View style={{marginBottom:2,marginTop:6}}>
    <Text style={{marginLeft:12,color:'white'}}>Pol   Cell</Text>
    </View>
    </View>
    <TouchableOpacity style={{alignItems:'center',backgroundColor:'#D9D9D9', borderRadius:10,height:32,width:55,marginTop:1,marginLeft:19}}
    onPress={()=>handleOperatorClick('+')}>
    <Text style={{color:'black',fontSize:24,fontWeight:'bold'}}>+</Text>
    </TouchableOpacity>
  </View>

  <View>
  <View style={{marginLeft:6}}>
    <View style={{marginBottom:2,marginTop:6}}>
    <Text style={{marginLeft:4,color:'white'}}>Rec Floor</Text>
    </View>
    </View>

    <TouchableOpacity style={{alignItems:'center',backgroundColor:'#D9D9D9', borderRadius:10,height:32,width:55,marginTop:1,marginLeft:12}}
    onPress={()=>handleOperatorClick('-')}>
    <Text style={{marginLeft:6,color:'black',fontSize:26,fontWeight:'bold',marginLeft:2}}>-</Text>
    </TouchableOpacity>
  </View>
</View>

<View style={{flexDirection:'row',marginTop:6}}>

<View>
  <View style={{marginLeft:6}}>
    <View style={{marginBottom:2,marginTop:6}}>
    <Text style={{marginLeft:10,color:'white'}}>copy paste</Text>
    </View>
    </View>
    <TouchableOpacity style={{alignItems:'center',backgroundColor:'#D9D9D9', borderRadius:10,height:32,width:55,marginTop:1,marginLeft:18}}
    onPress={()=>handleNumberClick('0')}>
    <Text style={{alignItems:'center',fontSize:20,fontWeight:'bold',marginTop:3}}>0</Text>
    </TouchableOpacity>
  </View>

  <View>
  <View style={{marginLeft:6}}>
    <View style={{marginBottom:2,marginTop:6}}>
    <Text style={{marginLeft:2,color:'white'}}>Ran# RanInt</Text>
    </View>
    </View>
    <TouchableOpacity style={{alignItems:'center',backgroundColor:'#D9D9D9', borderRadius:10,height:32,width:55,marginTop:1,marginLeft:7}}
    onPress={()=>handleDecimalClick()}>
    <Text style={{alignItems:'center',fontSize:20,fontWeight:'bold',marginTop:3}}>.</Text>
    </TouchableOpacity>
  </View>

  <View>
  <View style={{marginLeft:6}}>
    <View style={{marginBottom:2,marginTop:6}}>
    <Text style={{marginLeft:4,color:'white'}}>π      e</Text>
    </View>
    </View>
    <TouchableOpacity style={{alignItems:'center',backgroundColor:'#D9D9D9', borderRadius:10,height:32,width:55,marginTop:1}}>
    <Text style={{alignItems:'center',fontSize:20,fontWeight:'bold',marginTop:3}}>Exp</Text>
    </TouchableOpacity>
  </View>

  <View>
  <View style={{marginLeft:6}}>
    <View style={{marginBottom:2,marginTop:6}}>
    <Text style={{marginLeft:10,color:'white'}}>PreAns</Text>
    </View>
    </View>
    <TouchableOpacity style={{alignItems:'center',backgroundColor:'#D9D9D9', borderRadius:10,height:32,width:55,marginTop:1,marginLeft:14}}
    onPress={handleAns}>
    <Text style={{color:'black',fontSize:18,fontWeight:'bold',marginTop:4}}>Ans</Text>
    </TouchableOpacity>
  </View>

  <View>
  <View style={{marginLeft:6}}>
    <View style={{marginBottom:2,marginTop:6}}>
    <Text style={{marginLeft:10,color:'white'}}>History</Text>
    </View>
    </View>
    <TouchableOpacity style={{alignItems:'center',backgroundColor:'#D9D9D9', borderRadius:10,height:32,width:55,marginTop:1,marginLeft:12}}
    onPress={()=>handleEquals()}>
    <Text style={{marginLeft:6,color:'black',fontSize:24,fontWeight:'bold',marginLeft:2}}>=</Text>
    </TouchableOpacity>
  </View>



</View>

 </SafeAreaView>
)



}
const ss=StyleSheet.create({
mainView: {
    padding:10,
    backgroundColor:'black'
},
textInput:{
    height:80,
    backgroundColor:'#D3EBD3',
    borderRadius:10,
    fontSize:16
},
textInput:{
  height:80,
  backgroundColor:'#D3EBD3',
  borderBottomEndRadius:10,
  fontSize:16
},
modebtn:{
    backgroundColor:'#343A46',
    height:25,
    width:60,
    borderTopLeftRadius:5,
    borderTopRightRadius:5,
    borderBottomRightRadius:15,
    borderBottomLeftRadius:15,
    marginLeft:10,
    marginTop:10,
    alignItems:'center',
    

},

modebtnView:{
flexDirection:'row',

},
modetxt:{
    color:'white',
    fontSize:16,

},
graphbtn:{
    backgroundColor:'red',
    height:26,
    width:60,
    borderRadius:10,
    marginTop:40,
    alignItems:'center',
    marginLeft:70
    

},
row1btn:{
flexDirection:'row',
marginTop:20
},
onshiftPress:{
  alignItems:'center',
  marginLeft:10,
  backgroundColor:'yellow', 
  borderRadius:10,
  height:25,
  width:50
},
withoutshiftPress:{
alignItems:'center',marginLeft:10,backgroundColor:'white', borderRadius:10,height:25,width:50
}});
export default Main;