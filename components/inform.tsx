import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity } from 'react-native';
import ModalComponent from './modal';
import { UserContext } from '../UserContext';
import { NavigationProp } from '@react-navigation/native';
import type { ParamListBase } from '@react-navigation/native';

interface InformProps {
    navigation: NavigationProp<ParamListBase>;
  }

  
const Inform: React.FC<InformProps> = ({ navigation })  => {  
    const [title, setTitle] = useState('');
    const [channel, setChannel] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');
    const { user } = useContext(UserContext);
    const reporter_id = user ? user.id : null;

    const handleSubmit = async () => {
        try {
          const response = await fetch("http://10.0.2.2:8000/api/crear_emergencia/", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ title, description, channel, reporter_id }),
          });
          const data = await response.json();
          console.log(data);
      
          if (response.status === 200 || response.status === 201) {
            setMessage(data.mensaje)
          } else {
            // El servidor respondió con un estado distinto de 200
            // Aquí puedes manejar el error de acuerdo a tus necesidades
          }
        } catch (error) {
          console.error('Ha ocurrido un error inesperado:', error);
          // Aquí puedes manejar el error de acuerdo a tus necesidades
        }
      };
  
    // Función para obtener los datos del canal mediante un fetch
    /**const obtenerDatosCanal = () => {
      // Realiza el fetch para obtener los datos del canal
      // Ejemplo de cómo obtener datos:
      fetch('https://api.example.com/canales')
        .then(response => response.json())
        .then(data => {
          // Actualiza el estado de canal con los datos obtenidos
          setCanal(data);
        })
        .catch(error => {
          console.error('Error al obtener los datos del canal:', error);
        });
    };
    
    // Ejecuta la función obtenerDatosCanal al montar el componente
    useEffect(() => {
      obtenerDatosCanal();
    }, []);
    */
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Título</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Ingrese el título"
        />
  
        <Text style={styles.label}>Canal</Text>
        <TextInput
          style={styles.input}
          value={channel}
          onChangeText={setChannel}
          placeholder="Seleccione el canal"
        />
  
        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Ingrese la descripción"
          multiline={true}
        />
  
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Enviar</Text>
        </TouchableOpacity>
        {message !== '' && (
        <ModalComponent isOpen={true} onClose={() => {
            setMessage('');
            navigation.goBack();
            }} message={message} />
        )}
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    input: {
      height: 40,
      borderWidth: 1,
      borderColor: '#8b0000',
      marginBottom: 10,
      paddingHorizontal: 10,
    },
    textArea: {
      height: 100,
      textAlignVertical: 'top',
    },
    button: {
      backgroundColor: '#8b0000',
      paddingVertical: 10,
      alignItems: 'center',
      marginTop: 20,
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
  ``
export default Inform;  