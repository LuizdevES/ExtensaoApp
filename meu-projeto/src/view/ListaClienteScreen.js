import React, { useState, useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
} from "react-native";
import ClienteController from "../controller/ClienteController";

export default function ClienteScreen() {
  const [cliente, setCliente] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [clienteEditando, setClienteEditando] = useState(null);
  const [nomeEditado, setNomeEditado] = useState("");
  const [telefoneEditado, setTelefoneEditado] = useState("");

  const controller = new ClienteController();
  const isFocused = useIsFocused();

  const carregar = async () => {
    setIsLoading(true);
    const lista = await controller.listarCliente();
    setCliente(lista);
    setIsLoading(false);
  };

  useEffect(() => {
    carregar();
  }, [isFocused]);

  const handleExcluir = (_id) => {
    Alert.alert("Atenção", "Tem certeza que deseja apagar este cliente?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sim, apagar",
        onPress: async () => {
          await controller.excluirCliente(_id);
          await carregar();
        },
      },
    ]);
  };

  const handleAlterar = (cliente) => {
    setClienteEditando(cliente);
    setNomeEditado(cliente.nomeCliente || "");
    setTelefoneEditado(cliente.telefone ? cliente.telefone.toString() : "");
    setIsModalVisible(true);
  };

  const salvarAlteracao = async () => {
    if (!nomeEditado || !telefoneEditado) {
      Alert.alert("Atenção", "Preencha o nome e o telefone!");
      return;
    }

    try {
      const clienteAtualizado = {
        idCliente: clienteEditando.idCliente,
        nomeCliente: nomeEditado,
        telefone: telefoneEditado,
      };

      await controller.alterarCliente(clienteAtualizado);
      setIsModalVisible(false);
      setClienteEditando(null);
      await carregar();
      Alert.alert("Sucesso", "Cliente atualizado com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Falha ao atualizar cliente.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lista de Clientes</Text>

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#4CAF50"
          style={styles.isLoading}
        />
      ) : (
        <FlatList
          data={cliente}
          keyExtractor={(item) => item.idCliente.toString()}
          style={{ width: "100%", marginTop: 10 }}
          renderItem={({ item }) => (
            <View style={styles.itemLista}>
              <View style={styles.infoContainer}>
                <Text style={styles.itemNome}>
                  {item.nomeCliente ? item.nomeCliente : "Sem nome"}
                </Text>
                <Text style={styles.itemPreco}>
                  {item.telefone ? item.telefone.toString() : "99999-9999"}
                </Text>
              </View>

              <View style={styles.botoesContainer}>
                <TouchableOpacity
                  onPress={() => handleAlterar(item)}
                  style={styles.botaoEditar}
                >
                  <Text style={styles.textoBotaoAcao}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleExcluir(item.idCliente)}
                  style={styles.botaoExcluir}
                >
                  <Text style={styles.textoBotaoAcao}>X</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>Editar Cliente</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Nome do Cliente"
              value={nomeEditado}
              onChangeText={setNomeEditado}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Telefone"
              keyboardType="number-pad"
              value={telefoneEditado}
              onChangeText={setTelefoneEditado}
            />

            <View style={styles.modalBotoes}>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                style={[styles.botaoModal, styles.botaoCancelar]}
              >
                <Text style={styles.textoBotaoAcao}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={salvarAlteracao}
                style={[styles.botaoModal, styles.botaoSalvar]}
              >
                <Text style={styles.textoBotaoAcao}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f9",
    alignItems: "center",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  isLoading: {
    marginTop: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 10,
  },
  itemLista: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
    width: "100%",
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
  },
  itemNome: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  itemPreco: {
    fontSize: 16,
    color: "#ff6600",
    fontWeight: "bold",
  },
  botoesContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  botaoEditar: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 5,
    marginRight: 10,
  },
  botaoExcluir: {
    backgroundColor: "red",
    padding: 8,
    borderRadius: 5,
  },
  textoBotaoAcao: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    elevation: 5,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  modalBotoes: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  botaoModal: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  botaoCancelar: {
    backgroundColor: "#aaa",
  },
  botaoSalvar: {
    backgroundColor: "#4CAF50",
  },
});
