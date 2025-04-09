import React, {useState, useEffect, useRef} from "react";
import { View, SafeAreaView, TextInput, StyleSheet, TouchableOpacity, Text, Image} from "react-native";

// Constants
const PI = 3.141592653589793;
const E = 2.718281828459045;

// Function to calculate factorial
const factorial = (n) => {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
};

// Function to calculate power (x^y)
const power = (x, y) => {
  if (y === 0) return 1;
  if (y < 0) return 1 / power(x, -y);
  
  let result = 1;
  for (let i = 0; i < y; i++) {
    result *= x;
  }
  return result;
};

// Function to calculate square root using Babylonian method
const sqrt = (x) => {
  if (x < 0) return NaN;
  if (x === 0) return 0;
  
  let guess = x / 2;
  let prevGuess = 0;
  const precision = 1e-10;
  
  while (abs(guess - prevGuess) > precision) {
    prevGuess = guess;
    guess = (guess + x / guess) / 2;
  }
  return guess;
};

// Absolute value function
const abs = (x) => {
  return x < 0 ? -x : x;
};

// Function to convert degrees to radians
const toRadians = (degrees) => {
  return degrees * PI / 180;
};

// Function to convert grads to radians
const toRadiansFromGrads = (grads) => {
  return grads * PI / 200;
};

// Function to normalize angle to [-π, π]
const normalizeAngle = (radians) => {
  const twoPi = 2 * PI;
  return radians - twoPi * floor((radians + PI) / twoPi);
};

// Floor function
const floor = (x) => {
  return x >= 0 ? ~~x : ~~x - 1;
};

// Sine function using Taylor series (7 terms)
const taylorSin = (x) => {
  x = normalizeAngle(x);
  let sum = 0;
  for (let n = 0; n < 7; n++) {
    const term = power(-1, n) * power(x, 2 * n + 1) / factorial(2 * n + 1);
    sum += term;
  }
  return sum;
};

// Cosine function using Taylor series (7 terms)
const taylorCos = (x) => {
  x = normalizeAngle(x);
  let sum = 0;
  for (let n = 0; n < 7; n++) {
    const term = power(-1, n) * power(x, 2 * n) / factorial(2 * n);
    sum += term;
  }
  return sum;
};

// Tangent function using sine and cosine
const taylorTan = (x) => {
  const cos = taylorCos(x);
  if (abs(cos) < 1e-10) return Infinity; // Prevent division by zero
  return taylorSin(x) / cos;
};

// Arc sine function using Taylor series
const taylorAsin = (x) => {
  if (x < -1 || x > 1) return NaN;
  if (x === 1) return PI / 2;
  if (x === -1) return -PI / 2;
  
  let sum = x;
  let term = x;
  let n = 1;
  
  while (abs(term) > 1e-10) {
    term *= x * x * (2 * n - 1) * (2 * n - 1) / ((2 * n) * (2 * n + 1));
    sum += term;
    n++;
    if (n > 100) break; // Prevent infinite loops
  }
  return sum;
};

// Arc cosine function using arc sine
const taylorAcos = (x) => {
  return PI / 2 - taylorAsin(x);
};

// Arc tangent function using Taylor series
const taylorAtan = (x) => {
  if (abs(x) > 1) {
    return (PI / 2) - taylorAtan(1 / x);
  }
  
  let sum = x;
  let term = x;
  let n = 1;
  
  while (abs(term) > 1e-10) {
    term *= -x * x;
    sum += term / (2 * n + 1);
    n++;
    if (n > 100) break; // Prevent infinite loops
  }
  return sum;
};

// Hyperbolic sine function using Taylor series
const taylorSinh = (x) => {
  let sum = 0;
  for (let n = 0; n < 10; n++) {
    const term = power(x, 2 * n + 1) / factorial(2 * n + 1);
    sum += term;
  }
  return sum;
};

// Hyperbolic cosine function using Taylor series
const taylorCosh = (x) => {
  let sum = 0;
  for (let n = 0; n < 10; n++) {
    const term = power(x, 2 * n) / factorial(2 * n);
    sum += term;
  }
  return sum;
};

// Hyperbolic tangent function using sinh and cosh
const taylorTanh = (x) => {
  const cosh = taylorCosh(x);
  if (abs(cosh) < 1e-10) return Infinity; // Prevent division by zero
  return taylorSinh(x) / cosh;
};

