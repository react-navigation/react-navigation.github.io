import React, { useState, useEffect, createContext, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  View, Text, TextInput, Button, StyleSheet, FlatList, ScrollView,
  Alert, TouchableOpacity, SafeAreaView,
} from 'react-native';

const Stack = createNativeStackNavigator();
const AuthContext = createContext();

const pedidosSimulados = [
  { id: '1', cliente: 'João', status: 'Pendente', valor: 22.5, localCliente: 'Centro' },
  { id: '2', cliente: 'Maria', status: 'Entregue', valor: 48.0, localCliente: 'Sul' },
  { id: '3', cliente: 'Carlos', status: 'Aceito', valor: 31.75, localCliente: 'Norte' },
];

const usuariosSimulados = [
  { id: '1', nome: 'Lucas', tipo: 'Entregador', transporte: 'Moto', ativo: true },
  { id: '2', nome: 'Ana', tipo: 'Cliente', ativo: true },
  { id: '3', nome: 'Pedro', tipo: 'Entregador', transporte: 'Bicicleta', ativo: false },
];

function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [tipoDeUsuario, setTipoDeUsuario] = useState(null);
  const [estaRegistrando, setEstaRegistrando] = useState(false);
  const [transporte, setTransporte] = useState('');

  const handleLogin = () => {
    if (!usuario || !senha || (estaRegistrando && !tipoDeUsuario)) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    if (tipoDeUsuario === 'funcionario' && !transporte && estaRegistrando) {
      Alert.alert('Erro', 'Informe o tipo de transporte');
      return;
    }

    if (!estaRegistrando) {
      if (usuario === 'italo1435' && senha === '1435@italo') {
        login('admin');
        navigation.replace('AdminHome');
      } else {
        login('cliente');
        navigation.replace('Cliente');
      }
    } else {
      login(tipoDeUsuario);
      navigation.replace(tipoDeUsuario === 'cliente' ? 'Cliente' : 'Entregador');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Busco Já - Login</Text>
      <TextInput style={styles.input} placeholder="Usuário" value={usuario} onChangeText={setUsuario} />
      <TextInput style={styles.input} placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry />

      {estaRegistrando && (
        <View>
          <Text style={styles.roleTitle}>Você é:</Text>
          <View style={styles.roleButtons}>
            <Button title="Cliente" onPress={() => setTipoDeUsuario('cliente')} />
            <Button title="Funcionário" onPress={() => setTipoDeUsuario('funcionario')} />
          </View>
          {tipoDeUsuario === 'funcionario' && (
            <TextInput
              style={styles.input}
              placeholder="Tipo de transporte"
              value={transporte}
              onChangeText={setTransporte}
            />
          )}
        </View>
      )}

      <Button title={estaRegistrando ? 'Registrar' : 'Entrar'} onPress={handleLogin} color="#2e7d32" />
      <Button
        title={estaRegistrando ? 'Fazer Login' : 'Criar Conta'}
        onPress={() => setEstaRegistrando(!estaRegistrando)}
        color="#616161"
      />
    </ScrollView>
  );
}

function AdminHomeScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Painel do Administrador</Text>
      <Button title="📦 Ver Pedidos" onPress={() => navigation.navigate('PedidosAdmin')} />
      <Button title="👥 Gerenciar Usuários" onPress={() => navigation.navigate('UsuariosAdmin')} />
      <Button title="📊 Estatísticas" onPress={() => navigation.navigate('EstatisticasAdmin')} />
      <Button title="🎨 Customizar App" onPress={() => navigation.navigate('TemaApp')} />
    </ScrollView>
  );
}

function PedidosAdminScreen() {
  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={pedidosSimulados}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text>Cliente: {item.cliente}</Text>
          <Text>Status: {item.status}</Text>
          <Text>Valor: R$ {item.valor.toFixed(2)}</Text>
          <Text>Local: {item.localCliente}</Text>
        </View>
      )}
    />
  );
}

function UsuariosAdminScreen() {
  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={usuariosSimulados}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text>Nome: {item.nome}</Text>
          <Text>Tipo: {item.tipo}</Text>
          {item.transporte && <Text>Transporte: {item.transporte}</Text>}
          <Text>Status: {item.ativo ? 'Ativo' : 'Inativo'}</Text>
        </View>
      )}
    />
  );
}

function EstatisticasAdminScreen() {
  const totalPedidos = pedidosSimulados.length;
  const entregues = pedidosSimulados.filter((p) => p.status === 'Entregue').length;
  const faturamento = pedidosSimulados.reduce((sum, p) => sum + p.valor, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estatísticas Gerais</Text>
      <Text>Total de Pedidos: {totalPedidos}</Text>
      <Text>Entregues: {entregues}</Text>
      <Text>Faturamento Total: R$ {faturamento.toFixed(2)}</Text>
    </View>
  );
}

function TemaAppScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customização do App</Text>
      <Text>Futuras funções: mudar cores, logo, mensagens...</Text>
    </View>
  );
}

function ClienteScreen() {
  const [pedido, setPedido] = useState('');
  const [endereco, setEndereco] = useState('');
  const [mercado, setMercado] = useState('');

  const handlePedido = () => {
    Alert.alert(
      'Pedido enviado',
      `Pedido: ${pedido}\nEndereço: ${endereco}\nMercado: ${mercado || 'à escolha do entregador'}`
    );
    setPedido('');
    setEndereco('');
    setMercado('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>O que você precisa?</Text>
      <TextInput style={styles.input} placeholder="Pedido" value={pedido} onChangeText={setPedido} />
      <TextInput style={styles.input} placeholder="Endereço" value={endereco} onChangeText={setEndereco} />
      <TextInput style={styles.input} placeholder="Mercado (opcional)" value={mercado} onChangeText={setMercado} />
      <Button title="Enviar Pedido" onPress={handlePedido} color="#2e7d32" />
    </ScrollView>
  );
}

function EntregadorScreen() {
  const [valorCompra, setValorCompra] = useState('');
  const [valorEntrega, setValorEntrega] = useState('');
  const [avaliacao, setAvaliacao] = useState(null);
  const [corridaFinalizada, setCorridaFinalizada] = useState(false);

  const concluirEntrega = () => {
    if (valorCompra && valorEntrega) {
      setCorridaFinalizada(true);
      Alert.alert('Entrega concluída', 'Pagamento confirmado. Avalie o serviço.');
    } else {
      Alert.alert('Erro', 'Preencha os valores para concluir a entrega.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Entrega disponível:</Text>
      <Text style={{ marginBottom: 8 }}>(Simulação) Pedido: 2kg de maçã, Bairro: Centro</Text>
      <Button title="Aceitar Entrega" onPress={() => Alert.alert('Entrega iniciada')} color="#2e7d32" />

      <Text style={styles.title}>Finalizar Entrega</Text>
      <TextInput
        style={styles.input}
        placeholder="Valor dos materiais (R$)"
        value={valorCompra}
        onChangeText={setValorCompra}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Valor da entrega (R$)"
        value={valorEntrega}
        onChangeText={setValorEntrega}
        keyboardType="numeric"
      />
      <Button title="Concluir Corrida" onPress={concluirEntrega} color="#2e7d32" />

      {corridaFinalizada && (
        <>
          <Text style={styles.title}>Corrida Concluída</Text>
          <Text style={styles.trackInfo}>
            Total: R$ {(parseFloat(valorCompra || 0) + parseFloat(valorEntrega || 0) + 2).toFixed(2)}
          </Text>
          <Text style={styles.trackHint}>Inclui taxa de R$2,00 do aplicativo</Text>
          <Text style={styles.title}>Avalie o Cliente</Text>
          <View style={styles.roleButtons}>
            {[1, 2, 3, 4, 5].map((n) => (
              <TouchableOpacity key={n} onPress={() => setAvaliacao(n)}>
                <Text style={{ fontSize: 24, marginHorizontal: 4, color: avaliacao === n ? '#fbc02d' : '#ccc' }}>★</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={{ marginTop: 10 }}>Nota: {avaliacao || 'Nenhuma'}</Text>
        </>
      )}
    </ScrollView>
  );
}

export default function App() {
  const [tipo, setTipo] = useState(null);
  const login = (tipo) => setTipo(tipo);

  return (
    <AuthContext.Provider value={{ tipo, login }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="AdminHome" component={AdminHomeScreen} />
          <Stack.Screen name="PedidosAdmin" component={PedidosAdminScreen} />
          <Stack.Screen name="UsuariosAdmin" component={UsuariosAdminScreen} />
          <Stack.Screen name="EstatisticasAdmin" component={EstatisticasAdminScreen} />
          <Stack.Screen name="TemaApp" component={TemaAppScreen} />
          <Stack.Screen name="Cliente" component={ClienteScreen} />
          <Stack.Screen name="Entregador" component={EntregadorScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 22,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#2e7d32',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  roleTitle: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  roleButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    borderColor: '#6A1B9A',
    borderWidth: 1,
    width: '90%',
  },
  trackInfo: {
    fontSize: 16,
    color: '#333',
    marginTop: 10,
    textAlign: 'center',
  },
  trackHint: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
