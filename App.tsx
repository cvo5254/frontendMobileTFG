import React from 'react';
import Login from './components/login'; 
import Registro from './components/register';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{title: 'TFG'}}
        />
        <Stack.Screen name="Register" component={Registro}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default App;