// Natural logarithm using Taylor series
const taylorLn = (x) => {
  if (x <= 0) return NaN;
  if (x === 1) return 0;
  
  // For x > 2, use ln(x) = -ln(1/x)
  if (x > 2) {
    return -taylorLn(1 / x);
  }
  
  // Adjust for better convergence
  let y = (x - 1) / (x + 1);
  let sum = 0;
  let term = y;
  let n = 1;
  
  while (abs(term) > 1e-10) {
    sum += term / n;
    term *= y * y;
    n += 2;
    if (n > 100) break; // Prevent infinite loops
  }
  return 2 * sum;
};

function Main({navigation, ActualMode, setActualMode}){

  // State variables
  const [expressionInput, setExpressionInput] = useState(''); 
  const [resultInput, setResultInput] = useState('');
  const [shift, setshift] = useState(false);
  const [DRG, setDRG] = useState('DEG');
  const [alpha, setalpha] = useState(false);
  const [SA, setSA] = useState('off');
  const [currentExpression, setCurrentExpression] = useState('');
  const [lastResult, setLastResult] = useState('');
  const [cursorPosition, setCursorPosition] = useState(null);
  const [isEnteringExponent, setIsEnteringExponent] = useState(false);
  const [baseStartPosition, setBaseStartPosition] = useState(null);
  const [exponentStartPosition, setExponentStartPosition] = useState(null);
  const [functionType, setFunctionType] = useState(null); // Tracks which special function is being used
  const [firstPlaceholderPosition, setFirstPlaceholderPosition] = useState(null);
  const [secondPlaceholderPosition, setSecondPlaceholderPosition] = useState(null);
  // Create a reference to the input field
  const inputRef = useRef(null);
  
  // Special tokens that should be deleted as a whole
  const specialTokens = [
    'sin', 'cos', 'tan', 'hyp', 'log', 'ln', 
    'sin⁻¹', 'cos⁻¹', 'tan⁻¹', 'sinh', 'cosh', 'tanh'
  ];
  
  // Focus the input field when the component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handlexDividey = () => {
    const currentPos = cursorPosition !== null ? cursorPosition : expressionInput.length;
    const newExpression = expressionInput.substring(0, currentPos) + "□/□" + 
                         expressionInput.substring(currentPos);
    
    setExpressionInput(newExpression);
    setFirstPlaceholderPosition(currentPos);
    setSecondPlaceholderPosition(currentPos + 2);
    setFunctionType('x/y');
    setIsEnteringExponent(false);
    setCursorPosition(currentPos + 1); // Position cursor after first box
  };

  const handleSqrt = () => {
    const currentPos = cursorPosition !== null ? cursorPosition : expressionInput.length;
    const newExpression = expressionInput.substring(0, currentPos) + "√□" + 
                         expressionInput.substring(currentPos);
    
    setExpressionInput(newExpression);
    setFirstPlaceholderPosition(currentPos + 1);
    setFunctionType('sqrt');
    setCursorPosition(currentPos + 2); // Position cursor after box
  };

  // Implementation for x^-1 button (reciprocal)
  const handleReciprocal = () => {
    const currentPos = cursorPosition !== null ? cursorPosition : expressionInput.length;
    const newExpression = expressionInput.substring(0, currentPos) + "□^(-1)" + 
                         expressionInput.substring(currentPos);
    
    setExpressionInput(newExpression);
    setFirstPlaceholderPosition(currentPos);
    setFunctionType('reciprocal');
    setCursorPosition(currentPos + 1); // Position cursor after box
  };

const handleLog2 = () => {
  const currentPos = cursorPosition !== null ? cursorPosition : expressionInput.length;
  const newExpression = expressionInput.substring(0, currentPos) + "log₂(□)" + 
                       expressionInput.substring(currentPos);
  
  setExpressionInput(newExpression);
  setFirstPlaceholderPosition(currentPos + 5);
  setFunctionType('log2');
  setCursorPosition(currentPos + 6); // Position cursor after box
};

const handlexPowery = () => {
  const currentPos = cursorPosition !== null ? cursorPosition : expressionInput.length;
  const newExpression = expressionInput.substring(0, currentPos) + "□^□" + 
                       expressionInput.substring(currentPos);
  
  setExpressionInput(newExpression);
  setBaseStartPosition(currentPos);
  setExponentStartPosition(currentPos + 2);
  setIsEnteringExponent(false);
  setCursorPosition(currentPos + 1); // Position cursor after first box
};

