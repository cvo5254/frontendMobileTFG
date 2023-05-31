import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import ModalComponent from './modal';
import { UserContext } from '../UserContext';
import { NavigationProp } from '@react-navigation/native';
import type { ParamListBase } from '@react-navigation/native';
import Dropdown from './dropdown';

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
  const [channel, setChannel] = useState('');
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannelId, setSelectedChannelId] = useState<number | null>(null);
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const { user } = useContext(UserContext);
  const reporter_id = user ? user.id : null;

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://10.0.2.2:8000/api/crear_emergencia/", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ title, description, channel_id: selectedChannelId, reporter_id }),
      });
      const data = await response.json();

      if (response.status === 200 || response.status === 201) {
        setMessage(data.mensaje);
        const emergencyId = data.emergencia.id;
        await uploadImages(emergencyId);
      } else {
        // El servidor respondió con un estado distinto de 200
        // Aquí puedes manejar el error de acuerdo a tus necesidades
      }
    } catch (error) {
      console.error('Ha ocurrido un error inesperado:', error);
      // Aquí puedes manejar el error de acuerdo a tus necesidades
    }
  };

  const uploadImages = async (emergencyId: number) => {
    try {
      const formData = new FormData();
      selectedImages.forEach((imageUri, index) => {
        formData.append('photos', {
          uri: imageUri,
          name: `photo_${index}`,
          type: 'image/jpeg',
        });
      });

      const response = await fetch(`http://10.0.2.2:8000/api/emergency_images_upload/${emergencyId}/`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (response.status === 200) {
        // Las imágenes se han subido exitosamente
      } else {
        // El servidor respondió con un estado distinto de 200
        // Aquí puedes manejar el error de acuerdo a tus necesidades
      }
    } catch (error) {
      console.error('Ha ocurrido un error al subir las imágenes:', error);
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

  const handleImageSelection = () => {
    // Lógica para seleccionar imágenes aquí
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

      <TouchableOpacity style={styles.button} onPress={handleImageSelection}>
        <Text style={styles.buttonText}>Agregar Imágenes</Text>
      </TouchableOpacity>

      <View style={styles.imageContainer}>
        {selectedImages.map((imageUri, index) => (
          <Image key={index} source={{ uri: imageUri }} style={styles.image} />
        ))}
      </View>

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
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginHorizontal: 5,
    marginVertical: 5,
  },
});

export default Inform;
