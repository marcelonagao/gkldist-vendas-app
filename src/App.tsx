import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  User,
  Package,
  LogOut,
  ArrowLeft,
  CheckCircle,
  CreditCard,
  QrCode,
  FileText,
  Search,
  Sparkles,
} from 'lucide-react';

// --- IMPORTAÇÕES DO FIREBASE ---
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  signInWithCustomToken,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
} from 'firebase/firestore';

// ============================================================================
// COLOQUE AS SUAS CHAVES DO FIREBASE AQUI EM BAIXO:
// ============================================================================
const customConfig = {
  apiKey: 'AIzaSyDlAEHAeBpfvXtmiitPNHTPtzeZDYzVuqA',
  authDomain: 'gkl-distribuidora.firebaseapp.com',
  projectId: 'gkl-distribuidora',
  storageBucket: 'gkl-distribuidora.firebasestorage.app',
  messagingSenderId: '791567747101',
  appId: '1:791567747101:web:e59cecf699c8715e30def4',
};

// Verifica se está rodando no preview de testes ou com as suas chaves reais
const firebaseConfig =
  typeof __firebase_config !== 'undefined'
    ? JSON.parse(__firebase_config)
    : customConfig;
const isFirebaseConfigured =
  firebaseConfig.apiKey && firebaseConfig.apiKey !== 'SUA_API_KEY';

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- DADOS SIMULADOS (Usados caso o Firebase ainda esteja vazio) ---
const PRODUCTS_FALLBACK = [
  {
    id: 1,
    name: 'Creme Desodorante Herbíssimo',
    category: 'Cuidados Pessoais',
    price: 5.9,
    stock: 150,
    image:
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 2,
    name: 'Carmed Fini Dentaduras',
    category: 'Lábios',
    price: 24.9,
    stock: 85,
    image:
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 3,
    name: 'Loção Bubbaloo Tutti Frutti',
    category: 'Corpo e Banho',
    price: 49.9,
    stock: 40,
    image:
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 4,
    name: 'Body Splash La Belle',
    category: 'Perfumaria',
    price: 35.0,
    stock: 60,
    image:
      'https://images.unsplash.com/photo-1594498653385-d5172c532c00?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 5,
    name: 'Esmalte Face Beautiful',
    category: 'Unhas',
    price: 4.5,
    stock: 200,
    image:
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 6,
    name: 'Kit Lixa de Unha (100 un)',
    category: 'Acessórios',
    price: 15.0,
    stock: 30,
    image:
      'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=400',
  },
];

// Simulando dois tipos de clientes (No futuro virá do seu ERP/Bling)
const MOCK_USERS = {
  normal: { id: 'u1', name: 'João Silva', isB2B: false, creditLimit: 0 },
  b2b: { id: 'u2', name: 'Lojista Beta', isB2B: true, creditLimit: 5000.0 },
};

