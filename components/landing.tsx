import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import ModalComponent from './modal';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button } from 'react-native';
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
  const { user } = useContext(UserContext);
  const { updateSubscriptions } = useSubscriptionContext();
  const userId = user ? user.id : null;

  useEffect(() => {
    fetchChannels();
  }, [updateSubscriptions]);

  const fetchChannels = () => {
    fetch(`http://10.0.2.2:8000/api/${userId}/subscriptions/`)
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

  const renderChannelItem = ({ item }: { item: Channel }) => {
    const hasEmergencies = selectedChannelId === item.id && emergencies.length > 0;

    return (
      <TouchableOpacity onPress={() => handleChannelPress(item.id)}>
        <View style={styles.channelItem}>
          <Text>ID: {item.id}</Text>
          <Text>Nombre: {item.nombre}</Text>
        </View>
        {hasEmergencies && (
          <View>
            {emergencies.map(emergency => (
              <View key={emergency.id} style={styles.emergencyItem}>
                <Text style={styles.emergencyTitle}>{emergency.title}</Text>
                <Text style={styles.emergencyDescription}>{emergency.description}</Text>
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
      <Text style={styles.title}>Tus canales suscritos:</Text>
      <TouchableOpacity style={styles.subscribeButton} onPress={() => navigation.navigate('Suscribe to channel')}>
        <Text style={styles.subscribeButtonText}>Suscribirse a un nuevo canal</Text>
      </TouchableOpacity>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerText}>ID</Text>
          <Text style={styles.headerText}>Nombre</Text>
        </View>
        <FlatList
          data={channels}
          renderItem={renderChannelItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
      <Footer navigation={navigation} />
      {errorMessage !== '' && (
        <ModalComponent isOpen={true} onClose={() => setErrorMessage('')} message={errorMessage} />
      )}
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#8b0000',
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
  subscribeButton: {
    marginTop: 20,
    backgroundColor: '#8b0000',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  subscribeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emergencyItem: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emergencyDescription: {
    fontSize: 14,
  },
});

export default Landing;
