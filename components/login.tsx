import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
    } catch (error) {
      console.error(error); // Maneja cualquier error
    }
  };

  return (
    <View >
      <TextInput
   
        onChangeText={setEmail}
        value={email}
        placeholder="Email"
      />
      <TextInput
      
        onChangeText={setPassword}
        value={password}
        placeholder="Password"
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      <Text >{/* Renderiza mensajes de error aquí si es necesario */}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'gray',
    paddingHorizontal: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default Login;
