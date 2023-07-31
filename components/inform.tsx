import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import ModalComponent from './modal';
import { UserContext } from '../UserContext';
import { NavigationProp } from '@react-navigation/native';
import type { ParamListBase } from '@react-navigation/native';
import Dropdown from './dropdown';
import ImagePicker from 'react-native-image-crop-picker';
import { Image as ImagePickerResponse } from 'react-native-image-crop-picker';
import { PermissionsAndroid } from 'react-native';



interface InformProps {
  navigation: NavigationProp<ParamListBase>;
}

interface Channel {
  id: number;
  nombre: string;
  subscribers: string[];
}




const Inform: React.FC<InformProps> = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [channels, setChannels] = useState<Channel[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [selectedChannelId, setSelectedChannelId] = useState<number | null>(null);
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const { user } = useContext(UserContext);
  const reporter_id = user ? user.id : null;

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('channel_id', selectedChannelId);
      formData.append('reporter_id', reporter_id);
      
      formData.append('images', JSON.stringify(images));

      console.log(formData)
      const response = await fetch(`http://10.0.2.2:8000/api/create_emergency/`, {
        method: "POST",
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
  
      if (response.status === 200 || response.status === 201) {
        setMessage(data.mensaje);
        const emergencyId = data.emergencia.id;
      } else {
        // El servidor respondió con un estado distinto de 200
        // Aquí puedes manejar el error de acuerdo a tus necesidades
      }
    } catch (error) {
      console.error('Ha ocurrido un error inesperado:', error);
      // Aquí puedes manejar el error de acuerdo a tus necesidades
    }
  };
  

  const fetchChannels = () => {
    fetch(`http://10.0.2.2:8000/api/${reporter_id}/subscriptions/`)
      .then(response => response.json())
      .then(data => {
        setChannels(data);
      })
      .catch(error => {
        console.error('Error al obtener los canales:', error);
      });
  };

  useEffect(() => {
    fetchChannels();
  }, []);


  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        {
          title: 'Storage Permission',
          message: 'This app needs access to your storage to function properly.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Storage permission granted');
      } else {
        console.log('Storage permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  
  
  const handleSelectImages = async () => {
    try {
      await requestStoragePermission(); 
      ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
        includeBase64: true,
      }).then((image: ImagePickerResponse | undefined) => {
        const base64Image = image?.data || ''; // Use '' as default value if image is null or undefined
        setImages((prevImages) => [...prevImages, base64Image]);
      });
    } catch (error) {
      console.log('Error al seleccionar imágenes:', error);
    }
  };
  
  
  

  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Ingrese el título"
      />
      <Text style={styles.label}>Canal</Text>
      <Dropdown
        options={channels.map((channel) => ({
          value: channel.id.toString(),
          label: channel.nombre,
        }))}
        onSelect={(option) => setSelectedChannelId(parseInt(option.value))}
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
      <TouchableOpacity style={styles.button} onPress={handleSelectImages}>
        <Text style={styles.buttonText}>Seleccionar Imágenes</Text>
      </TouchableOpacity>
      
      {message !== '' && (
        <ModalComponent isOpen={true} onClose={() => {
          setMessage('');
          navigation.goBack();
        }} message={message} />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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

export default Inform;
