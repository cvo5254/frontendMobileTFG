import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

interface Channel {
  id: number;
  name: string;
  // Otros campos de canal que puedas tener
}

const Landing = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [expandedChannel, setExpandedChannel] = useState<Channel | null>(null);

  useEffect(() => {
    // Realiza la solicitud fetch para obtener la lista de canales suscritos
    // y luego actualiza el estado "channels" con los datos recibidos.

    // Ejemplo de solicitud fetch (requiere una URL válida):
    fetch('https://api.example.com/subscribed-channels')
      .then(response => response.json())
      .then(data => setChannels(data))
      .catch(error => console.log(error));
  }, []);

  const handleChannelPress = (channel: Channel) => {
    if (expandedChannel === channel) {
      setExpandedChannel(null); // Si ya está expandido, cierra el canal al hacer clic nuevamente
    } else {
      setExpandedChannel(channel);
      // Aquí puedes realizar la solicitud fetch para obtener los elementos del canal seleccionado
      // y manejar los datos de manera similar a como se hizo con la lista de canales.
    }
  };

  const renderChannelItem = ({ item, index }: { item: Channel; index: number }) => {
    const isExpanded = item === expandedChannel;

    return (
      <TouchableOpacity onPress={() => handleChannelPress(item)}>
        <View>
          <Text>{item.name}</Text>
          {isExpanded && (
            <View>
              {/* Renderizar los elementos del canal aquí */}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <Text>Tus canales suscritos:</Text>
      <FlatList
        data={channels}
        renderItem={renderChannelItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default Landing;
