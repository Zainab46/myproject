import React,{useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import Main from './Main';
import SimpleMode from './SimpleMode';
import ShiftMode from './ShiftMode';
import Stat from './SimpleModeScreens.js/Stat';
import Base_N from './SimpleModeScreens.js/Base_N';
import Eqn from './SimpleModeScreens.js/Eqn';
import Matrix from './SimpleModeScreens.js/Matrix';
import Table from './SimpleModeScreens.js/Table';
import Vector from './SimpleModeScreens.js/Vector';
import Fix from './ShiftModeScreens.js/Fix';
import Norm from './ShiftModeScreens.js/Norm';
import Sci from './ShiftModeScreens.js/Sci';
import GraphCalculator from '../Graph';
import Shifteight from './ShiftModeScreens.js/Shifteight';
import Shiftseven from './ShiftModeScreens.js/Shiftseven';
const Stack = createStackNavigator();


const Navig = () => {
 const [ActualMode, setActualMode] = useState("COMP");
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main" >
        <Stack.Screen name="Main" options={{ headerShown: false }}>
        {(props) => (
            <Main {...props} ActualMode={ActualMode} setActualMode={setActualMode} />
          )}   
        </Stack.Screen>

        <Stack.Screen name="SimpleMode"  
        options={{headerTitle:'MODE',headerStyle:{backgroundColor:'#434547'},
        headerTitleStyle: { marginLeft:100,color: 'white', fontWeight: 'bold' },
        headerTintColor: 'white',
        gestureDirection: 'horizontal-inverted', 
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,}}>
        {(props) => (
            <SimpleMode {...props} ActualMode={ActualMode} setActualMode={setActualMode} />
          )}   
        </Stack.Screen>

          <Stack.Screen name="ShiftMode" component={ShiftMode}
          options={{headerTitle:'MODE',headerStyle:{backgroundColor:'#434547'},
          headerTitleStyle: { marginLeft:100,color: 'white', fontWeight: 'bold' },
          headerTintColor: 'white',
          gestureDirection: 'horizontal-inverted', 
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,}} />
       
       <Stack.Screen name="Stat" component={Stat} 
        options={{headerStyle:{backgroundColor:'#434547'},
        headerTitleStyle: { marginLeft:100,color: 'white', fontWeight: 'bold' },
        headerTintColor: 'white',
        gestureDirection: 'horizontal-inverted', 
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,}} />

        
       <Stack.Screen name="Base_N" component={Base_N} 
        options={{headerStyle:{backgroundColor:'#434547'},
        headerTitleStyle: { marginLeft:100,color: 'white', fontWeight: 'bold' },
        headerTintColor: 'white',
        gestureDirection: 'horizontal-inverted', 
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,}} />

        
       <Stack.Screen name="Eqn" component={Eqn} 
        options={{headerStyle:{backgroundColor:'#434547'},
        headerTitleStyle: { marginLeft:100,color: 'white', fontWeight: 'bold' },
        headerTintColor: 'white',
        gestureDirection: 'horizontal-inverted', 
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,}} />

<Stack.Screen name="Matrix" component={Matrix} 
        options={{headerStyle:{backgroundColor:'#434547'},
        headerTitleStyle: { marginLeft:100,color: 'white', fontWeight: 'bold' },
        headerTintColor: 'white',
        gestureDirection: 'horizontal-inverted', 
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,}} />

<Stack.Screen name="Table" component={Table} 
        options={{headerStyle:{backgroundColor:'#434547'},
        headerTitleStyle: { marginLeft:100,color: 'white', fontWeight: 'bold' },
        headerTintColor: 'white',
        gestureDirection: 'horizontal-inverted', 
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,}} />

<Stack.Screen name="Vector" component={Vector} 
        options={{headerStyle:{backgroundColor:'#434547'},
        headerTitleStyle: { marginLeft:100,color: 'white', fontWeight: 'bold' },
        headerTintColor: 'white',
        gestureDirection: 'horizontal-inverted', 
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,}} />

        
<Stack.Screen name="Fix" component={Fix} 
        options={{headerStyle:{backgroundColor:'#434547'},
        headerTitleStyle: { marginLeft:100,color: 'white', fontWeight: 'bold' },
        headerTintColor: 'white',
        gestureDirection: 'horizontal-inverted', 
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,}} />

<Stack.Screen name="Norm" component={Norm} 
        options={{headerStyle:{backgroundColor:'#434547'},
        headerTitleStyle: { marginLeft:100,color: 'white', fontWeight: 'bold' },
        headerTintColor: 'white',
        gestureDirection: 'horizontal-inverted', 
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,}} />


<Stack.Screen name="Sci" component={Sci} 
        options={{headerStyle:{backgroundColor:'#434547'},
        headerTitleStyle: { marginLeft:100,color: 'white', fontWeight: 'bold' },
        headerTintColor: 'white',
        gestureDirection: 'horizontal-inverted', 
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,}} />

<Stack.Screen name="Graph" component={GraphCalculator} 
        options={{headerStyle:{backgroundColor:'#434547'},
        headerTitleStyle: { marginLeft:100,color: 'white', fontWeight: 'bold' },
        headerTintColor: 'white',
        gestureDirection: 'horizontal-inverted', 
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,}} />    


        
<Stack.Screen name="Shifteight" component={Shifteight} 
        options={{headerStyle:{backgroundColor:'#434547'},
        headerTitleStyle: { marginLeft:100,color: 'white', fontWeight: 'bold' },
        headerTintColor: 'white',
        gestureDirection: 'horizontal-inverted', 
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerTitle:'Convertions'}} />        


<Stack.Screen name="Shiftseven" component={Shiftseven} 
        options={{headerStyle:{backgroundColor:'#434547'},
        headerTitleStyle: { marginLeft:100,color: 'white', fontWeight: 'bold' },
        headerTintColor: 'white',
        gestureDirection: 'horizontal-inverted', 
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerTitle:'Constants'}} />     

      </Stack.Navigator>

    
    </NavigationContainer>
  );
};

export default Navig;
