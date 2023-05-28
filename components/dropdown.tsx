import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

interface Option {
    value: string;
    label: string;
  }

const Dropdown: React.FC<{ options: Option[], onSelect: (option: Option) => void }> = ({ options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);


  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option: Option) => {
    setSelectedOption(option);
    setIsOpen(false);
    onSelect(option);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.dropdownButton} onPress={toggleDropdown}>
        <Text>{selectedOption ? selectedOption.label : 'Select Option'}</Text>
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.dropdownList}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={styles.dropdownItem}
              onPress={() => handleOptionSelect(option)}
            >
              <Text>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      position: 'relative',
      zIndex: 999,
    },
    dropdownButton: {
      borderWidth: 1,
      borderColor: 'gray',
      padding: 10,
      zIndex: 1,
      backgroundColor: 'white', 
    },
    dropdownList: {
      position: 'absolute',
      top: '100%',
      borderWidth: 1,
      borderColor: 'gray',
      backgroundColor: 'white',
      width: '100%',
      zIndex: 1,
      marginTop: 5, 
    },
    dropdownItem: {
      padding: 10,
      backgroundColor: 'white', 
    },
  });
  

export default Dropdown;
