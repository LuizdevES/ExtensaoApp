import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Alert
} from "react-native";
import PedidoController from "../controller/PedidoController";

export default function ListaPedidoScreen() {
  const pedidoController = new PedidoController();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarPedidos();
  }, []);

  const carregarPedidos = async () => {
    try {
      setLoading(true);
      const dados = await pedidoController.listarPedido();
      setPedidos(dados);
    } catch (error) {
      Alert.alert("Erro", "Erro ao carregar a lista de pedidos.");
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    const dataFormatada = item.dataPedido ? new Date(item.dataPedido).toLocaleString('pt-BR') : 'Data Indisponível';

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.clienteNome}>{item.nomeCliente}</Text>
          <Text style={styles.dataTexto}>{dataFormatada}</Text>
        </View>

        <View style={styles.itensArea}>
          {item.itens && item.itens.map((p, idx) => (
            <Text key={idx} style={styles.itemTexto}>• {p.quantidade}x {p.nome} (R$ {p.subtotal.toFixed(2)})</Text>
          ))}
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.qtdTexto}>{item.quantidade} Itens</Text>
          <Text style={styles.valorTotal}>Total: R$ {item.valorTotal.toFixed(2)}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Pedidos Salvos</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0055ff" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={pedidos}
          keyExtractor={(item, index) => item.idPedido ? item.idPedido.toString() : index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.lista}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Não há pedidos cadastrados.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f9",
    padding: 15,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  lista: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 5,
  },
  clienteNome: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0055ff",
  },
  dataTexto: {
    fontSize: 12,
    color: "#888",
  },
  itensArea: {
    marginBottom: 10,
  },
  itemTexto: {
    fontSize: 14,
    color: "#444",
    marginBottom: 2,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
  qtdTexto: {
    fontSize: 14,
    color: "#666",
  },
  valorTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff6600",
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    marginTop: 30,
  }
});
