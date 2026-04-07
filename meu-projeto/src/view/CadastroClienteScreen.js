import React, { useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import ClienteController from "../controller/ClienteController";

export default function CadastroClienteScreen() {
  const [nomeCliente, setNomeCliente] = useState("");
  const [telefone, setTelefone] = useState("");
  const controller = new ClienteController();

  const handleSalvar = async () => {
    if (nomeCliente === "" || telefone === "") {
      Alert.alert("Atenção", "Preencha o cliente e o telefone!");
      return;
    }
    try {
      await controller.adicionarCliente(nomeCliente, telefone);
      Alert.alert("Sucesso!", `${nomeCliente} foi salvo no sistema!`);
      setNomeCliente("");
      setTelefone("");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar o cliente!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Novo Cliente</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nomeCliente}
        onChangeText={setNomeCliente}
      />
      <TextInput
        style={styles.input}
        placeholder="Telefone Whatsapp"
        keyboardType="number-pad"
        value={telefone}
        onChangeText={setTelefone}
      />
      <TouchableOpacity style={styles.botao} onPress={handleSalvar}>
        <Text style={styles.textoBotao}>Salvar Cliente</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f9",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  botao: {
    width: "100%",
    height: 50,
    backgroundColor: "#ff6600",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  textoBotao: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
