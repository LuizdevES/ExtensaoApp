import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import ProdutoController from "../controller/ProdutoController";

export default function CadastroProdutoScreen() {
  const [nomeProduto, setNomeProduto] = useState("");
  const [precoProduto, setPrecoProduto] = useState("");
  const controller = new ProdutoController();

  const handlePrecoChange = (texto) => {
    let valor = texto.replace(/\D/g, "");
    if (valor === "") {
      setPrecoProduto("");
      return;
    }
    let num = (parseFloat(valor) / 100).toFixed(2);
    setPrecoProduto(`R$ ${num}`);
  };

  const handleSalvar = async () => {
    if (nomeProduto === "" || precoProduto === "") {
      Alert.alert("Atenção", "Preencha o produto e o preço!");
      return;
    }
    try {
      const precoLimpo = precoProduto.replace("R$ ", "");
      await controller.adicionarProduto(nomeProduto, precoLimpo);
      Alert.alert("Sucesso!", `${nomeProduto} foi salvo no sistema!`);
      setNomeProduto("");
      setPrecoProduto("");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar o produto.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Novo Produto</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome (Ex: Bolo)"
        value={nomeProduto}
        onChangeText={setNomeProduto}
      />
      <TextInput
        style={styles.input}
        placeholder="Preço (Ex: R$ 5.50)"
        keyboardType="numeric"
        value={precoProduto}
        onChangeText={handlePrecoChange}
      />
      <TouchableOpacity style={styles.botao} onPress={handleSalvar}>
        <Text style={styles.textoBotao}>Salvar Produto</Text>
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
