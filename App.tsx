import React from 'react';
import { SafeAreaView, StatusBar, useColorScheme } from 'react-native';
import Login from './components/login'; 
import {
  Colors
} from 'react-native/Libraries/NewAppScreen';

function App(): JSX.Element {
  return (
      <Login /> 
  );
}


export default App;
