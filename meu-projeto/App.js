import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import Telas
import HomeScreen from "./src/view/HomeScreen";
import AboutScreen from "./src/view/AboutScreen";
import CadastroProdutoScreen from "./src/view/CadastroProdutoScreen";
import CardapioScreen from "./src/view/CardapioScreen";
import CadastroClienteScreen from "./src/view/CadastroClienteScreen";
import ListaClienteScreen from "./src/view/ListaClienteScreen";
import AdicionarPedidoScreen from "./src/view/AdicionarPedidoScreen";
import ListaPedidoScreen from "./src/view/ListaPedidoScreen";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: "#ff6600" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        {/* Pilha de Telas [3, 4, 5] */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Menu Principal" }}
        />

        {/* Telas de Pedido */}
        <Stack.Screen
          name="AdicionarPedido"
          component={AdicionarPedidoScreen}
          options={{ title: "Novo Pedido" }}
        />
        <Stack.Screen
          name="ListaPedido"
          component={ListaPedidoScreen}
          options={{ title: "Lista de Pedidos" }}
        />

        {/* Telas de Produto */}
        <Stack.Screen
          name="CadastroProduto"
          component={CadastroProdutoScreen}
          options={{ title: "Novo Produto" }}
        />
        <Stack.Screen
          name="Cardapio"
          component={CardapioScreen}
          options={{ title: "Cardápio" }}
        />

        {/* Telas de Cliente */}
        <Stack.Screen
          name="CadastroCliente"
          component={CadastroClienteScreen}
          options={{ title: "Novo Cliente" }}
        />
        <Stack.Screen
          name="ListaCliente"
          component={ListaClienteScreen}
          options={{ title: "Lista Cliente" }}
        />

        {/* Telas Voltar */}
        <Stack.Screen
          name="About"
          component={AboutScreen}
          options={{ title: "Sobre o App" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
