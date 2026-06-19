import { useState, useEffect } from 'react';

// --- IMPORTAÇÕES DO FIREBASE ---
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, addDoc } from 'firebase/firestore';

// --- DECLARAÇÕES DO TYPESCRIPT ---
declare const __firebase_config: string | undefined;
declare const __initial_auth_token: string | undefined;
declare const __app_id: string | undefined;

// --- COMPONENTES NATIVOS DE ÍCONES EM SVG ---
const ShoppingCartIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </svg>
);

const LogOutIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const ArrowLeftIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);

const CheckCircleIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const CreditCardIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const QrCodeIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
  </svg>
);

const FileTextIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
  </svg>
);

const SearchIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const SparklesIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
  </svg>
);

const PlusIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const MinusIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const CloseIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ClipboardIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
);

const AlertCircleIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

// ============================================================================
// CONFIGURAÇÕES DO FIREBASE
// ============================================================================
const customConfig = {
  apiKey: "AIzaSyDlAEHAeBpfvXtmiitPNHTPtzeZDYzVuqA",
  authDomain: "gkl-distribuidora.firebaseapp.com",
  projectId: "gkl-distribuidora",
  storageBucket: "gkl-distribuidora.firebasestorage.app",
  messagingSenderId: "791567747101",
  appId: "1:791567747101:web:e59cecf699c8715e30def4"
};

const rawAppId = typeof __app_id !== 'undefined' ? __app_id : 'gkl-distribuidora';
const appId = rawAppId.split('/')[0];

