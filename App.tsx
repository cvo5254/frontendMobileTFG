import React from 'react';
import Login from './components/login'; 
import Registro from './components/register';
import Landing from './components/landing';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { UserProvider } from './UserContext';

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{title: 'TFG'}}
          />
          <Stack.Screen name="Register" component={Registro}/>
          <Stack.Screen name="Landing" component={Landing}/>
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}


export default App;
