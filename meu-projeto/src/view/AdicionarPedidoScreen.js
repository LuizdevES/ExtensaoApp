import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import ProdutoController from "../controller/ProdutoController";
import ClienteController from "../controller/ClienteController";
import PedidoController from "../controller/PedidoController";

export default function AdicionarPedidoScreen({ navigation }) {
  const produtoController = new ProdutoController();
  const clienteController = new ClienteController();
  const pedidoController = new PedidoController();

  const [clientesDb, setClientesDb] = useState([]);
  const [produtosDb, setProdutosDb] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalClienteVisible, setModalClienteVisible] = useState(false);
  const [modalProdutoVisible, setModalProdutoVisible] = useState(false);

  // 1. Estados do Cabeçalho do Pedido
  const [clienteSelecionado, setClienteSelecionado] = useState(null);

  // 2. Estados do Produto Sendo Adicionado
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [precoInput, setPrecoInput] = useState("");
  const [quantidade, setQuantidade] = useState(1);

  const [carrinho, setCarrinho] = useState([]);

  useEffect(() => {
    carregarDadosBase();
  }, []);

  const carregarDadosBase = async () => {
    setLoading(true);
    try {
      const p = await produtoController.listarProduto();
      const c = await clienteController.listarCliente();
      setProdutosDb(p);
      setClientesDb(c);
    } catch (error) {
      Alert.alert("Erro", "Erro ao carregar dados do banco.");
    } finally {
      setLoading(false);
    }
  };

  const alterarQuantidade = (valor) => {
    if (quantidade + valor > 0) {
      setQuantidade(quantidade + valor);
    }
  };

  const adicionarAoCarrinho = () => {
    if (!produtoSelecionado || precoInput === "") {
      Alert.alert("Atenção", "Selecione o produto e informe o preço!");
      return;
    }

    const preco = parseFloat(precoInput.toString().replace(",", "."));
    const subtotal = preco * quantidade;

    const novoItem = {
      id: Date.now().toString(),
      idProdutoRef: produtoSelecionado.idProduto,
      nome: produtoSelecionado.nomeProduto,
      quantidade: quantidade,
      preco: preco,
      subtotal: subtotal,
    };

    setCarrinho([...carrinho, novoItem]);

    setProdutoSelecionado(null);
    setPrecoInput("");
    setQuantidade(1);
  };

  const calcularTotal = () => {
    return carrinho.reduce((total, item) => total + item.subtotal, 0);
  };

  const renderItem = ({ item }) => (
    <View style={styles.linhaTabela}>
      <Text style={styles.celulaProduto}>{item.nome}</Text>
      <Text style={styles.celulaQtd}>{item.quantidade}x</Text>
      <Text style={styles.celulaValor}>R$ {item.subtotal.toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Novo Pedido</Text>

      {/* DADOS DO CLIENTE */}
      <TouchableOpacity
        style={styles.btnSelecionar}
        onPress={() => setModalClienteVisible(true)}
      >
        <Text
          style={
            clienteSelecionado ? styles.txtSelecionado : styles.txtPlaceholder
          }
        >
          {clienteSelecionado
            ? clienteSelecionado.nomeCliente
            : "Toque para selecionar um cliente"}
        </Text>
      </TouchableOpacity>

      {/* DADOS DO PRODUTO */}
      <View style={styles.cardProduto}>
        <TouchableOpacity
          style={styles.btnSelecionar}
          onPress={() => setModalProdutoVisible(true)}
        >
          <Text
            style={
              produtoSelecionado ? styles.txtSelecionado : styles.txtPlaceholder
            }
          >
            {produtoSelecionado
              ? produtoSelecionado.nomeProduto
              : "Toque pra selecionar um produto"}
          </Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Preço Unitário (Ex: 5.50)"
          keyboardType="numeric"
          value={precoInput}
          onChangeText={setPrecoInput}
        />

        {/* CONTROLES DE QUANTIDADE E BOTÃO ADICIONAR */}
        <View style={styles.linhaControles}>
          <View style={styles.controleQtd}>
            <TouchableOpacity
              style={styles.btnQtd}
              onPress={() => alterarQuantidade(-1)}
            >
              <Text style={styles.txtBtnQtd}>-</Text>
            </TouchableOpacity>
            <Text style={styles.txtQtd}>{quantidade}</Text>
            <TouchableOpacity
              style={styles.btnQtd}
              onPress={() => alterarQuantidade(1)}
            >
              <Text style={styles.txtBtnQtd}>+</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.txtSubtotal}>
            Subtotal: R${" "}
            {(
              parseFloat(precoInput.toString().replace(",", ".") || 0) *
              quantidade
            ).toFixed(2)}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.btnAdicionarProduto}
          onPress={adicionarAoCarrinho}
        >
          <Text style={styles.txtBtnAdicionar}>Inserir no Pedido</Text>
        </TouchableOpacity>
      </View>

      {/* TABELA DE PRODUTOS ADICIONADOS */}
      <Text style={styles.subtitulo}>Itens do Pedido</Text>
      <View style={styles.cabecalhoTabela}>
        <Text style={styles.celulaProdutoHead}>Produto</Text>
        <Text style={styles.celulaQtdHead}>Qtd</Text>
        <Text style={styles.celulaValorHead}>Subtotal</Text>
      </View>

      {/* O componente FlatList é ideal para exibir dados no formato de lista com alta performance [2, 5] */}
      <FlatList
        data={carrinho}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={styles.lista}
      />

      {/* RODAPÉ COM O TOTAL GERAL */}
      <View style={styles.rodapeTotal}>
        <Text style={styles.txtTotalGeral}>Total a Pagar:</Text>
        <Text style={styles.txtValorTotal}>
          R$ {calcularTotal().toFixed(2)}
        </Text>
      </View>

      {/* BOTÃO FINAL PARA SALVAR O PEDIDO NO BANCO */}
      <TouchableOpacity
        style={styles.botaoSalvarPedido}
        onPress={async () => {
          if (!clienteSelecionado) {
            Alert.alert("Atenção", "Selecione um cliente para o pedido.");
            return;
          }
          if (carrinho.length === 0) {
            Alert.alert("Atenção", "Adicione pelo menos um produto.");
            return;
          }

          try {
            const totalQtd = carrinho.reduce(
              (sum, item) => sum + item.quantidade,
              0,
            );

            const sucesso = await pedidoController.adicionarPedido(
              clienteSelecionado.nomeCliente,
              carrinho,
              totalQtd,
              calcularTotal(),
              new Date().toISOString(),
            );

            if (sucesso) {
              Alert.alert("Sucesso", "Pedido salvo com sucesso!");
              setCarrinho([]);
              setClienteSelecionado(null);
              if (navigation) navigation.goBack();
            } else {
              Alert.alert(
                "Erro",
                "Não foi possível conectar ao banco de dados para salvar.",
              );
            }
          } catch (error) {
            Alert.alert("Erro", "Falha inesperada ao tentar salvar.");
          }
        }}
      >
        <Text style={styles.textoBotao}>Confirmar Pedido</Text>
      </TouchableOpacity>

      {/* --- MODAIS DE SELEÇÃO --- */}
      <Modal
        visible={modalClienteVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalClienteVisible(false)}
      >
        <View style={styles.modalFundo}>
          <View style={styles.modalFrente}>
            <Text style={styles.tituloModal}>Selecione o Cliente</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#0055ff" />
            ) : (
              <FlatList
                data={clientesDb}
                keyExtractor={(item, index) =>
                  item.idCliente ? item.idCliente.toString() : index.toString()
                }
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.itemModal}
                    onPress={() => {
                      setClienteSelecionado(item);
                      setModalClienteVisible(false);
                    }}
                  >
                    <Text style={styles.txtItemModal}>{item.nomeCliente}</Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <Text style={{ textAlign: "center" }}>Nenhum cliente...</Text>
                }
              />
            )}
            <TouchableOpacity
              style={styles.btnFecharModal}
              onPress={() => setModalClienteVisible(false)}
            >
              <Text style={styles.txtBtnFecharModal}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={modalProdutoVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalProdutoVisible(false)}
      >
        <View style={styles.modalFundo}>
          <View style={styles.modalFrente}>
            <Text style={styles.tituloModal}>Selecione o Produto</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#ff6600" />
            ) : (
              <FlatList
                data={produtosDb}
                keyExtractor={(item, index) =>
                  item.idProduto ? item.idProduto.toString() : index.toString()
                }
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.itemModal}
                    onPress={() => {
                      setProdutoSelecionado(item);
                      setPrecoInput(item.precoProduto.toString());
                      setModalProdutoVisible(false);
                    }}
                  >
                    <Text style={styles.txtItemModal}>
                      {item.nomeProduto} - R${" "}
                      {Number(item.precoProduto).toFixed(2)}
                    </Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <Text style={{ textAlign: "center" }}>Nenhum produto...</Text>
                }
              />
            )}
            <TouchableOpacity
              style={styles.btnFecharModal}
              onPress={() => setModalProdutoVisible(false)}
            >
              <Text style={styles.txtBtnFecharModal}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f4f9", padding: 20 },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#fff",
    height: 45,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  cardProduto: {
    backgroundColor: "#e8e8e8",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  linhaControles: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  controleQtd: { flexDirection: "row", alignItems: "center" },
  btnQtd: {
    backgroundColor: "#ccc",
    width: 35,
    height: 35,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  txtBtnQtd: { fontSize: 20, fontWeight: "bold" },
  txtQtd: { fontSize: 18, fontWeight: "bold", marginHorizontal: 15 },
  txtSubtotal: { fontSize: 16, fontWeight: "bold", color: "#ff6600" },
  btnAdicionarProduto: {
    backgroundColor: "#333",
    height: 45,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  txtBtnAdicionar: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  cabecalhoTabela: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#ccc",
    paddingBottom: 5,
    marginBottom: 5,
  },
  linhaTabela: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 10,
  },
  celulaProdutoHead: { flex: 2, fontWeight: "bold" },
  celulaQtdHead: { flex: 1, fontWeight: "bold", textAlign: "center" },
  celulaValorHead: { flex: 1, fontWeight: "bold", textAlign: "right" },
  celulaProduto: { flex: 2 },
  celulaQtd: { flex: 1, textAlign: "center" },
  celulaValor: { flex: 1, textAlign: "right", fontWeight: "bold" },
  lista: { flex: 1, marginBottom: 10 },

  rodapeTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderTopWidth: 2,
    borderTopColor: "#333",
  },
  txtTotalGeral: { fontSize: 20, fontWeight: "bold" },
  txtValorTotal: { fontSize: 22, fontWeight: "bold", color: "#ff6600" },
  botaoSalvarPedido: {
    backgroundColor: "#0055ff",
    height: 55,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  textoBotao: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  btnSelecionar: {
    backgroundColor: "#fff",
    height: 45,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
  },
  txtPlaceholder: {
    color: "#888",
    fontSize: 16,
  },
  txtSelecionado: {
    color: "#333",
    fontSize: 16,
    fontWeight: "500",
  },
  modalFundo: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalFrente: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    maxHeight: "80%",
  },
  tituloModal: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  itemModal: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  txtItemModal: {
    fontSize: 16,
    color: "#444",
  },
  btnFecharModal: {
    marginTop: 20,
    backgroundColor: "#e74c3c",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  txtBtnFecharModal: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
