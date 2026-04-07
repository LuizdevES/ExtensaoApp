import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Gestão da Loja</Text>

      <Text style={styles.subtitulo}>Módulo de Pedidos</Text>
      <TouchableOpacity
        style={styles.botaoCliente}
        onPress={() => navigation.navigate("AdicionarPedido")}
      >
        <Text style={styles.textoBotao}>+ Adicionar Pedido</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.botaoCliente}
        onPress={() => navigation.navigate("ListaPedido")}
      >
        <Text style={styles.textoBotao}>Lista de Pedidos</Text>
      </TouchableOpacity>

      <Text style={styles.subtitulo}>Módulo de Produtos</Text>
      <TouchableOpacity
        style={styles.botaoProduto}
        onPress={() => navigation.navigate("CadastroProduto")}
      >
        <Text style={styles.textoBotao}>+ Cadastrar Produto</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.botaoProduto}
        onPress={() => navigation.navigate("Cardapio")}
      >
        <Text style={styles.textoBotao}>📖 Ver Cardápio</Text>
      </TouchableOpacity>

      <Text style={styles.subtitulo}>Módulo de Clientes</Text>
      <TouchableOpacity
        style={styles.botaoCliente}
        onPress={() => navigation.navigate("CadastroCliente")}
      >
        <Text style={styles.textoBotao}>+ Cadastrar Cliente</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.botaoCliente}
        onPress={() => navigation.navigate("ListaCliente")}
      >
        <Text style={styles.textoBotao}>Lista de Clientes</Text>
      </TouchableOpacity>

      <Text style={styles.subtitulo}>Informações</Text>
      <TouchableOpacity
        style={styles.botaoCliente}
        onPress={() => navigation.navigate("About")}
      >
        <Text style={styles.textoBotao}>Info Pedidos</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f9",
    alignItems: "center",
    padding: 20,
    paddingTop: 40,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    alignSelf: "flex-start",
    marginBottom: 10,
    marginTop: 20,
  },
  botaoProduto: {
    width: "100%",
    height: 50,
    backgroundColor: "#ff6600",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  botaoCliente: {
    width: "100%",
    height: 50,
    backgroundColor: "#0055ff",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  textoBotao: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
