import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity ,Button, StyleSheet, Text } from 'react-native';
import ModalComponent from './modal';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    // Lógica de inicio de sesión aquí
    try {
      const response = await fetch("http://10.0.2.2:8000/api/login_movil/", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.text();
      console.log(data); // Haz algo con la respuesta del servidor
      // Si la respuesta es un error, establece el mensaje de error en el estado
      if (response.status !== 200) {
        setErrorMessage(data);
      }
    } catch (error) {
      console.error(error); // Maneja cualquier error
      setErrorMessage('Ha ocurrido un error inesperado');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="Email"
      />
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        placeholder="Password"
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.errorText}>{/* Renderiza mensajes de error aquí si es necesario */}</Text>
      {errorMessage !== '' && <ModalComponent isOpen={true} onClose={() => setErrorMessage('')} message={errorMessage} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 50
  },
  input: {
    width: '100%',
    height: 40,
    marginVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#8b0000',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 10,
  },
  button: {
    width: '100%',
    height: 40,
    backgroundColor: '#8b0000',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});


export default Login;
