import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  message: string;
}

const ModalComponent: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  return (
    <Modal transparent visible={isOpen} animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Atención</Text>
          <Text style={styles.modalText}>{message}</Text>
          <TouchableOpacity onPress={handleConfirm} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Aceptar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>&times;</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    padding: 40,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#8b0000",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    textAlign: "center",
  },
  modalTitle: {
    marginTop: 0,
    marginBottom: 30,
    color: "#8b0000",
    fontSize: 20,
  },
  modalText: {
    marginBottom: 20,
    color: "#8b0000",
    fontSize: 16,
  },
  modalButton: {
    width: "100%",
    padding: 10,
    backgroundColor: "#8b0000",
    borderRadius: 5,
    marginTop: 10,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  closeButtonText: {
    fontSize: 24,
    color: "#8b0000",
  },
});

export default ModalComponent;