const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : customConfig;
const isFirebaseConfigured = firebaseConfig.apiKey && firebaseConfig.apiKey !== "SUA_API_KEY";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const PRODUCTS_FALLBACK = [
  { id: 1, name: 'Creme Desodorante Herbíssimo', category: 'Cuidados Pessoais', price: 5.90, stock: 150, image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=400' },
  { id: 2, name: 'Carmed Fini Dentaduras', category: 'Lábios', price: 24.90, stock: 85, image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=400' },
  { id: 3, name: 'Loção Bubbaloo Tutti Frutti', category: 'Corpo e Banho', price: 49.90, stock: 40, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400' },
];

const MOCK_USERS = {
  b2b_approved: { id: 'u2', name: 'Lojista Beta', isB2B: true, creditLimit: 5000.00, status: 'aprovado' },
  b2b_pending: { id: 'u3', name: 'Nova Loja (Em Análise)', isB2B: true, creditLimit: 0.00, status: 'pendente' }
};

// --- FUNÇÃO AUXILIAR: TRADUZ E ADAPTA CAMPOS DO PORTUGUÊS E CORRIGE VÍRGULAS ---
const normalizeProduct = (docId: string, data: any) => {
  const getFieldValue = (keys: string[]) => {
    for (const key of keys) {
      if (data[key] !== undefined) return data[key];
      const lowerKey = key.toLowerCase();
      const foundKey = Object.keys(data).find(k => k.toLowerCase() === lowerKey);
      if (foundKey !== undefined) return data[foundKey];
    }
    return undefined;
  };

  const name = getFieldValue(['name', 'nome', 'titulo', 'title']) || 'Produto sem Nome';
  const category = getFieldValue(['category', 'categoria']) || 'Sem Categoria';
  const image = getFieldValue(['image', 'imagem', 'foto', 'url', 'link']) || 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=400';
  
  const stockVal = getFieldValue(['stock', 'estoque', 'qtd', 'quantidade']);
  const stock = stockVal !== undefined ? parseInt(String(stockVal), 10) : 0;

  const priceVal = getFieldValue(['price', 'preco', 'preço', 'valor']);
  let price = 0;
  if (priceVal !== undefined && priceVal !== null) {
    if (typeof priceVal === 'number') {
      price = priceVal;
    } else if (typeof priceVal === 'string') {
      const cleanPrice = priceVal.replace(',', '.').replace(/[^\d.]/g, '');
      const parsed = parseFloat(cleanPrice);
      price = isNaN(parsed) ? 0 : parsed;
    }
  }

  const description = getFieldValue(['description', 'descricao', 'descrição']) || 
    'Produto oficial distribuído pela GKL Brasil. Qualidade garantida e excelência no cuidado que você merece.';

  return {
    id: docId,
    name,
    category,
    price,
    stock: isNaN(stock) ? 0 : stock,
    image,
    description
  };
};

const formatPrice = (value: any): string => {
  const num = Number(value);
  return isNaN(num) ? '0.00' : num.toFixed(2);
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [myOrders, setMyOrders] = useState<any[]>([]);

  const [activeAuthTab, setActiveAuthTab] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthFormEmail] = useState('');
  const [authPassword, setAuthFormPassword] = useState('');
  const [authName, setAuthFormName] = useState(''); // Razão Social
  const [authNIF, setAuthFormNif] = useState('');   // CNPJ

  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [dbProducts, setDbProducts] = useState<any[]>([]);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setDbProducts(PRODUCTS_FALLBACK.map(p => normalizeProduct(String(p.id), p)));
      return;
    }

    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          try {
            await signInWithCustomToken(auth, __initial_auth_token);
            return;
          } catch (tokenError) {
            console.warn("Falha no login por token customizado, tentando login anônimo de fallback:", tokenError);
          }
        }
        await signInAnonymously(auth);
      } catch (error) {
        console.error("Erro na autenticação do Firebase:", error);
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
    
    const path = typeof __app_id !== 'undefined' 
      ? collection(db, 'artifacts', appId, 'public', 'data', 'produtos')
      : collection(db, 'produtos'); 
      
    const unsubscribe = onSnapshot(path, (snapshot) => {
      const fetchedProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (fetchedProducts.length > 0) {
        setDbProducts(fetchedProducts as any);
      } else {
        setDbProducts(PRODUCTS_FALLBACK.map(p => normalizeProduct(String(p.id), p)));
      }
    }, (error) => {
      console.error("Aviso do Firestore (produtos):", error);
    });
    
    return () => unsubscribe();
  }, [firebaseUser]);

  useEffect(() => {
    if (!isFirebaseConfigured || !firebaseUser) return;

    const orderPath = typeof __app_id !== 'undefined'
      ? collection(db, 'artifacts', appId, 'users', firebaseUser.uid, 'pedidos')
      : collection(db, 'pedidos');

    const unsubscribe = onSnapshot(orderPath, (snapshot) => {
      const fetchedOrders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      fetchedOrders.sort((a: any, b: any) => {
        return new Date(b.dataCriacao || 0).getTime() - new Date(a.dataCriacao || 0).getTime();
      });
      setMyOrders(fetchedOrders);
    }, (error) => {
      console.error("Aviso do Firestore (pedidos):", error);
    });

    return () => unsubscribe();
  }, [firebaseUser]);

  const addToCart = (product: any, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: any) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== productId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (Number(item.price || 0) * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogin = (userType: 'b2b_approved' | 'b2b_pending') => {
    setCurrentUser(MOCK_USERS[userType]);
    setCurrentScreen('catalog');
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeAuthTab === 'register') {
      if (!authName || !authEmail || !authPassword || !authNIF) {
        alert("Por favor, preencha todos os campos para efetuar o registo.");
        return;
      }
      // NOVO FLUXO DE REGISTO: O utilizador entra sempre como PENDENTE e limite 0
      const newUser = {
        id: 'u_' + Math.random().toString(36).substring(2, 9),
        name: authName, // Razão Social
        email: authEmail,
        isB2B: true, 
        creditLimit: 0.00, // Limite zera até aprovação
        status: 'pendente', // NOVO STATUS
        nif: authNIF // CNPJ
      };
      setCurrentUser(newUser);
      alert(`Cadastro solicitado! O seu CNPJ passará por uma rápida análise de crédito. Até lá, pode comprar à vista.`);
      setCurrentScreen('catalog');
    } else {
      if (!authEmail || !authPassword) {
        alert("Por favor, introduza o seu Email e Palavra-passe.");
        return;
      }
      // Simulação: Se o email conter "pendente", loga como pendente
      const isPending = authEmail.includes('pendente');
      const loggedUser = {
        id: 'u_logged',
        name: isPending ? 'Loja Nova (Em análise)' : 'Lojista Aprovado',
        email: authEmail,
        isB2B: true,
        creditLimit: isPending ? 0.00 : 5000.00,
        status: isPending ? 'pendente' : 'aprovado'
      };
      setCurrentUser(loggedUser);
      setCurrentScreen('catalog');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCart([]);
    setSelectedCategory('Todas');
    setSelectedProduct(null);
    setAuthFormEmail('');
    setAuthFormPassword('');
    setAuthFormName('');
    setAuthFormNif('');
    setCurrentScreen('login');
  };

  const handleFinalizeOrder = async (paymentMethod: string) => {
    if (!isFirebaseConfigured) {
      alert("Modo de Simulação: Como as chaves do Firebase não foram colocadas, o pedido será apenas simulado na tela.");
      setCart([]); 
      setCurrentScreen('success');
      return;
    }

    if (!firebaseUser) {
       alert("Aguarde a conexão com o banco de dados e tente novamente.");
       return;
    }

    try {
      const orderPath = typeof __app_id !== 'undefined'
        ? collection(db, 'artifacts', appId, 'users', firebaseUser.uid, 'pedidos')
        : collection(db, 'pedidos');

      await addDoc(orderPath, {
        clienteId: currentUser?.id || firebaseUser.uid,
        clienteNome: currentUser?.name || 'Cliente GKL',
        isB2B: currentUser?.isB2B || false,
        itens: cart,
        total: cartTotal,
        metodoPagamento: paymentMethod,
        status: 'Autorizado',
        dataCriacao: new Date().toISOString()
      });

      setCart([]); 
      setCurrentScreen('success');
    } catch (error) {
      console.error("Erro ao guardar pedido:", error);
      alert("Erro ao finalizar pedido. Verifique as configurações do Firebase.");
    }
  };

  const openProductDetails = (product: any) => {
    setSelectedProduct(product);
    setModalQuantity(1);
  };

  const renderLogin = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F4F9F8] p-6">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-[#8ECAC5]/25">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#E8F3F2] text-[#8ECAC5] rounded-full flex items-center justify-center mx-auto mb-3">
            <SparklesIcon size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-[#8ECAC5] tracking-wide">GKL BRASIL</h1>
          <p className="text-[#698F8A] font-bold tracking-widest uppercase text-xs mb-1">Distribuidora</p>
          <p className="text-[#8ECAC5] text-sm font-semibold bg-[#E8F3F2] inline-block px-3 py-1 rounded-full">Acesso Exclusivo B2B</p>
        </div>

        <div className="flex bg-[#F4F9F8] rounded-xl p-1 mb-6 border border-[#E8F3F2]">
          <button
            onClick={() => setActiveAuthTab('login')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeAuthTab === 'login'
                ? 'bg-[#4A6B64] text-white shadow-sm'
                : 'text-[#698F8A] hover:text-[#4A6B64]'
            }`}
          >
            Entrar
          </button>
          <button
            onClick={() => setActiveAuthTab('register')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeAuthTab === 'register'
                ? 'bg-[#4A6B64] text-white shadow-sm'
                : 'text-[#698F8A] hover:text-[#4A6B64]'
            }`}
          >
            Criar Cadastro CNPJ
          </button>
        </div>

        <form onSubmit={handleAuthSubmit} className="space-y-4">
          {activeAuthTab === 'register' && (
            <>
              <div>
                <label className="block text-xs font-bold text-[#4A6B64] uppercase mb-1">Razão Social / Nome Fantasia</label>
                <input
                  type="text"
                  placeholder="Nome da sua loja ou empresa"
                  value={authName}
                  onChange={(e) => setAuthFormName(e.target.value)}
                  className="w-full bg-[#F4F9F8] text-[#4A6B64] border border-[#E8F3F2] rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#8ECAC5] transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A6B64] uppercase mb-1">CNPJ</label>
                <input
                  type="text"
                  placeholder="00.000.000/0000-00"
                  value={authNIF}
                  onChange={(e) => setAuthFormNif(e.target.value)}
                  className="w-full bg-[#F4F9F8] text-[#4A6B64] border border-[#E8F3F2] rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#8ECAC5] transition"
                  required
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-[#4A6B64] uppercase mb-1">Endereço de Email (Comercial)</label>
            <input
              type="email"
              placeholder="contato@sualoja.com"
              value={authEmail}
              onChange={(e) => setAuthFormEmail(e.target.value)}
              className="w-full bg-[#F4F9F8] text-[#4A6B64] border border-[#E8F3F2] rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#8ECAC5] transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A6B64] uppercase mb-1">Palavra-passe</label>
            <input
              type="password"
              placeholder="••••••••"
              value={authPassword}
              onChange={(e) => setAuthFormPassword(e.target.value)}
              className="w-full bg-[#F4F9F8] text-[#4A6B64] border border-[#E8F3F2] rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#8ECAC5] transition"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#4A6B64] hover:bg-[#3A5A53] text-white py-3.5 rounded-xl font-bold transition shadow-md mt-4 active:scale-95"
          >
            {activeAuthTab === 'register' ? 'Solicitar Cadastro' : 'Acessar Catálogo'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E8F3F2]"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-3 text-[#698F8A] font-bold">Acesso para Testes</span></div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => handleLogin('b2b_approved')}
            className="w-full flex items-center justify-center gap-1.5 bg-[#F4F9F8] hover:bg-[#E8F3F2] text-[#8ECAC5] py-2.5 px-4 rounded-xl text-xs font-bold border border-[#8ECAC5]/30 transition"
          >
            <FileTextIcon size={14} /> Entrar com Lojista Aprovado (Com Crédito)
          </button>
          
          <button
            onClick={() => handleLogin('b2b_pending')}
            className="w-full flex items-center justify-center gap-1.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 py-2.5 px-4 rounded-xl text-xs font-bold border border-yellow-200 transition"
          >
            <AlertCircleIcon size={14} /> Entrar como Recém-Registrado (Em Análise)
          </button>
        </div>
      </div>
    </div>
  );

  const renderCatalog = () => {
    const uniqueCategories = ['Todas', ...Array.from(new Set(dbProducts.map(p => p.category).filter(Boolean)))];

    const filteredProducts = dbProducts.filter(p => {
      const nameMatch = p.name ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) : false;
      const categorySearchMatch = p.category ? p.category.toLowerCase().includes(searchQuery.toLowerCase()) : false;
      const textMatch = nameMatch || categorySearchMatch;
      const categoryFilterMatch = selectedCategory === 'Todas' || p.category === selectedCategory;
      return textMatch && categoryFilterMatch;
    });

    const isPending = currentUser?.status === 'pendente';

    return (
      <div className="pb-24">
        {/* Aviso de Cadastro Pendente */}
        {isPending && (
          <div className="bg-yellow-50 border-b border-yellow-200 p-3 text-center">
            <p className="text-yellow-800 text-sm font-semibold flex items-center justify-center gap-2">
              <AlertCircleIcon size={16} />
              Seu cadastro está em análise de crédito. Até a aprovação, as compras só podem ser feitas à vista (PIX ou Cartão).
            </p>
          </div>
        )}

        {/* Barra de Busca */}
        <div className="bg-white p-4 shadow-sm sticky top-16 z-10 mb-2 border-b border-[#8ECAC5]/20">
          <div className="relative max-w-3xl mx-auto">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#698F8A]" size={20} />
            <input 
              type="text" 
              placeholder="Buscar produtos, categorias..." 
              className="w-full bg-[#F4F9F8] text-[#4A6B64] rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-[#8ECAC5] transition border border-transparent focus:border-[#8ECAC5]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Filtro Rápido de Categorias */}
        <div className="max-w-6xl mx-auto px-4 mb-6">
          <div className="flex gap-2 overflow-x-auto py-2 scrollbar-none">
            {uniqueCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === cat 
                    ? 'bg-[#4A6B64] text-white shadow-md transform scale-105' 
                    : 'bg-white text-[#4A6B64] border border-[#E8F3F2] hover:bg-[#E8F3F2]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grelha de Produtos */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#4A6B64]">
              {selectedCategory === 'Todas' ? 'Nosso Catálogo' : selectedCategory}
            </h2>
            <span className="text-sm text-[#698F8A] font-semibold">{filteredProducts.length} itens encontrados</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <div 
                key={product.id} 
                onClick={() => openProductDetails(product)}
                className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col border border-[#E8F3F2] hover:shadow-md transition-all duration-300 hover:border-[#8ECAC5]/50 cursor-pointer group"
              >
                <div className="h-48 overflow-hidden bg-[#F4F9F8] relative">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  {product.category && (
                    <span className="absolute top-3 right-3 bg-white/90 text-[#4A6B64] text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                      {product.category}
                    </span>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-[#4A6B64] group-hover:text-[#8ECAC5] transition-colors">{product.name}</h3>
                  <p className="text-sm text-[#698F8A] mb-4">Estoque: {product.stock} un</p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-xl font-bold text-[#8ECAC5]">R$ {formatPrice(product.price)}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); 
                        addToCart(product, 1);
                      }}
                      className="bg-[#4A6B64] text-white p-2.5 rounded-xl hover:bg-[#8ECAC5] transition shadow-sm hover:scale-110 duration-300"
                    >
                      <ShoppingCartIcon size={18} />
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
        <button onClick={() => setCurrentScreen('catalog')} className="p-2 hover:bg-[#E8F3F2] text-[#4A6B64] rounded-full transition">
          <ArrowLeftIcon size={24} />
        </button>
        <h2 className="text-2xl font-bold text-[#4A6B64]">Seu Carrinho</h2>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-[#E8F3F2]">
          <ShoppingCartIcon size={48} className="mx-auto text-[#8ECAC5]/50 mb-4" />
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
          {cart.map(item => (
            <div key={item.id} className="flex items-center bg-white p-4 rounded-xl shadow-sm border border-[#E8F3F2]">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg mr-4 border border-[#F4F9F8]" />
              <div className="flex-1">
                <h3 className="font-bold text-[#4A6B64]">{item.name}</h3>
                <p className="text-[#698F8A] text-sm">R$ {formatPrice(item.price)} x {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-[#4A6B64]">R$ {formatPrice(item.price * item.quantity)}</p>
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
              <span className="text-3xl font-bold text-[#8ECAC5]">R$ {formatPrice(cartTotal)}</span>
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
    const isPending = currentUser?.status === 'pendente';
    // Só pode usar crédito se for B2B, tiver limite e NÃO estiver pendente de aprovação
    const canUseCredit = currentUser?.isB2B && currentUser?.creditLimit >= cartTotal && !isPending;

    return (
      <div className="max-w-3xl mx-auto px-4 py-8 pb-24">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => setCurrentScreen('cart')} className="p-2 hover:bg-[#E8F3F2] text-[#4A6B64] rounded-full transition">
            <ArrowLeftIcon size={24} />
          </button>
          <h2 className="text-2xl font-bold text-[#4A6B64]">Pagamento</h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E8F3F2] mb-6">
          <h3 className="font-bold text-[#698F8A] mb-2">Resumo</h3>
          <p className="text-[#4A6B64]">Valor total a pagar: <strong className="text-2xl ml-2 text-[#8ECAC5]">R$ {formatPrice(cartTotal)}</strong></p>
          
          {currentUser?.isB2B && (
            <div className={`mt-4 p-4 rounded-xl text-sm border ${canUseCredit ? 'bg-[#E8F3F2] border-[#8ECAC5] text-[#4A6B64]' : 'bg-red-50 border-red-200 text-red-800'}`}>
              <strong className="text-base">Seu Limite B2B Faturado: R$ {formatPrice(currentUser.creditLimit)}</strong>
              {isPending ? (
                <p className="mt-1 font-semibold flex items-center gap-1"><AlertCircleIcon size={14}/> Crédito bloqueado. Cadastro em análise comercial.</p>
              ) : !canUseCredit ? (
                <p className="mt-1">O valor do pedido excede seu limite de crédito aprovado.</p>
              ) : null}
            </div>
          )}
        </div>

        <h3 className="font-bold text-[#4A6B64] mb-4 ml-2">Escolha a forma de pagamento:</h3>
        
        <div className="space-y-3">
          {/* Opção Faturada só aparece se aprovada ou se quiser mostrar desativada para visualização */}
          <button 
            onClick={() => {
              if (canUseCredit) handleFinalizeOrder('boleto_faturado');
            }}
            disabled={!canUseCredit}
            className={`w-full flex items-center justify-between p-4 rounded-xl transition text-left shadow-sm border-2 ${
              canUseCredit 
                ? 'bg-[#F4F9F8] border-[#8ECAC5] hover:bg-[#E8F3F2] cursor-pointer' 
                : 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`${canUseCredit ? 'bg-[#8ECAC5]' : 'bg-gray-300'} p-3 rounded-xl text-white`}><FileTextIcon size={24} /></div>
              <div>
                <h4 className={`font-bold text-lg ${canUseCredit ? 'text-[#4A6B64]' : 'text-gray-500'}`}>Boleto Faturado (30/60/90)</h4>
                <p className={`text-sm ${canUseCredit ? 'text-[#698F8A]' : 'text-gray-400'}`}>
                  {isPending ? 'Indisponível. Cadastro em análise.' : 'Utilizar limite de crédito aprovado.'}
                </p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => handleFinalizeOrder('pix')}
            className="w-full flex items-center justify-between p-4 bg-white border border-[#E8F3F2] rounded-xl hover:border-[#8ECAC5] transition text-left shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="bg-teal-50 p-3 rounded-xl text-teal-500"><QrCodeIcon size={24} /></div>
              <div>
                <h4 className="font-bold text-[#4A6B64] text-lg">PIX</h4>
                <p className="text-[#698F8A] text-sm">Aprovação imediata. Separação rápida.</p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => handleFinalizeOrder('cartao')}
            className="w-full flex items-center justify-between p-4 bg-white border border-[#E8F3F2] rounded-xl hover:border-[#8ECAC5] transition text-left shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 p-3 rounded-xl text-blue-500"><CreditCardIcon size={24} /></div>
              <div>
                <h4 className="font-bold text-[#4A6B64] text-lg">Cartão de Crédito</h4>
                <p className="text-[#698F8A] text-sm">Até 12x com juros da operadora.</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    );
  };

  const renderSuccess = () => (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <CheckCircleIcon size={80} className="text-[#8ECAC5] mb-6" />
      <h2 className="text-3xl font-bold text-[#4A6B64] mb-2">Pedido Realizado!</h2>
      <p className="text-[#698F8A] mb-8 max-w-md">
        Seu pedido foi enviado para o nosso sistema e já está na fila da expedição.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button 
          onClick={() => setCurrentScreen('catalog')}
          className="bg-[#4A6B64] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#3A5A53] transition shadow-lg"
        >
          Fazer novo pedido
        </button>
        <button 
          onClick={() => setCurrentScreen('orders')}
          className="bg-white border border-[#4A6B64] text-[#4A6B64] px-8 py-3 rounded-xl font-bold hover:bg-[#E8F3F2] transition shadow-sm"
        >
          Ver meus pedidos
        </button>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => setCurrentScreen('catalog')} className="p-2 hover:bg-[#E8F3F2] text-[#4A6B64] rounded-full transition">
          <ArrowLeftIcon size={24} />
        </button>
        <h2 className="text-2xl font-bold text-[#4A6B64]">Meus Pedidos</h2>
      </div>

      {myOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-[#E8F3F2]">
          <ClipboardIcon size={48} className="mx-auto text-[#8ECAC5]/50 mb-4" />
          <p className="text-[#698F8A]">Nenhum pedido efetuado até ao momento.</p>
          <button 
            onClick={() => setCurrentScreen('catalog')}
            className="mt-4 text-[#8ECAC5] font-bold hover:underline"
          >
            Começar a Comprar
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {myOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm p-6 border border-[#E8F3F2] hover:border-[#8ECAC5]/30 transition-all duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#F4F9F8] pb-4 mb-4 gap-2">
                <div>
                  <span className="text-xs font-bold text-[#698F8A] uppercase tracking-wider block">ID do Pedido</span>
                  <span className="text-sm font-mono text-[#4A6B64] font-bold">{order.id}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-[#698F8A] uppercase tracking-wider block text-left sm:text-right">Data</span>
                  <span className="text-sm text-[#4A6B64]">
                    {order.dataCriacao ? new Date(order.dataCriacao).toLocaleDateString('pt-PT', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'Sem data'}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-bold text-[#698F8A] uppercase tracking-wider block text-left sm:text-right font-bold">Status</span>
                  <span className="inline-block bg-[#E8F3F2] text-[#4A6B64] text-xs font-extrabold px-3 py-1 rounded-full mt-0.5">
                    {order.status || 'Autorizado'}
                  </span>
                </div>
              </div>

              {/* Itens do Pedido */}
              <div className="space-y-2 mb-4">
                {order.itens && Array.isArray(order.itens) ? order.itens.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-sm text-[#4A6B64]">
                    <span>{item.name} <strong className="text-[#8ECAC5]">x{item.quantity}</strong></span>
                    <span>R$ {formatPrice(Number(item.price || 0) * item.quantity)}</span>
                  </div>
                )) : null}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-[#F4F9F8]">
                <div>
                  <span className="text-xs text-[#698F8A] block">Pagamento</span>
                  <span className="text-xs font-bold uppercase text-[#4A6B64]">{order.metodoPagamento?.replace('_', ' ') || 'Não especificado'}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#698F8A] block">Total</span>
                  <span className="text-xl font-black text-[#8ECAC5]">R$ {formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4F9F8] font-sans relative">
      {currentUser && currentScreen !== 'login' && (
        <header className="bg-white border-b border-[#8ECAC5]/30 text-[#4A6B64] p-4 sticky top-0 z-20 shadow-sm">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2" onClick={() => setCurrentScreen('catalog')} style={{cursor: 'pointer'}}>
              <SparklesIcon size={24} className="text-[#8ECAC5]" />
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight hidden sm:block text-[#8ECAC5]">GKL BRASIL</span>
                <span className="text-[10px] font-bold tracking-wider uppercase text-[#698F8A] leading-none hidden sm:block">Distribuidora</span>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-sm text-right hidden sm:block text-[#698F8A]">
                Olá, <span className="font-bold text-[#4A6B64]">{currentUser.name}</span>
                {currentUser.isB2B && (
                  <div className="text-xs font-semibold text-[#8ECAC5]">
                    {currentUser.status === 'pendente' ? 'Conta em Análise' : `Limite: R$ ${formatPrice(currentUser.creditLimit)}`}
                  </div>
                )}
              </div>

              <button 
                onClick={() => setCurrentScreen('orders')}
                className={`p-2 rounded-full transition ${currentScreen === 'orders' ? 'bg-[#E8F3F2] text-[#4A6B64]' : 'hover:bg-[#E8F3F2] text-[#698F8A]'}`}
                title="Meus Pedidos"
              >
                <ClipboardIcon size={22} />
              </button>
              
              <button 
                onClick={() => setCurrentScreen('cart')}
                className="relative p-2 hover:bg-[#E8F3F2] rounded-full transition text-[#4A6B64]"
              >
                <ShoppingCartIcon size={24} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#8ECAC5] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                    {cartItemCount}
                  </span>
                )}
              </button>

              <button onClick={handleLogout} className="text-[#698F8A] hover:text-[#4A6B64] transition" title="Sair">
                <LogOutIcon size={24} />
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
      {currentScreen === 'orders' && renderOrders()}

      {/* Modal Flutuante */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto md:overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 flex flex-col md:flex-row border border-[#8ECAC5]/10">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 bg-white/80 p-2 rounded-full text-[#4A6B64] hover:bg-[#E8F3F2] transition z-10 shadow-sm"
            >
              <CloseIcon size={20} />
            </button>

            <div className="w-full md:w-1/2 h-64 md:h-auto bg-[#F4F9F8] relative">
              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.name} 
                className="w-full h-full object-cover"
              />
              {selectedProduct.category && (
                <span className="absolute top-4 left-4 bg-[#8ECAC5] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                  {selectedProduct.category}
                </span>
              )}
            </div>

            <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-[#4A6B64] mb-2 leading-tight">
                  {selectedProduct.name}
                </h3>
                <span className="inline-block bg-[#E8F3F2] text-[#4A6B64] text-xs font-bold px-3 py-1 rounded-full mb-4">
                  Estoque: {selectedProduct.stock} un
                </span>
                
                <p className="text-sm text-[#698F8A] leading-relaxed mb-6">
                  {selectedProduct.description}
                </p>
              </div>

              <div>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-xs font-semibold text-[#698F8A] uppercase">Preço</span>
                  <span className="text-3xl font-extrabold text-[#8ECAC5]">
                    R$ {formatPrice(selectedProduct.price)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center bg-[#F4F9F8] border border-[#E8F3F2] rounded-xl p-1 shadow-inner">
                    <button 
                      onClick={() => setModalQuantity(prev => Math.max(1, prev - 1))}
                      className="p-2 text-[#4A6B64] hover:bg-white rounded-lg transition"
                    >
                      <MinusIcon size={16} />
                    </button>
                    <span className="px-4 font-bold text-[#4A6B64] min-w-[32px] text-center">
                      {modalQuantity}
                    </span>
                    <button 
                      onClick={() => setModalQuantity(prev => Math.min(selectedProduct.stock || 999, prev + 1))}
                      className="p-2 text-[#4A6B64] hover:bg-white rounded-lg transition"
                    >
                      <PlusIcon size={16} />
                    </button>
                  </div>

                  <button 
                    onClick={() => {
                      addToCart(selectedProduct, modalQuantity);
                      setSelectedProduct(null);
                    }}
                    className="flex-1 bg-[#4A6B64] hover:bg-[#3A5A53] text-white py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-md active:scale-95"
                  >
                    <ShoppingCartIcon size={18} />
                    Adicionar ({modalQuantity})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}