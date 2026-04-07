import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import PedidoController from "../controller/PedidoController";

export default function AboutScreen({ navigation }) {
  const [pedidosMes, setPedidosMes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Métricas do Mês
  const [qtdPedidos, setQtdPedidos] = useState(0);
  const [arrecadado, setArrecadado] = useState(0);
  const [pendente, setPendente] = useState(0);

  const pedidoController = new PedidoController();

  // useFocusEffect para recarregar quando a tela for focada
  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [])
  );

  const carregarDados = async () => {
    setLoading(true);
    try {
      const todosPedidos = await pedidoController.listarPedido();

      // Filtrar apenas pedidos do mês corrente
      const agora = new Date();
      const mesAtual = agora.getMonth();
      const anoAtual = agora.getFullYear();

      let pedidosDoMes = todosPedidos.filter((p) => {
        if (!p.dataPedido) return false;
        const d = new Date(p.dataPedido);
        return d.getMonth() === mesAtual && d.getFullYear() === anoAtual;
      });

      // Calcular métricas
      let qtd = pedidosDoMes.length;
      let arrec = 0;
      let pend = 0;

      // Classificar atrasados virtualmente baseado na data 
      // e contar as métricas
      pedidosDoMes = pedidosDoMes.map(p => {
        const d = new Date(p.dataPedido);
        let statusVirtual = p.statusPagamento || "aguardando";
        
        // Regra de negócio simples para tornar atrasado 
        // caso o pedido tem mais de 5 dias e não está pago
        const diffEmDias = (agora - d) / (1000 * 60 * 60 * 24);
        if (statusVirtual !== "pago" && diffEmDias > 5) {
          statusVirtual = "atrasado";
        }

        if (statusVirtual === "pago") {
          arrec += Number(p.valorTotal);
        } else {
          pend += Number(p.valorTotal);
        }

        return { ...p, statusVirtual };
      });

      setQtdPedidos(qtd);
      setArrecadado(arrec);
      setPendente(pend);
      
      // Ordenar: Aguardando/Atrasados primeiro e depois os pagos
      pedidosDoMes.sort((a, b) => {
        if (a.statusVirtual === "pago" && b.statusVirtual !== "pago") return 1;
        if (a.statusVirtual !== "pago" && b.statusVirtual === "pago") return -1;
        return 0;
      });

      setPedidosMes(pedidosDoMes);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha ao carregar dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const confirmarPagamento = (pedido) => {
    if (pedido.statusVirtual === "pago") {
      Alert.alert("Já Pago", "Este pedido já consta como pago na fatura!");
      return;
    }

    Alert.alert(
      "Confirmar Pagamento",
      `Deseja marcar o pedido de ${pedido.nomeCliente} como pago?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sim", 
          onPress: async () => {
             const atualizado = { ...pedido, statusPagamento: "pago" };
             const sucesso = await pedidoController.alterarPedido(atualizado);
             if (sucesso) {
               Alert.alert("Sucesso", "Pedido marcado como pago!");
               carregarDados(); // atualiza metadados e tela
             } else {
               Alert.alert("Erro", "Não foi possível confirmar o pagamento no servidor.");
             }
          } 
        }
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pago": return "#27ae60"; // verde
      case "atrasado": return "#e74c3c"; // vermelho
      default: return "#f39c12"; // laranja (aguardando)
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pago": return "PAGO";
      case "atrasado": return "ATRASADO";
      default: return "AGUARDANDO";
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.cardItem} 
      onPress={() => confirmarPagamento(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.textoCliente}>{item.nomeCliente}</Text>
        <Text style={styles.textoValor}>R$ {Number(item.valorTotal).toFixed(2)}</Text>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.textoData}>{new Date(item.dataPedido).toLocaleDateString("pt-BR")}</Text>
        <View style={[styles.badgePagamento, { backgroundColor: getStatusColor(item.statusVirtual) }]}>
          <Text style={styles.textoBadge}>{getStatusLabel(item.statusVirtual)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Dashboard do Mês</Text>

      {/* Cartões de KPI */}
      <View style={styles.kpiContainer}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Pedidos Mensal</Text>
          <Text style={styles.kpiValue}>{qtdPedidos}</Text>
        </View>
        <View style={[styles.kpiCard, styles.kpiSucesso]}>
          <Text style={[styles.kpiLabel, { color: "#fff" }]}>Arrecadado</Text>
          <Text style={[styles.kpiValue, { color: "#fff" }]}>R$ {arrecadado.toFixed(2)}</Text>
        </View>
        <View style={[styles.kpiCard, styles.kpiAlerta]}>
          <Text style={[styles.kpiLabel, { color: "#fff" }]}>Pendente</Text>
          <Text style={[styles.kpiValue, { color: "#fff" }]}>R$ {pendente.toFixed(2)}</Text>
        </View>
      </View>

      <Text style={styles.subtitulo}>Tabela de Faturas (Mês Atual)</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#ff6600" style={{ marginTop: 30 }} />
      ) : (
        <View style={{ flex: 1, width: "100%" }}>
          <FlatList
            data={pedidosMes}
            keyExtractor={(item, index) => item.idPedido ? item.idPedido.toString() : index.toString()}
            renderItem={renderItem}
            ListEmptyComponent={
               <Text style={styles.listaVazia}>Nenhuma fatura encontrada neste mês.</Text>
            }
          />
        </View>
      )}

      {/* Botão Voltar Original Preservado */}
      <TouchableOpacity
        style={styles.botaoAbout}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.textoBotao}>Voltar para o Início</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f9",
    alignItems: "center",
    padding: 15,
  },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
    marginBottom: 20,
  },
  kpiContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 5,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2, // Sombra p/ Android
    shadowOpacity: 0.1, // Sombra p/ iOS
    borderWidth: 1,
    borderColor: "#eee"
  },
  kpiSucesso: { backgroundColor: "#27ae60", borderColor: "#27ae60" },
  kpiAlerta: { backgroundColor: "#e67e22", borderColor: "#e67e22" },
  kpiLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
    textAlign: "center"
  },
  kpiValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 5,
  },
  subtitulo: {
    fontSize: 18,
    alignSelf: "flex-start",
    fontWeight: "bold",
    color: "#555",
    marginBottom: 10,
  },
  listaVazia: {
    textAlign: "center",
    marginTop: 20,
    color: "#888"
  },
  cardItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#3498db",
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  textoCliente: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333"
  },
  textoValor: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#27ae60"
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10
  },
  textoData: {
    fontSize: 13,
    color: "#888"
  },
  badgePagamento: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  textoBadge: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
  botaoAbout: {
    width: "100%",
    height: 50,
    backgroundColor: "#ff6600",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    marginBottom: 10,
  },
  textoBotao: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
