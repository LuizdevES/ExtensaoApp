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
import ProdutoController from "../controller/ProdutoController";

export default function CardapioScreen() {
  const [produtos, setProdutos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [nomeEditado, setNomeEditado] = useState("");
  const [precoEditado, setPrecoEditado] = useState("");

  const controller = new ProdutoController();
  const isFocused = useIsFocused();

  const carregar = async () => {
    setIsLoading(true);
    const lista = await controller.listarProduto();
    setProdutos(lista);
    setIsLoading(false);
  };

  useEffect(() => {
    carregar();
  }, [isFocused]);

  const handleExcluir = (idProduto) => {
    Alert.alert("Atenção", "Tem certeza que deseja apagar este produto?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sim, apagar",
        onPress: async () => {
          await controller.excluirProduto(idProduto);
          await carregar();
        },
      },
    ]);
  };

  const handleAlterar = (produto) => {
    setProdutoEditando(produto);
    setNomeEditado(produto.nomeProduto);
    setPrecoEditado(produto.precoProduto.toString());
    setIsModalVisible(true);
  };

  const SalvarAlteracoes = async () => {
    if (!nomeEditado || !precoEditado) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    try {
      const produtoAtualizado = {
        idProduto: produtoEditando.idProduto,
        nomeProduto: nomeEditado,
        precoProduto: parseFloat(precoEditado),
      };

      await controller.alterarProduto(produtoAtualizado);
      setIsModalVisible(false);
      setProdutoEditando(null);
      await carregar();
      Alert.alert("Sucesso", "Produto alterado com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível alterar o produto");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Cardápio</Text>

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#4CAF50"
          style={styles.isLoading}
        />
      ) : (
        <FlatList
          data={produtos}
          keyExtractor={(item) => item.idProduto.toString()}
          style={{ width: "100%", marginTop: 10 }}
          renderItem={({ item }) => (
            <View style={styles.itemLista}>
              <View style={styles.infoContainer}>
                <Text style={styles.itemNome}>
                  {item.nomeProduto ? item.nomeProduto : "Sem nome"}
                </Text>
                <Text style={styles.itemPreco}>
                  R$ {item.precoProduto ? item.precoProduto.toFixed(2) : "0.00"}
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
                  onPress={() => handleExcluir(item.idProduto)}
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
            <Text style={styles.modalTitulo}>Editar Produto</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Produto"
              value={nomeEditado}
              onChangeText={setNomeEditado}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Preço"
              keyboardType="number-pad"
              value={precoEditado}
              onChangeText={setPrecoEditado}
            />

            <View style={styles.modalBotoes}>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                style={[styles.botaoModal, styles.botaoCancelar]}
              >
                <Text style={styles.textoBotaoAcao}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={SalvarAlteracoes}
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
  isLoading: {
    color: "#f43",
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