// Base-10 logarithm using natural log
const taylorLog10 = (x) => {
  return taylorLn(x) / taylorLn(10);
};
  // Function to handle square button
  const handlesquare = (btnvalue) => {
    if(btnvalue === 'x²'){
      setExpressionInput(expressionInput + '^2');
    }
  }

  // Handle variables and functions
  const handlevariables = (variable) => {
    if(shift === true && variable === 'a'){
      setExpressionInput(expressionInput + 'A');
    }
    else if (shift === true && variable === 'b'){
      setExpressionInput(expressionInput + 'b');
    }
    else if (shift === true && variable === 'c'){
      setExpressionInput(expressionInput + 'c');
    }
    else if (shift === true && variable === 'd'){
      setExpressionInput(expressionInput + 'sin⁻¹');
    }
    else if (shift === true && variable === 'e'){
      setExpressionInput(expressionInput + 'cos⁻¹');
    }
    else if (shift === true && variable === 'f'){
      setExpressionInput(expressionInput + 'tan⁻¹');
    }
    else if (shift === true && variable === 't'){
      setExpressionInput(expressionInput + 't');
    }
    else if (shift === false && variable === 'c'){
      setExpressionInput(expressionInput + 'hyp');
    }
    else if (shift === false && variable === 'd'){
      setExpressionInput(expressionInput + 'sin');
    }
    else if (shift === false && variable === 'e'){
      setExpressionInput(expressionInput + 'cos');
    }
    else if (shift === false && variable === 'f'){
      setExpressionInput(expressionInput + 'tan');
    }
    else if (shift === false && variable === '('){
      setExpressionInput(expressionInput + '(');
    }
    else if (shift === false && variable === ')'){
      setExpressionInput(expressionInput + ')');
    }
    else if (shift === true && variable === 'm'){
      setExpressionInput(expressionInput + 'm');
    }
    else if(shift === false && variable === 'Log'){
      setExpressionInput(expressionInput + 'log');
    }
    else if(shift === false && variable === 't'){
      setExpressionInput(expressionInput + 'ln');
    }
    else if(shift === true && variable === ')'){
      setExpressionInput(expressionInput + 'x');
    }
  }

  const handleNumberClick = (number) => {
    const currentPos = cursorPosition !== null ? cursorPosition : expressionInput.length;
    
    if (currentPos < expressionInput.length && expressionInput[currentPos] === '□') {
      // Replace box with number
      const newExpression = expressionInput.substring(0, currentPos) + 
                           number + 
                           expressionInput.substring(currentPos + 1);
      setExpressionInput(newExpression);
      setCursorPosition(currentPos + 1);
    } else {
      // Insert number at cursor position
      const newExpression = expressionInput.substring(0, currentPos) + 
                           number + 
                           expressionInput.substring(currentPos);
      setExpressionInput(newExpression);
      setCursorPosition(currentPos + 1);
    }
  };

  const resetPlaceholderState = () => {
    setFunctionType(null);
    setFirstPlaceholderPosition(null);
    setSecondPlaceholderPosition(null);
    setBaseStartPosition(null);
    setExponentStartPosition(null);
    setIsEnteringExponent(false);
  };

  // Function to handle operator clicks
  const handleOperatorClick = (operator) => {
    setExpressionInput(expressionInput + operator);
  };

  // Move to graph view
  const movetograph = () => {
    navigation.navigate('Graph', { graphvalue: expressionInput });
  }

  // Handle decimal point
  const handleDecimalClick = () => {
    // Check if the last number in the expression already has a decimal
    const parts = expressionInput.split(/[\+\-X÷]/);
    const lastPart = parts[parts.length - 1];
    
    if (!lastPart.includes('.')) {
      setExpressionInput(expressionInput + '.');
    }
  };

  // Find if the expression ends with a special token
  const findSpecialToken = (expression) => {
    for (const token of specialTokens) {
      if (expression.endsWith(token)) {
        return token;
      }
    }
    return null;
  };

  // Enhanced backspace function
  const handleBackspace = () => {
    if (expressionInput.length > 0) {
      const currentPos = cursorPosition !== null ? cursorPosition : expressionInput.length;
      
      if (currentPos > 0) {
        // Check if we're deleting a special token
        const token = findSpecialToken(expressionInput.substring(0, currentPos));
        
        if (token) {
          // Delete entire token
          const newExpression = expressionInput.substring(0, currentPos - token.length) + 
                               expressionInput.substring(currentPos);
          setExpressionInput(newExpression);
          setCursorPosition(currentPos - token.length);
        } else {
          // Delete single character at cursor position
          const newExpression = expressionInput.substring(0, currentPos - 1) + 
                               expressionInput.substring(currentPos);
          setExpressionInput(newExpression);
          setCursorPosition(currentPos - 1);
        }
      }
    }
  };

  const evaluateExpression = (expr) => {
    // Replace operators for JavaScript evaluation
    expr = expr.replace(/X/g, '*');
    expr = expr.replace(/÷/g, '/');
    expr = expr.replace(/\^/g, '**');
    
    // Handle special functions
    expr = expr.replace(/√(\d+)/g, 'sqrt($1)');
    expr = expr.replace(/log₂\(([^)]+)\)/g, '(taylorLn($1)/taylorLn(2))');
    
    // Original function replacements
    expr = expr.replace(/sin\(/g, 'taylorSin(');
    expr = expr.replace(/cos\(/g, 'taylorCos(');
    expr = expr.replace(/tan\(/g, 'taylorTan(');
    expr = expr.replace(/log\(/g, 'taylorLog10(');
    expr = expr.replace(/ln\(/g, 'taylorLn(');
    
    // Handle inverse trig functions
    expr = expr.replace(/sin⁻¹\(/g, 'taylorAsin(');
    expr = expr.replace(/cos⁻¹\(/g, 'taylorAcos(');
    expr = expr.replace(/tan⁻¹\(/g, 'taylorAtan(');
    
    // Handle hyperbolic functions
    expr = expr.replace(/sinh\(/g, 'taylorSinh(');
    expr = expr.replace(/cosh\(/g, 'taylorCosh(');
    expr = expr.replace(/tanh\(/g, 'taylorTanh(');
    
    // Handle angle conversions based on DRG mode
    // ... [rest of the function continues as before]
    
    try {
      // Create a function that has access to all the math helper functions in its scope
      const evalInScope = new Function(
        'PI', 'E', 'factorial', 'power', 'sqrt', 'abs', 
        'toRadians', 'toRadiansFromGrads', 'normalizeAngle', 'floor',
        'taylorSin', 'taylorCos', 'taylorTan', 
        'taylorAsin', 'taylorAcos', 'taylorAtan',
        'taylorSinh', 'taylorCosh', 'taylorTanh',
        'taylorLn', 'taylorLog10',
        'return ' + expr
      );
      
      // Execute the function with all necessary parameters
      const result = evalInScope(
        PI, E, factorial, power, sqrt, abs, 
        toRadians, toRadiansFromGrads, normalizeAngle, floor,
        taylorSin, taylorCos, taylorTan,
        taylorAsin, taylorAcos, taylorAtan,
        taylorSinh, taylorCosh, taylorTanh,
        taylorLn, taylorLog10
      );
      
      return result;
    } catch (error) {
      console.error("Evaluation error:", error);
      return "Error";
    }
  };

  // Function to handle equals button
 // Modify your handleEquals to handle the x^y special case
 const handleEquals = () => {
  try {
    // Normal equation evaluation
    if (expressionInput) {
      const result = evaluateExpression(expressionInput);
      setResultInput(result.toString());
      setLastResult(result.toString());
    }
  } catch (error) {
    console.error("Calculation error:", error);
    setResultInput('Error');
  }
};

  // Function to handle clear (AC) button
  const handleClear = () => {
    setExpressionInput('');
    setResultInput('');
  };

  // Function to handle the Ans button
  const handleAns = () => {
    if (lastResult) {
      setExpressionInput(expressionInput + lastResult);
    }
  };

  // Shift handling
  const ShiftHandling = () => {
    setshift(!shift);
  }

  // Alpha handling
  const AlphaHandling = () => {
    setalpha(!alpha);
  }

  // Shift-Alpha handling
  const ShiftAplhaHandling = () => {
    if(alpha === false && shift === true){
      setSA('S');
    }
    else if(alpha === true && shift === false){
      setSA('A');
    }
    else if(alpha === false && shift === false){
      setSA('off');
    }
    else if(alpha === true && shift === true){
      setalpha(false);
      setshift(false);
      setSA('off');
    }
  }

  // Mode handling
  const ModeHandling = () => {
    if(shift === true){
      navigation.navigate('ShiftMode');
    }
    else if(shift === false){
      navigation.navigate('SimpleMode');
    }
  }

  // DRG handling
  const DRGHandling = () => {
    if(DRG === 'DEG'){
      setDRG('RAD');
    }
    else if(DRG === 'RAD'){
      setDRG('GRAD');
    }
    else{
      setDRG('DEG');
    }
  }

  useEffect(() => {
    ShiftAplhaHandling();
  }, [shift, alpha]);

  return(
    <SafeAreaView style={ss.mainView}>
      <View style={{marginTop:22}}>
      <TextInput 
  ref={inputRef}
  style={ss.textInput} 
  multiline={true}  
  onChangeText={(text) => {
    setExpressionInput(text);
    // Maintain cursor position
    if (inputRef.current && cursorPosition !== null) {
      inputRef.current.setNativeProps({
        selection: { start: cursorPosition, end: cursorPosition }
      });
    }
  }}
  value={expressionInput}  
  editable={true}  
  showSoftInputOnFocus={false}
  caretHidden={false}
  autoFocus={true}
  onSelectionChange={(event) => {
    const {selection} = event.nativeEvent;
    setCursorPosition(selection.start);
  }}
/>

        <TextInput 
          style={ss.textInput} 
          multiline={true}  
          onChangeText={setResultInput} 
          value={resultInput} 
          editable={false}
        />
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
        <View>
          <TouchableOpacity style={ss.graphbtn} onPress={()=>movetograph()}>
            <Text style={{marginTop:2}}>GRAPH</Text> 
          </TouchableOpacity>
        </View>
      </View>

      {/* row 1 */}  
      <View style={ss.row1btn}>
        <TouchableOpacity   
          style={shift ? ss.onshiftPress : ss.withoutshiftPress}
          onPress={ShiftHandling}>
          <Text>Shift</Text> 
        </TouchableOpacity>

        <TouchableOpacity 
          style={{alignItems:'center',marginLeft:10,backgroundColor:'#6792E9', borderRadius:10,height:25,width:50}} 
          onPress={AlphaHandling}>
          <Text>Alpha</Text> 
        </TouchableOpacity>

        <TouchableOpacity style={{alignItems:'center',marginLeft:10,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:50}}>
          <Image source={require('../Assets/leftArrow.png')} style={{height:15,width:15,marginTop:4}}></Image>
        </TouchableOpacity>

        <TouchableOpacity style={{alignItems:'center',marginLeft:10,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:50}} onPress={()=>handleEquals()}>
          <Image source={require('../Assets/rightArrow.png')} style={{height:15,width:15,marginTop:4}}></Image> 
        </TouchableOpacity>

        <TouchableOpacity  
          style={{alignItems:'center',marginLeft:20,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:70}} 
          onPress={ModeHandling}>
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
          <TouchableOpacity style={{alignItems:'center',marginLeft:10,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:50}} onPress={()=>{handleReciprocal()}}>
            <Text style={{fontSize:19}}>x⁻¹</Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text style={{color:'white', marginLeft:30}}>∑</Text>
          <TouchableOpacity style={{alignItems:'center',marginLeft:10,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:55}} onPress={()=>{handleLog2}}>
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
          <TouchableOpacity style={{alignItems:'center',marginLeft:10,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:50}} onPress={()=>{handlexDividey()}}>
            <Text style={{fontWeight:'bold',fontSize:16,marginBottom:4}}>x/y</Text>
          </TouchableOpacity>
        </View>

        <View>
          <View style={{marginLeft:11}}>
            <Image source={require('../Assets/row3_btn2.png')} style={{height:20,width:45,marginTop:2}}></Image> 
          </View>
          <TouchableOpacity style={{alignItems:'center',marginLeft:10,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:50}} onPress={()=>{handleSqrt()}}>
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
          <TouchableOpacity style={{alignItems:'center',marginLeft:10,backgroundColor:'#D9D9D9', borderRadius:10,height:25,width:50}} onPress={()=>{handlexPowery()}}>
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

      {/* row9 */}
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
  );
}

const ss = StyleSheet.create({
  mainView: {
    padding: 10,
    backgroundColor: 'black'
  },
  textInput: {
    height: 80,
    backgroundColor: '#D3EBD3',
    borderBottomEndRadius: 10,
    fontSize: 16
  },
  modebtn: {
    backgroundColor: '#343A46',
    height: 25,
    width: 60,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    marginLeft: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  modebtnView: {
    flexDirection: 'row',
  },
  modetxt: {
    color: 'white',
    fontSize: 16,
  },
  graphbtn: {
    backgroundColor: 'red',
    height: 26,
    width: 60,
    borderRadius: 10,
    marginTop: 40,
    alignItems: 'center',
    marginLeft: 70
  },
  row1btn: {
    flexDirection: 'row',
    marginTop: 20
  },
  onshiftPress: {
    alignItems: 'center',
    marginLeft: 10,
    backgroundColor: 'yellow', 
    borderRadius: 10,
    height: 25,
    width: 50
  },
  withoutshiftPress: {
    alignItems: 'center',
    marginLeft: 10,
    backgroundColor: 'white', 
    borderRadius: 10,
    height: 25,
    width: 50
  }
});

export default Main;