export default function App() {
  // --- ESTADOS DO APLICATIVO ---
  const [currentScreen, setCurrentScreen] = useState('login');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Estados do Firebase
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [dbProducts, setDbProducts] = useState(PRODUCTS_FALLBACK);

  // --- EFEITOS DO FIREBASE (Sincronização) ---
  useEffect(() => {
    if (!isFirebaseConfigured) {
      console.warn(
        'Chaves do Firebase não configuradas. Funcionando em modo de simulação visual.'
      );
      return;
    }

    // Inicia sessão no banco de dados para permitir salvar pedidos
    const initAuth = async () => {
      try {
        if (
          typeof __initial_auth_token !== 'undefined' &&
          __initial_auth_token
        ) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error('Erro na autenticação do Firebase:', error);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured || !firebaseUser) return;

    // Lê os produtos da coleção "produtos" em tempo real
    const path =
      typeof __app_id !== 'undefined'
        ? collection(db, 'artifacts', __app_id, 'public', 'data', 'produtos')
        : collection(db, 'produtos');

    const unsubscribe = onSnapshot(
      path,
      (snapshot) => {
        const fetchedProducts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        if (fetchedProducts.length > 0) {
          setDbProducts(fetchedProducts as any);
        }
      },
      (error) => {
        console.error('Aviso do Firestore:', error);
      }
    );

    return () => unsubscribe();
  }, [firebaseUser]);

  // --- LÓGICA DO CARRINHO ---
  const addToCart = (product: any) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: any) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // --- LÓGICA DE LOGIN ---
  const handleLogin = (userType: 'normal' | 'b2b') => {
    setCurrentUser(MOCK_USERS[userType]);
    setCurrentScreen('catalog');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCart([]);
    setCurrentScreen('login');
  };

  // --- LÓGICA DE CHECKOUT E SALVAR NO FIREBASE ---
  const handleFinalizeOrder = async (paymentMethod: string) => {
    if (!isFirebaseConfigured) {
      alert(
        'Modo de Simulação: Como as chaves do Firebase não foram colocadas, o pedido será apenas simulado na tela e não irá para o banco de dados.'
      );
      console.log('Pedido simulado finalizado!', {
        cart,
        total: cartTotal,
        paymentMethod,
      });
      setCart([]);
      setCurrentScreen('success');
      return;
    }

    if (!firebaseUser) {
      alert('Aguarde a conexão com o banco de dados e tente novamente.');
      return;
    }

    try {
      // Salva na coleção "pedidos"
      const orderPath =
        typeof __app_id !== 'undefined'
          ? collection(
              db,
              'artifacts',
              __app_id,
              'users',
              firebaseUser.uid,
              'pedidos'
            )
          : collection(db, 'pedidos');

      await addDoc(orderPath, {
        clienteId: currentUser.id,
        clienteNome: currentUser.name,
        isB2B: currentUser.isB2B,
        itens: cart,
        total: cartTotal,
        metodoPagamento: paymentMethod,
        status: 'Autorizado',
        dataCriacao: new Date().toISOString(),
      });

      console.log('Pedido guardado no Firebase com sucesso!');
      setCart([]);
      setCurrentScreen('success');
    } catch (error) {
      console.error('Erro ao guardar pedido:', error);
      alert(
        'Erro ao finalizar pedido. Verifique as configurações do Firebase.'
      );
    }
  };

  // --- RENDERIZAÇÃO DAS TELAS ---

  const renderLogin = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F4F9F8] p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center border border-[#8ECAC5]/20">
        <div className="w-16 h-16 bg-[#E8F3F2] text-[#8ECAC5] rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles size={32} />
        </div>
        <h1 className="text-3xl font-bold text-[#8ECAC5] tracking-wide mb-1">
          GKL BRASIL
        </h1>
        <p className="text-[#698F8A] font-semibold tracking-widest uppercase text-sm mb-8">
          Distribuidora
        </p>

        <div className="space-y-4">
          <button
            onClick={() => handleLogin('normal')}
            className="w-full flex items-center justify-center gap-2 bg-[#4A6B64] text-white py-3 rounded-xl hover:bg-[#3A5A53] transition shadow-md"
          >
            <User size={20} /> Entrar como Cliente Padrão
          </button>

          <button
            onClick={() => handleLogin('b2b')}
            className="w-full flex items-center justify-center gap-2 bg-[#8ECAC5] text-white py-3 rounded-xl hover:bg-[#7ABDB8] transition shadow-md"
          >
            <FileText size={20} /> Entrar como Lojista (Faturado)
          </button>
        </div>
      </div>
    </div>
  );

  const renderCatalog = () => {
    const filteredProducts = dbProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="pb-24">
        <div className="bg-white p-4 shadow-sm sticky top-16 z-10 mb-6 border-b border-[#8ECAC5]/20">
          <div className="relative max-w-3xl mx-auto">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#698F8A]"
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar produtos, categorias..."
              className="w-full bg-[#F4F9F8] text-[#4A6B64] rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-[#8ECAC5] transition border border-transparent focus:border-[#8ECAC5]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-xl font-bold text-[#4A6B64] mb-6">
            Nosso Catálogo
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col border border-[#E8F3F2] hover:shadow-md transition hover:border-[#8ECAC5]/50"
              >
                <div className="h-48 overflow-hidden bg-[#F4F9F8] relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 right-3 bg-white/90 text-[#4A6B64] text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                    {product.category}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-[#4A6B64]">
                    {product.name}
                  </h3>
                  <p className="text-sm text-[#698F8A] mb-4">
                    Estoque: {product.stock} un
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-xl font-bold text-[#8ECAC5]">
                      R$ {product.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-[#4A6B64] text-white p-2 rounded-lg hover:bg-[#8ECAC5] transition shadow-sm"
                    >
                      <ShoppingCart size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderCart = () => (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-24">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setCurrentScreen('catalog')}
          className="p-2 hover:bg-[#E8F3F2] text-[#4A6B64] rounded-full transition"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold text-[#4A6B64]">Seu Carrinho</h2>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-[#E8F3F2]">
          <ShoppingCart size={48} className="mx-auto text-[#8ECAC5]/50 mb-4" />
          <p className="text-[#698F8A]">Seu carrinho está vazio.</p>
          <button
            onClick={() => setCurrentScreen('catalog')}
            className="mt-4 text-[#8ECAC5] font-bold hover:underline"
          >
            Voltar ao catálogo
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center bg-white p-4 rounded-xl shadow-sm border border-[#E8F3F2]"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg mr-4 border border-[#F4F9F8]"
              />
              <div className="flex-1">
                <h3 className="font-bold text-[#4A6B64]">{item.name}</h3>
                <p className="text-[#698F8A] text-sm">
                  R$ {item.price.toFixed(2)} x {item.quantity}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-[#4A6B64]">
                  R$ {(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-400 text-sm font-semibold mt-1 hover:underline"
                >
                  Remover
                </button>
              </div>
            </div>
          ))}

          <div className="bg-[#4A6B64] text-white p-6 rounded-2xl mt-8 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg text-[#E8F3F2]">Total do Pedido</span>
              <span className="text-3xl font-bold text-[#8ECAC5]">
                R$ {cartTotal.toFixed(2)}
              </span>
            </div>
            <button
              onClick={() => setCurrentScreen('checkout')}
              className="w-full bg-[#8ECAC5] hover:bg-[#7ABDB8] text-white py-4 rounded-xl font-bold text-lg transition shadow-md"
            >
              Avançar para Pagamento
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderCheckout = () => {
    const canUseCredit =
      currentUser?.isB2B && currentUser?.creditLimit >= cartTotal;

    return (
      <div className="max-w-3xl mx-auto px-4 py-8 pb-24">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setCurrentScreen('cart')}
            className="p-2 hover:bg-[#E8F3F2] text-[#4A6B64] rounded-full transition"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-2xl font-bold text-[#4A6B64]">Pagamento</h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E8F3F2] mb-6">
          <h3 className="font-bold text-[#698F8A] mb-2">Resumo</h3>
          <p className="text-[#4A6B64]">
            Valor total a pagar:{' '}
            <strong className="text-2xl ml-2 text-[#8ECAC5]">
              R$ {cartTotal.toFixed(2)}
            </strong>
          </p>

          {currentUser?.isB2B && (
            <div
              className={`mt-4 p-4 rounded-xl text-sm border ${
                canUseCredit
                  ? 'bg-[#E8F3F2] border-[#8ECAC5] text-[#4A6B64]'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              <strong className="text-base">
                Seu Limite B2B: R$ {currentUser.creditLimit.toFixed(2)}
              </strong>
              {!canUseCredit && (
                <p className="mt-1">
                  O valor do pedido excede seu limite de crédito aprovado.
                </p>
              )}
            </div>
          )}
        </div>

        <h3 className="font-bold text-[#4A6B64] mb-4 ml-2">
          Escolha a forma de pagamento:
        </h3>

        <div className="space-y-3">
          {canUseCredit && (
            <button
              onClick={() => handleFinalizeOrder('boleto_faturado')}
              className="w-full flex items-center justify-between p-4 bg-[#F4F9F8] border-2 border-[#8ECAC5] rounded-xl hover:bg-[#E8F3F2] transition text-left shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="bg-[#8ECAC5] p-3 rounded-xl text-white">
                  <FileText size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-[#4A6B64] text-lg">
                    Boleto Faturado (30/60/90)
                  </h4>
                  <p className="text-[#698F8A] text-sm">
                    Utilizar limite de crédito aprovado.
                  </p>
                </div>
              </div>
            </button>
          )}

          <button
            onClick={() => handleFinalizeOrder('pix')}
            className="w-full flex items-center justify-between p-4 bg-white border border-[#E8F3F2] rounded-xl hover:border-[#8ECAC5] transition text-left shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="bg-teal-50 p-3 rounded-xl text-teal-500">
                <QrCode size={24} />
              </div>
              <div>
                <h4 className="font-bold text-[#4A6B64] text-lg">PIX</h4>
                <p className="text-[#698F8A] text-sm">
                  Aprovação imediata. Separação rápida.
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleFinalizeOrder('cartao')}
            className="w-full flex items-center justify-between p-4 bg-white border border-[#E8F3F2] rounded-xl hover:border-[#8ECAC5] transition text-left shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 p-3 rounded-xl text-blue-500">
                <CreditCard size={24} />
              </div>
              <div>
                <h4 className="font-bold text-[#4A6B64] text-lg">
                  Cartão de Crédito
                </h4>
                <p className="text-[#698F8A] text-sm">
                  Até 12x com juros da operadora.
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    );
  };

  const renderSuccess = () => (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <CheckCircle size={80} className="text-[#8ECAC5] mb-6" />
      <h2 className="text-3xl font-bold text-[#4A6B64] mb-2">
        Pedido Realizado!
      </h2>
      <p className="text-[#698F8A] mb-8 max-w-md">
        Seu pedido foi enviado para o nosso sistema e já está na fila da
        expedição.
      </p>
      <button
        onClick={() => setCurrentScreen('catalog')}
        className="bg-[#4A6B64] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#3A5A53] transition shadow-lg"
      >
        Fazer novo pedido
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4F9F8] font-sans">
      {currentUser && currentScreen !== 'login' && (
        <header className="bg-white border-b border-[#8ECAC5]/30 text-[#4A6B64] p-4 sticky top-0 z-20 shadow-sm">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div
              className="flex items-center gap-2"
              onClick={() => setCurrentScreen('catalog')}
              style={{ cursor: 'pointer' }}
            >
              <Sparkles size={24} className="text-[#8ECAC5]" />
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight hidden sm:block text-[#8ECAC5]">
                  GKL BRASIL
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase text-[#698F8A] leading-none hidden sm:block">
                  Distribuidora
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-sm text-right hidden sm:block text-[#698F8A]">
                Olá,{' '}
                <span className="font-bold text-[#4A6B64]">
                  {currentUser.name}
                </span>
                {currentUser.isB2B && (
                  <div className="text-xs font-semibold text-[#8ECAC5]">
                    Limite: R$ {currentUser.creditLimit.toFixed(2)}
                  </div>
                )}
              </div>

              <button
                onClick={() => setCurrentScreen('cart')}
                className="relative p-2 hover:bg-[#E8F3F2] rounded-full transition text-[#4A6B64]"
              >
                <ShoppingCart size={24} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#8ECAC5] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                    {cartItemCount}
                  </span>
                )}
              </button>

              <button
                onClick={handleLogout}
                className="text-[#698F8A] hover:text-[#4A6B64] transition"
                title="Sair"
              >
                <LogOut size={24} />
              </button>
            </div>
          </div>
        </header>
      )}

      {currentScreen === 'login' && renderLogin()}
      {currentScreen === 'catalog' && renderCatalog()}
      {currentScreen === 'cart' && renderCart()}
      {currentScreen === 'checkout' && renderCheckout()}
      {currentScreen === 'success' && renderSuccess()}
    </div>
  );
}
