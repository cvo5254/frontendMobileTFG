import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

const Footer = () => {
    const handleClick = () => {
      // Aquí puedes realizar las acciones que deseas al hacer clic en el botón
      console.log('Botón del footer clickeado');
    };
  
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={handleClick}>
          <Text style={styles.buttonText}>Inform</Text>
        </TouchableOpacity>
      </View>
    );
  };
  const styles = StyleSheet.create({
    container: {
      backgroundColor: '#8b0000',
      paddingVertical: 10,
      alignItems: 'center',
    },
    button: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: '#ffffff',
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      fontSize: 18,
      fontWeight: 'bold',
    },
  });  
  
export default Footer
