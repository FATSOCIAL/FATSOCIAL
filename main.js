// Grab React elements directly from the mobile window context
const { useState, useEffect } = window.React;
const e = window.React.createElement;

function App() {
  // --- 1. MEMORY AND SESSION STATE ENGINE ---
  const [currentPage, setCurrentPage] = useState(() => localStorage.getItem('fatsocial_page') || 'landing');
  const [userRole, setUserRole] = useState(() => localStorage.getItem('fatsocial_role') || '');
  const [fatcoinBalance, setFatcoinBalance] = useState(() => parseInt(localStorage.getItem('fatsocial_coins')) || 0);

  // Layout & Form Controller States
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [unlockedCreators, setUnlockedCreators] = useState(() => JSON.parse(localStorage.getItem('fatsocial_unlocked')) || []);
  const [subscribedCreators, setSubscribedCreators] = useState(() => JSON.parse(localStorage.getItem('fatsocial_subs')) || []);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState('feed'); 

  // Sync state cleanly with LocalStorage on refresh
  useEffect(() => {
    localStorage.setItem('fatsocial_page', currentPage);
    localStorage.setItem('fatsocial_role', userRole);
    localStorage.setItem('fatsocial_coins', fatcoinBalance);
    localStorage.setItem('fatsocial_unlocked', JSON.stringify(unlockedCreators));
    localStorage.setItem('fatsocial_subs', JSON.stringify(subscribedCreators));
  }, [currentPage, userRole, fatcoinBalance, unlockedCreators, subscribedCreators]);

  const navigateTo = (page) => {
    setErrorMessage('');
    setCurrentPage(page);
  };

  const handleLogout = () => {
    setIsSidebarOpen(false);
    setUserRole('');
    setFatcoinBalance(0);
    setUnlockedCreators([]);
    setSubscribedCreators([]);
    navigateTo('landing');
  };

  const triggerCreatorPaymentModal = () => {
    if (!fullName || !email || !password) {
      setErrorMessage('Please fill out all required setup fields.');
      return;
    }
    setErrorMessage('');
    navigateTo('payment_creator');
  };

  const handleConfirmCreatorPayment = () => {
    setUserRole('creator');
    navigateTo('dashboard');
  };

  const handleAuthViewer = () => {
    if (!email || !password) {
      setErrorMessage('Please fill out all required setup fields.');
      return;
    }
    setUserRole('viewer');
    navigateTo('dashboard');
  };

  const purchaseFatcoins = (coins, cost) => {
    alert(`Redirecting to Bitcoin wallet to process $${cost} worth of BTC...`);
    setFatcoinBalance(prev => prev + coins);
    setIsTopUpOpen(false);
  };

  const unlockCreatorProfile = (creatorId) => {
    if (unlockedCreators.includes(creatorId)) return true;
    if (fatcoinBalance < 30) {
      setErrorMessage('Insufficient Fatcoin balance. Minimum 30 Fatcoins required to unlock creator profile details.');
      setIsTopUpOpen(true);
      return false;
    }
    setFatcoinBalance(prev => prev - 30);
    setUnlockedCreators(prev => [...prev, creatorId]);
    return true;
  };

  const toggleSubscribe = (creatorId) => {
    if (subscribedCreators.includes(creatorId)) {
      setSubscribedCreators(prev => prev.filter(id => id !== creatorId));
      return;
    }
    if (!unlockedCreators.includes(creatorId)) {
      if (!unlockCreatorProfile(creatorId)) return;
    }
    if (fatcoinBalance < 30) {
      setErrorMessage('Insufficient balance to pay subscriber entry fee.');
      setIsTopUpOpen(true);
      return;
    }
    setFatcoinBalance(prev => prev - 30);
    setSubscribedCreators(prev => [...prev, creatorId]);
  };

  // --- SCREEN RENDERING LAYER CONTROLLER ---
  
  // 1. Landing View
  if (currentPage === 'landing') {
    return e('div', { className: 'min-h-screen bg-[#121212] text-white max-w-md mx-auto flex flex-col justify-between p-6 shadow-md' }, [
      e('div', { key: 'hero', className: 'flex-1 flex flex-col justify-center items-center text-center space-y-5' }, [
        e('div', { key: 'logo', className: 'w-16 h-16 bg-white text-[#121212] rounded-2xl flex items-center justify-center shadow-md font-black text-2xl' }, 'F'),
        e('h1', { key: 'title', className: 'text-3xl font-black tracking-tight' }, 'FATSOCIAL'),
        e('p', { key: 'desc', className: 'text-xs text-gray-400 max-w-xs leading-relaxed' }, 'Connect directly with premium elite skills marketplaces.')
      ]),
      e('div', { key: 'actions', className: 'space-y-3 pb-6' }, [
        e('button', { key: 'btn-up', onClick: () => navigateTo('choose_track'), className: 'w-full bg-white text-[#121212] font-bold py-4 rounded-xl text-sm' }, 'Create Account'),
        e('button', { key: 'btn-in', onClick: () => navigateTo('signin'), className: 'w-full bg-transparent border border-white/20 font-bold py-4 rounded-xl text-sm text-white' }, 'Sign In Account')
      ])
    ]);
  }

  // 2. Track Selector View
  if (currentPage === 'choose_track') {
    return e('div', { className: 'min-h-screen bg-white text-[#121212] max-w-md mx-auto flex flex-col p-6 shadow-md' }, [
      e('button', { key: 'back', onClick: () => navigateTo('landing'), className: 'flex items-center text-xs font-bold text-gray-400 mt-4 mb-6' }, '← BACK'),
      e('h2', { key: 'title', className: 'text-2xl font-black tracking-tight mb-2' }, 'Choose Account Type'),
      e('div', { key: 'options', className: 'space-y-4 flex-1' }, [
        e('div', { 
          key: 'opt-creator',
          onClick: () => navigateTo('signup_creator'),
          className: 'border-2 border-[#121212] p-5 rounded-2xl cursor-pointer'
        }, [
          e('h3', { className: 'font-bold text-base mb-1' }, 'Content Creator Career'),
          e('p', { className: 'text-xs text-gray-500' }, 'Access analytics dashboards and earn task payouts.')
        ]),
        e('div', { 
          key: 'opt-viewer',
          onClick: () => navigateTo('signup_viewer'),
          className: 'border border-gray-200 p-5 rounded-2xl cursor-pointer'
        }, [
          e('h3', { className: 'font-bold text-base mb-1' }, 'General Consumer / Viewer'),
          e('p', { className: 'text-xs text-gray-500' }, 'Discover professional skills and purchase usage rights.')
        ])
      ])
    ]);
  }

  // 3. Sign In Portal
  if (currentPage === 'signin') {
    return e('div', { className: 'min-h-screen bg-white text-[#121212] max-w-md mx-auto flex flex-col p-6 shadow-md' }, [
      e('button', { key: 'back', onClick: () => navigateTo('landing'), className: 'flex items-center text-xs font-bold text-gray-400 mt-4 mb-6' }, '← BACK'),
      e('h2', { key: 'title', className: 'text-2xl font-black tracking-tight mb-6' }, 'Welcome Back'),
      errorMessage && e('div', { className: 'bg-red-50 text-red-600 text-xs font-semibold p-3 rounded-xl mb-4' }, errorMessage),
      e('div', { className: 'space-y-4 flex-1' }, [
        e('input', { type: 'email', value: email, onChange: e => setEmail(e.target.value), placeholder: 'name@example.com', className: 'w-full px-4 py-3.5 bg-[#F8F8FA] border border-gray-100 rounded-xl text-sm' }),
        e('input', { type: 'password', value: password, onChange: e => setPassword(e.target.value), placeholder: 'Enter password', className: 'w-full px-4 py-3.5 bg-[#F8F8FA] border border-gray-100 rounded-xl text-sm' }),
        e('button', { onClick: handleAuthViewer, className: 'w-full bg-[#121212] text-white font-bold py-4 rounded-xl text-sm' }, 'Sign In Account')
      ])
    ]);
  }

  // 4. Creator Signup Portal
  if (currentPage === 'signup_creator') {
    return e('div', { className: 'min-h-screen bg-white text-[#121212] max-w-md mx-auto flex flex-col p-6 shadow-md' }, [
      e('button', { key: 'back', onClick: () => navigateTo('choose_track'), className: 'flex items-center text-xs font-bold text-gray-400 mt-4 mb-6' }, '← BACK'),
      e('h2', { key: 'title', className: 'text-2xl font-black tracking-tight mb-1' }, 'Setup Career Profile'),
      errorMessage && e('div', { className: 'bg-red-50 text-red-600 text-xs font-semibold p-3 rounded-xl mb-4' }, errorMessage),
      
      e('div', { className: 'space-y-4 flex-1' }, [
        e('input', { type: 'text', value: fullName, onChange: e => setFullName(e.target.value), placeholder: 'Full Legal Name', className: 'w-full px-4 py-3.5 bg-[#F8F8FA] rounded-xl text-sm border' }),
        e('input', { type: 'email', value: email, onChange: e => setEmail(e.target.value), placeholder: 'Email Address', className: 'w-full px-4 py-3.5 bg-[#F8F8FA] rounded-xl text-sm border' }),
        e('input', { type: 'password', value: password, onChange: e => setPassword(e.target.value), placeholder: 'Minimum 6 characters', className: 'w-full px-4 py-3.5 bg-[#F8F8FA] rounded-xl text-sm border' }),
        e('div', { className: 'bg-[#F8F8FA] p-4 rounded-xl flex items-center justify-between text-xs' }, [
          e('span', { className: 'font-bold text-gray-900' }, 'One-Time Setup Fee'),
          e('span', { className: 'text-sm font-black text-[#121212]' }, '$25.00')
        ]),
        e('button', { onClick: triggerCreatorPaymentModal, className: 'w-full bg-[#121212] text-white font-bold py-4 rounded-xl text-sm' }, 'Pay Fee & Deploy Profile')
      ])
    ]);
  }

  // 4B. Standalone Creator Bitcoin Payment Screen
  if (currentPage === 'payment_creator') {
    return e('div', { className: 'min-h-screen bg-white text-[#121212] max-w-md mx-auto flex flex-col justify-center p-6 shadow-md' }, [
      e('div', { className: 'text-center space-y-5' }, [
        e('div', { className: 'text-amber-500 font-black text-xl' }, '₿ Bitcoin Deposit'),
        e('h3', { className: 'font-black text-xl text-gray-900' }, 'Deposit Required'),
        e('p', { className: 'text-xs text-gray-400 px-4' }, 'Send exactly $25.00 worth of BTC to the official address below to activate your account.'),
        e('div', { className: 'bg-[#F8F8FA] p-4 rounded-xl border text-left font-mono text-xs break-all select-all' }, 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'),
        e('div', { className: 'space-y-2' }, [
          e('button', { onClick: handleConfirmCreatorPayment, className: 'w-full bg-emerald-500 text-white font-bold py-4 rounded-xl text-xs uppercase' }, 'I HAVE PAID'),
          e('button', { onClick: () => navigateTo('signup_creator'), className: 'w-full bg-transparent text-gray-400 font-bold py-2 rounded-xl text-xs' }, 'Cancel Payment')
        ])
      ])
    ]);
  }

  // 5. Viewer Signup Portal
  if (currentPage === 'signup_viewer') {
    return e('div', { className: 'min-h-screen bg-white text-[#121212] max-w-md mx-auto flex flex-col p-6 shadow-md' }, [
      e('button', { key: 'back', onClick: () => navigateTo('choose_track'), className: 'flex items-center text-xs font-bold text-gray-400 mt-4 mb-6' }, '← BACK'),
      e('h2', { key: 'title', className: 'text-2xl font-black tracking-tight mb-2' }, 'Setup Viewer Profile'),
      errorMessage && e('div', { className: 'bg-red-50 text-red-600 text-xs font-semibold p-3 rounded-xl mb-4' }, errorMessage),
      e('div', { className: 'space-y-4 flex-1' }, [
        e('input', { type: 'email', value: email, onChange: e => setEmail(e.target.value), placeholder: 'name@example.com', className: 'w-full px-4 py-3.5 bg-[#F8F8FA] border border-gray-100 rounded-xl text-sm' }),
        e('input', { type: 'password', value: password, onChange: e => setPassword(e.target.value), placeholder: 'Minimum 6 characters', className: 'w-full px-4 py-3.5 bg-[#F8F8FA] border border-gray-100 rounded-xl text-sm' }),
        e('button', { onClick: handleAuthViewer, className: 'w-full bg-[#121212] text-white font-bold py-4 rounded-xl text-sm' }, 'Create Free Account')
      ])
    ]);
  }

  // 6A. Dashboard View - Creator Track
  if (currentPage === 'dashboard' && userRole === 'creator') {
    return e('div', { className: 'min-h-screen bg-[#F8F8FA] text-[#121212] max-w-md mx-auto relative shadow-md p-4 space-y-4' }, [
      e('div', { className: 'bg-[#121212] text-white p-6 rounded-2xl flex justify-between items-center' }, [
        e('div', null, [
          e('div', { className: 'text-xs text-gray-400' }, 'Creator Monetization Platform'),
          e('div', { className: 'text-3xl font-black mt-1' }, '$0.00')
        ]),
        e('button', { onClick: handleLogout, className: 'bg-white text-[#121212] px-3 py-1.5 rounded-xl font-bold text-xs' }, 'Logout')
      ]),
      e('div', { className: 'bg-white rounded-2xl p-4 shadow-sm space-y-2' }, [
        e('h2', { className: 'text-sm font-bold' }, 'Active Programs'),
        e('div', { className: 'text-xs text-gray-500' }, '• LIVE Rewards (Active)'),
        e('div', { className: 'text-xs text-gray-500' }, '• Sub Tips (Active)'),
        e('div', { className: 'text-xs text-gray-500' }, '• Task Rewards (Active)')
      ])
    ]);
  }

  // 6B. Dashboard View - General Viewer Track
  if (currentPage === 'dashboard' && userRole === 'viewer') {
    return e('div', { className: 'min-h-screen bg-[#F8F8FA] text-[#121212] max-w-md mx-auto shadow-md flex flex-col justify-between' }, [
      e('div', { className: 'bg-[#121212] text-white p-4 flex justify-between items-center' }, [
        e('div', null, [
          e('div', { className: 'text-[10px] uppercase font-bold text-gray-400' }, 'Fatcoin Balance'),
          e('div', { className: 'text-sm font-black' }, `${fatcoinBalance} FC`)
        ]),
        e('button', { onClick: () => setIsTopUpOpen(true), className: 'bg-white text-[#121212] font-black text-xs px-3 py-1.5 rounded-xl' }, '+ Buy Coins')
      ]),

      errorMessage && e('div', { className: 'mx-4 mt-3 bg-red-50 text-red-600 text-xs font-bold p-3 rounded-xl' }, errorMessage),

      e('div', { className: 'flex-1 p-4 space-y-4 overflow-y-auto' }, [
        e('div', { className: 'bg-white rounded-2xl p-4 shadow-sm border space-y-2' }, [
          e('h3', { className: 'font-black text-sm text-gray-900' }, 'Alex Rivers'),
          e('span', { className: 'text-[11px] font-bold text-gray-400 block' }, 'UI/UX Mobile Architect'),
          e('button', { onClick: () => toggleSubscribe('c1'), className: 'bg-[#121212] text-white text-xs px-3 py-1.5 rounded-xl font-bold' }, 'Subscribe (30 FC)')
        ])
      ]),

      isTopUpOpen && e('div', { className: 'fixed inset-0 bg-black/60 z-50 flex items-end justify-center p-4' }, [
        e('div', { className: 'bg-white w-full rounded-t-3xl p-6 space-y-3 max-w-md' }, [
          e('h3', { className: 'font-black text-base' }, 'Fatcoin Wallet Token Exchange'),
          e('div', { onClick: () => purchaseFatcoins(120, 23), className: 'bg-[#F8F8FA] p-4 rounded-xl flex justify-between items-center cursor-pointer font-bold text-sm' }, [
            e('span', null, '120 Fatcoins'), e('span', { className: 'bg-[#121212] text-white text-xs px-2 py-1 rounded' }, '$23 BTC')
          ]),
          e('button', { onClick: () => setIsTopUpOpen(false), className: 'w-full text-center text-xs text-gray-400 mt-2' }, 'Close')
        ])
      ]),

      e('div', { className: 'bg-white border-t py-3 px-8 flex justify-around items-center' }, [
        e('button', { onClick: () => setActiveTab('feed'), className: 'text-[#121212] font-bold text-xs' }, 'Explore'),
        e('button', { onClick: handleLogout, className: 'text-gray-400 font-bold text-xs' }, 'Log Out')
      ])
    ]);
  }

  return e('div', { className: 'p-6 text-center text-xs text-gray-400' }, 'Initializing standard security runtime modules...');
}

const root = window.ReactDOM.createRoot(document.getElementById('root'));
root.render(e(App));
