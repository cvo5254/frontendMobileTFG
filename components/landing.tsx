import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import ModalComponent from './modal';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import type { ParamListBase } from '@react-navigation/native';
import { useSubscriptionContext } from '../SubscriptionContext';
import Footer from './footer';

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
        setEmergencies(data);
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
  
  
  const renderChannelItem = ({ item }: { item: Channel }) => {
    const hasEmergencies = selectedChannelId === item.id && emergencies.length > 0;

    return (
      <TouchableOpacity onPress={() => handleChannelPress(item.id)}>
        <View style={styles.channelItem}>
          <Text>ID: {item.id}</Text>
          <Text>Nombre: {item.nombre}</Text>
          <TouchableOpacity style={styles.unsubscribeButton} onPress={() => {setSelectedChannelId(item.id);
    setIsModalOpen(true);
    setErrorMessage('Seguro que desea desuscrbirse del canal?')}}>
            <Text style={styles.unsubscribeButtonText}>Desuscribirse</Text>
          </TouchableOpacity>
        </View>
        {hasEmergencies && (
          <View>
            {emergencies.map(emergency => (
              <View key={emergency.id} style={styles.emergencyItem}>
                <Text style={styles.emergencyTitle}>{emergency.title}</Text>
                <Text style={styles.emergencyDescription}>{emergency.description}</Text>
                <View style={styles.separator} />
              </View>
            ))}
          </View>
        )}
      </TouchableOpacity>
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
          <Text style={styles.headerText}>ID</Text>
          <Text style={styles.headerText}>Nombre</Text>
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
      <Footer navigation={navigation} />
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 50,
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
  channelItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#8b0000',
  },
  emergencyItem: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row', 
    alignItems: 'center', 
  },
  emergencyTitle: {
    flex: 1, 
    fontSize: 16,
    fontWeight: 'bold',
  },
  emergencyDescription: {
    flex: 1, 
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
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  unsubscribeButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },  
});

export default Landing;