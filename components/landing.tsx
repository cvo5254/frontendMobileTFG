import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import ModalComponent from './modal';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import type { ParamListBase } from '@react-navigation/native';
import { useSubscriptionContext } from '../SubscriptionContext';
import { ScrollView } from 'react-native-gesture-handler';

interface LandingProps {
  navigation: NavigationProp<ParamListBase>;
}

interface Channel {
  id: number;
  nombre: string;
  subscribers: string[];  
}

interface Emergency {
  id: number;
  title: string;
  description: string;
  images: string;
}

const Landing: React.FC<LandingProps> = ({ navigation }) => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [selectedChannelId, setSelectedChannelId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useContext(UserContext);
  const { updateSubscriptions } = useSubscriptionContext();
  const user_id = user ? user.id : null;

  useEffect(() => {
    fetchChannels();
  }, [updateSubscriptions]);

  const fetchChannels = () => {
    fetch(`http://10.0.2.2:8000/api/${user_id}/subscriptions/`)
      .then(response => response.json())
      .then(data => {
        setChannels(data);
        console.log(data);
      })
      .catch(error => console.log(error));
  };

  const fetchEmergencies = (channelId: number) => {
    fetch(`http://10.0.2.2:8000/api/${channelId}/emergencies`)
      .then(response => response.json())
      .then(data => {
        const emergenciesWithImages = data.map((emergency: Emergency) => ({
          ...emergency,
          images: `http://10.0.2.2:8000${emergency.images}`, 
        }));
        setEmergencies(emergenciesWithImages);
      })
      .catch(error => console.log(error));
  };

  const handleUnsubscribe = async (channel_id: number) => {
    setSelectedChannelId(channel_id);
    setIsModalOpen(true);
    try {
      const response = await fetch("http://10.0.2.2:8000/api/unsuscribe/", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ channel_id, user_id}),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Ha ocurrido un error inesperado:', error);
      setErrorMessage('Ha ocurrido un error durante la desuscripción.');
    }
  };
  
  const fetchUnsuscribe = async (channel_id: number) => {
    try {
      const response = await fetch("http://10.0.2.2:8000/api/unsuscribe/", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ channel_id, user_id}),
      });
      const data = await response.json();
      fetchChannels();
      console.log(data);
    } catch (error) {
      console.error('Ha ocurrido un error inesperado:', error);
      setErrorMessage('Ha ocurrido un error durante la desuscripción.');
    }
  } 

  const handleModalConfirm = () => {
    if (selectedChannelId !== null) {
      fetchUnsuscribe(selectedChannelId)
      
    }
    setIsModalOpen(false);
  };
  
  
  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const handleClick = () => {
    navigation.navigate('Inform');
    console.log('Botón del footer clickeado');
  };
  
  const renderChannelItem = ({ item }: { item: Channel }) => {
    const hasEmergencies = selectedChannelId === item.id && emergencies.length > 0;

    return (
      <View style={styles.channelContainer}>
        <TouchableOpacity onPress={() => handleChannelPress(item.id)}>
          <View style={styles.channelItem}>
          <Text style={styles.channelText}>ID: {item.id}</Text>
          <Text style={styles.channelText}>Nombre: {item.nombre}</Text>
            <TouchableOpacity
              style={styles.unsubscribeButton}
              onPress={() => {
                setSelectedChannelId(item.id);
                setIsModalOpen(true);
                setErrorMessage('Seguro que desea desuscribirse del canal?');
              }}
            >
              <Text style={styles.unsubscribeButtonText}>-</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
        <View style={styles.channelSeparator} />
        {hasEmergencies && (
          <View>
            {emergencies.map(emergency => (
              <View key={emergency.id} style={styles.emergencyItem}>
                <Text style={styles.emergencyTitle}>{emergency.title}</Text>
                <Text style={styles.emergencyDescription}>{emergency.description}</Text>
                {emergency.images && <Image source={{ uri: emergency.images }} style={styles.emergencyImage} />}
                <View style={styles.separator} />
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };


  const handleChannelPress = (channelId: number) => {
    setSelectedChannelId(channelId);
    fetchEmergencies(channelId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tus canales suscritos:</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Suscribe to channel')}>
          <Text style={styles.addButtonIcon}>+</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerText}></Text>
          <Text style={styles.headerText}></Text>
        </View>
        <FlatList
          data={channels}
          renderItem={renderChannelItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.flatListContent}
        />
      </View>
      {errorMessage !== '' && (
        <ModalComponent isOpen={isModalOpen} onClose={handleModalClose} onConfirm={handleModalConfirm} message={errorMessage} />
      )}
     <TouchableOpacity style={[styles.footerButton]} onPress={handleClick}>
        <Text style={styles.buttonText}>Inform</Text>
    </TouchableOpacity>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5', 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#8b0000',
    borderRadius: 20,
    padding: 5,
  },
  addButtonIcon: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  table: {
    flex: 1,
    width: '100%',
    borderWidth: 1,
    borderColor: '#8b0000',
  },
  flatListContent: {
    flexGrow: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    backgroundColor: '#8b0000',
    paddingVertical: 5,
  },
  headerText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  channelContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#8b0000',
    marginBottom: 10,
    paddingBottom: 10,
  },
  channelItem: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  channelText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emergencyItem: {
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#8b0000',
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  emergencyDescription: {
    fontSize: 14,
  },
  separator: {
    height: 1,
    backgroundColor: '#8b0000',
    marginTop: 10,
    marginBottom: 5,
  },
  unsubscribeButton: {
    backgroundColor: '#8b0000',
    borderRadius: 10, 
    paddingVertical: 3, 
    paddingHorizontal: 6, 
  },
  unsubscribeButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emergencyImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  footerButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#8b0000',
    paddingVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  channelSeparator: {
    height: 1,
    backgroundColor: '#dcdcdc', 
    marginVertical: 10,
  },
});


export default Landing;