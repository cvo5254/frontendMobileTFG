import React from 'react';
import { SafeAreaView, StatusBar, useColorScheme } from 'react-native';
import Login from './components/login'; 
import {
  Colors
} from 'react-native/Libraries/NewAppScreen';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <Login /> 
    </SafeAreaView>
  );
}


export default App;
