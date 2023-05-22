import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import ModalComponent from './modal';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const Landing = () => {
  interface Channel {
    id: number;
    nombre: string;
    subscribers: string[];
  }

  const [channels, setChannels] = useState<Channel[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const { user } = useContext(UserContext);
  const userId = user ? user.id : null;

  useEffect(() => {
    fetch(`http://10.0.2.2:8000/api/${userId}/subscriptions/`)
      .then(response => response.json())
      .then(data => {
        setChannels(data);
        console.log(data);
      })
      .catch(error => console.log(error));
  }, []);

  const renderChannelItem = ({ item }: { item: Channel }) => (
    <TouchableOpacity>
      <View style={styles.channelItem}>
        <Text>ID: {item.id}</Text>
        <Text>Nombre: {item.nombre}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tus canales suscritos:</Text>
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
});

export default Landing;
