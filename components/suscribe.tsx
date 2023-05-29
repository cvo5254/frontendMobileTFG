import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import ModalComponent from './modal';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import type { ParamListBase } from '@react-navigation/native';
import { useSubscriptionContext } from '../SubscriptionContext';
import Footer from './footer';

interface SubscribeProps {
  navigation: NavigationProp<ParamListBase>;
}

interface Channel {
  id: number;
  nombre: string;
  subscribers: string[];
}

const Subscribe: React.FC<SubscribeProps> = ({ navigation }) => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const { user } = useContext(UserContext);
  const { updateSubscriptions } = useSubscriptionContext();
  const userId = user ? user.id : null;

  useEffect(() => {
    fetch(`http://10.0.2.2:8000/api/${userId}/notSuscribedChannels/`)
      .then(response => response.json())
      .then(data => {
        setChannels(data);
        console.log(data);
      })
      .catch(error => console.log(error));
  }, []);

  const handleChannelPress = (channel: Channel) => {
    setSelectedChannel(channel);
  };

  const handleModalConfirm = () => {
    if (selectedChannel) {
      subscribeToChannel(selectedChannel);
      setSelectedChannel(null);
    }
  };

  const subscribeToChannel = (channel: Channel) => {
    fetch(`http://10.0.2.2:8000/api/suscribirse/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channel_id: channel.id,
        user_id: userId
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Suscripción exitosa:', data);
        updateSubscriptions();
        navigation.goBack()
      })
      .catch(error => console.log(error));
  };

  const closeModal = () => {
    setSelectedChannel(null);
  };

  const renderChannelItem = ({ item }: { item: Channel }) => (
    <TouchableOpacity onPress={() => handleChannelPress(item)}>
      <View style={styles.channelItem}>
        <Text>ID: {item.id}</Text>
        <Text>Nombre: {item.nombre}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Canales disponibles:</Text>
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
      {selectedChannel && (
        <ModalComponent
          isOpen={true}
          onClose={closeModal}
          message={`¿Seguro que desea suscribirse al canal "${selectedChannel.nombre}"?`}
          onConfirm={handleModalConfirm}
        />
      )}
      {errorMessage !== '' && (
        <ModalComponent isOpen={true} onClose={() => setErrorMessage('')} message={errorMessage} />
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#8b0000',
    marginTop: 20,
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
});

export default Subscribe;
