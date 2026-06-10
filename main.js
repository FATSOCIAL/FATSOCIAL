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
  const [isCreatorPaymentOpen, setIsCreatorPaymentOpen] = useState(false); // Controls the new Bitcoin payment box
  const [unlockedCreators, setUnlockedCreators] = useState(() => JSON.parse(localStorage.getItem('fatsocial_unlocked')) || []);
  const [subscribedCreators, setSubscribedCreators] = useState(() => JSON.parse(localStorage.getItem('fatsocial_subs')) || []);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' or 'wallet'

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

  // Validates form input first before showing the Bitcoin instructions
  const triggerCreatorPaymentModal = () => {
    if (!fullName || !email || !password) {
      setErrorMessage('Please fill out all required setup fields.');
      return;
    }
    setErrorMessage('');
    setIsCreatorPaymentOpen(true);
  };

  // Executed when the user clicks the "PAID" button inside the instruction box
  const handleConfirmCreatorPayment = () => {
    setIsCreatorPaymentOpen(false);
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

  // --- 2. PREMIUM FATCOIN ECONOMY LOGIC ---
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

  // Mock Content Storage 
  const sampleCreators = [
    { id: 'c1', name: 'Alex Rivers', skill: 'UI/UX Mobile Architect', bio: 'Full scale vector kits and design engineering systems.', post: 'Just finished editing the UI configuration pipeline asset maps. Full rights packages opening soon.' },
    { id: 'c2', name: 'Elena Rostova', skill: 'Brand Identity Expert', bio: 'Premium visual brand systems, strategy, and layout schemes.', post: 'Showcasing the production draft layout for the dual marketplace core engine. Check out my catalog.' }
  ];

  const activeProgramsList = [
    { id: 'p1', title: 'LIVE Rewards', icon: 'videocam-outline' },
    { id: 'p2', title: 'Sub Tips', icon: 'card-outline' },
    { id: 'p3', title: 'Task Rewards', icon: 'checkbox-outline' },
    { id: 'p4', title: 'Creator Rewards', icon: 'cash-outline' }
  ];

  // --- SCREEN 1: LANDING ENTRYWAY ---
  if (currentPage === 'landing') {
    return e('div', { className: 'min-h-screen bg-[#121212] text-white max-w-md mx-auto flex flex-col justify-between p-6 shadow-md relative' },
      e('div', { className: 'flex-1 flex flex-col justify-center items-center text-center space-y-5' },
        e('div', { className: 'w-16 h-16 bg-white text-[#121212] rounded-2xl flex items-center justify-center shadow-md' },
          e('ion-icon', { name: 'flash', style: { fontSize: '36px' } })
        ),
        e('h1', { className: 'text-3xl font-black tracking-tight' }, 'FATSOCIAL'),
        e('p', { className: 'text-xs text-gray-400 max-w-xs leading-relaxed' }, 'Connect directly with premium elite skills marketplaces. Build career rewards as a creator or purchase specialized assets as an expert viewer.')
      ),
      e('div', { className: 'space-y-3 pb-6' },
        e('button', { onClick: () => navigateTo('choose_track'), className: 'w-full bg-white text-[#121212] font-bold py-4 rounded-xl text-sm transition-all' }, 'Create Account'),
        e('button', { onClick: () => navigateTo('signin'), className: 'w-full bg-transparent border border-white/20 font-bold py-4 rounded-xl text-sm text-white transition-all' }, 'Sign In Account')
      )
    );
  }

  // --- SCREEN 2: DUAL TRACK PICKER ---
  if (currentPage === 'choose_track') {
    return e('div', { className: 'min-h-screen bg-white text-[#121212] max-w-md mx-auto flex flex-col p-6 shadow-md' },
      e('button', { onClick: () => navigateTo('landing'), className: 'flex items-center text-xs font-bold text-gray-400 mt-4 mb-6' }, 
        e('ion-icon', { name: 'arrow-back-outline', style: { marginRight: '4px' } }), 'BACK'
      ),
      e('h2', { className: 'text-2xl font-black tracking-tight mb-2' }, 'Choose Account Type'),
      e('p', { className: 'text-xs text-gray-400 mb-6' }, 'Select the customized interface suited for your platform profile.'),
      e('div', { className: 'space-y-4 flex-1' },
        e('div', { 
          onClick: () => navigateTo('signup_creator'),
          className: 'border-2 border-[#121212] p-5 rounded-2xl cursor-pointer hover:bg-gray-50 transition-all'
        }, [
          e('div', { className: 'flex items-center space-x-3 mb-2' }, [
            e('ion-icon', { name: 'trophy-outline', style: { fontSize: '24px', color: '#121212' } }),
            e('h3', { className: 'font-bold text-base' }, 'Content Creator Career')
          ]),
          e('p', { className: 'text-xs text-gray-500 leading-relaxed' }, 'Access analytics dashboards, earn system payouts via tasks, design premium subscriptions, and monetize tools.')
        ]),
        e('div', { 
          onClick: () => navigateTo('signup_viewer'),
          className: 'border border-gray-200 p-5 rounded-2xl cursor-pointer hover:border-[#121212] transition-all'
        }, [
          e('div', { className: 'flex items-center space-x-3 mb-2' }, [
            e('ion-icon', { name: 'eye-outline', style: { fontSize: '24px', color: '#121212' } }),
            e('h3', { className: 'font-bold text-base' }, 'General Consumer / Viewer')
          ]),
          e('p', { className: 'text-xs text-gray-500 leading-relaxed' }, 'Discover professional skills showcase pools, purchase usage rights licenses, follow creators, send media content gifts, or send direct tips using system tokens.')
        ])
      )
    );
  }

  // --- SCREEN 3: SIGN IN PORTAL ---
  if (currentPage === 'signin') {
    return e('div', { className: 'min-h-screen bg-white text-[#121212] max-w-md mx-auto flex flex-col p-6 shadow-md' },
      e('button', { onClick: () => navigateTo('landing'), className: 'flex items-center text-xs font-bold text-gray-400 mt-4 mb-6' }, 
        e('ion-icon', { name: 'arrow-back-outline', style: { marginRight: '4px' } }), 'BACK'
      ),
      e('h2', { className: 'text-2xl font-black tracking-tight mb-6' }, 'Welcome Back'),
      errorMessage && e('div', { className: 'bg-red-50 text-red-600 text-xs font-semibold p-3.5 rounded-xl mb-4' }, errorMessage),
      e('div', { className: 'space-y-4 flex-1' }, [
        e('div', null, [
          e('label', { className: 'block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider' }, 'Account Email'),
          e('input', { type: 'email', value: email, onChange: e => setEmail(e.target.value), placeholder: 'name@example.com', className: 'w-full px-4 py-3.5 bg-[#F8F8FA] border border-gray-100 rounded-xl focus:outline-none text-sm font-medium' })
        ]),
        e('div', null, [
          e('label', { className: 'block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider' }, 'Password'),
          e('div', { className: 'relative' }, [
            e('input', { type: showPassword ? 'text' : 'password', value: password, onChange: e => setPassword(e.target.value), placeholder: 'Enter password', className: 'w-full px-4 py-3.5 bg-[#F8F8FA] border border-gray-100 rounded-xl focus:outline-none text-sm font-medium pr-12' }),
            e('button', { onClick: () => setShowPassword(!showPassword), className: 'absolute right-4 top-1/2 -translate-y-1/2 text-gray-400' }, e('ion-icon', { name: showPassword ? 'eye-off-outline' : 'eye-outline' }))
          ])
        ]),
        e('button', { onClick: handleAuthViewer, className: 'w-full bg-[#121212] text-white font-bold py-4 rounded-xl text-sm mt-4 shadow-sm' }, 'Sign In Account')
      ])
    );
  }

  // --- SCREEN 4: CREATOR SIGNUP (MATCHING image_5.png ENGINE) ---
  if (currentPage === 'signup_creator') {
    return e('div', { className: 'min-h-screen bg-white text-[#121212] max-w-md mx-auto flex flex-col p-6 shadow-md relative' }, [
      e('button', { onClick: () => navigateTo('choose_track'), className: 'flex items-center text-xs font-bold text-gray-400 mt-4 mb-6' }, 
        e('ion-icon', { name: 'arrow-back-outline', style: { marginRight: '4px' } }), 'BACK'
      ),
      e('h2', { className: 'text-2xl font-black tracking-tight mb-1' }, 'Setup Career Profile'),
      e('p', { className: 'text-xs text-gray-400 mb-6' }, 'Register verified access handles to active task payouts.'),
      errorMessage && e('div', { className: 'bg-red-50 text-red-600 text-xs font-semibold p-3.5 rounded-xl mb-4' }, errorMessage),
      
      e('div', { className: 'space-y-5 flex-1' }, [
        e('div', null, [
          e('label', { className: 'block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider' }, 'Full Legal Name'),
          e('input', { type: 'text', value: fullName, onChange: e => setFullName(e.target.value), placeholder: 'John Doe', className: 'w-full px-4 py-3.5 bg-[#F8F8FA] text-gray-800 rounded-xl focus:outline-none text-sm font-medium border border-transparent' })
        ]),
        e('div', null, [
          e('label', { className: 'block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider' }, 'Email Address'),
          e('input', { type: 'email', value: email, onChange: e => setEmail(e.target.value), placeholder: 'name@example.com', className: 'w-full px-4 py-3.5 bg-[#F8F8FA] text-gray-800 rounded-xl focus:outline-none text-sm font-medium border border-transparent' })
        ]),
        e('div', null, [
          e('label', { className: 'block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider' }, 'Password'),
          e('input', { type: 'password', value: password, onChange: e => setPassword(e.target.value), placeholder: 'Minimum 6 characters', className: 'w-full px-4 py-3.5 bg-[#F8F8FA] text-gray-800 rounded-xl focus:outline-none text-sm font-medium border border-transparent' })
        ]),
        e('div', { className: 'bg-[#F8F8FA] p-4 rounded-xl flex items-center justify-between text-xs mt-2' }, [
          e('div', null, [
            e('span', { className: 'font-bold block text-gray-900' }, 'One-Time Setup Fee'),
            e('span', { className: 'text-gray-400 font-medium' }, 'Includes dashboard deployment allocation')
          ]),
          e('span', { className: 'text-sm font-black text-[#121212]' }, '$25.00')
        ]),
        // Intercepts flow to launch the instruction box modal
        e('button', { onClick: triggerCreatorPaymentModal, className: 'w-full bg-[#121212] text-white font-bold py-4 rounded-xl text-sm shadow-sm active:scale-[0.99] transition-transform' }, 'Pay Fee & Deploy Profile')
      ]),

      // --- BITCOIN INSTRUCTION PAYMENT MODAL BOX ---
      isCreatorPaymentOpen && e('div', { className: 'fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 max-w-md mx-auto' }, [
        e('div', { className: 'bg-white w-full rounded-2xl p-6 shadow-xl space-y-4 border border-gray-100 text-center' }, [
          e('div', { className: 'w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto' }, 
            e('ion-icon', { name: 'logo-bitcoin', style: { fontSize: '28px' } })
          ]),
          e('div', null, [
            e('h3', { className: 'font-black text-lg text-gray-900' }, 'Bitcoin Deposit Required'),
            e('p', { className: 'text-xs text-gray-400 mt-1 px-2' }, 'Send exactly $25.00 worth of BTC to the official application network address below to activate your premium workspace.')
          ]),
          
          // Secure Bitcoin Wallet Box Setup
          e('div', { className: 'bg-[#F8F8FA] p-3.5 rounded-xl border border-gray-200/60 text-left' }, [
            e('span', { className: 'block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1' }, 'BTC Network Address'),
            e('div', { className: 'flex items-center justify-between' }, [
              e('span', { className: 'text-xs font-mono font-bold text-gray-800 block truncate pr-2 select-all' }, 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'),
              e('button', { onClick: () => alert('Address copied to clipboard!'), className: 'text-gray-400 active:text-gray-900' }, e('ion-icon', { name: 'copy-outline' }))
            ])
          ]),

          // Active Action Buttons
          e('div', { className: 'space-y-2 pt-2' }, [
            e('button', { 
              onClick: handleConfirmCreatorPayment, 
              className: 'w-full bg-emerald-500 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wide shadow-md shadow-emerald-500/10 active:scale-[0.98] transition-transform' 
            }, 'PAID'),
            e('button', { 
              onClick: () => setIsCreatorPaymentOpen(false), 
              className: 'w-full bg-transparent text-gray-400 font-bold py-2 rounded-xl text-xs active:text-gray-600' 
            }, 'Cancel Payment')
          ])
        ])
      ])
    ]);
  }

  // --- SCREEN 5: VIEWER SIGNUP (FREE BASE) ---
  if (currentPage === 'signup_viewer') {
    return e('div', { className: 'min-h-screen bg-white text-[#121212] max-w-md mx-auto flex flex-col p-6 shadow-md' },
      e('button', { onClick: () => navigateTo('choose_track'), className: 'flex items-center text-xs font-bold text-gray-400 mt-4 mb-6' }, 
        e('ion-icon', { name: 'arrow-back-outline', style: { marginRight: '4px' } }), 'BACK'
      ),
      e('h2', { className: 'text-2xl font-black tracking-tight mb-2' }, 'Setup Viewer Profile'),
      e('p', { className: 'text-xs text-gray-400 mb-4' }, 'Register a consumer wallet profile to access creator content catalogs.'),
      errorMessage && e('div', { className: 'bg-red-50 text-red-600 text-xs font-semibold p-3.5 rounded-xl mb-4' }, errorMessage),
      e('div', { className: 'space-y-4 flex-1' }, [
        e('div', null, [
          e('label', { className: 'block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider' }, 'Email Address'),
          e('input', { type: 'email', value: email, onChange: e => setEmail(e.target.value), placeholder: 'name@example.com', className: 'w-full px-4 py-3.5 bg-[#F8F8FA] border border-gray-100 rounded-xl focus:outline-none text-sm' })
        ]),
        e('div', null, [
          e('label', { className: 'block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider' }, 'Secure Password'),
          e('input', { type: 'password', value: password, onChange: e => setPassword(e.target.value), placeholder: 'Minimum 6 characters', className: 'w-full px-4 py-3.5 bg-[#F8F8FA] border border-gray-100 rounded-xl focus:outline-none text-sm' })
        ]),
        e('button', { onClick: handleAuthViewer, className: 'w-full bg-[#121212] text-white font-bold py-4 rounded-xl text-sm mt-4 shadow-sm' }, 'Create Free Account')
      ])
    );
  }

  // --- SCREEN 6A: SECURE CREATOR CAREER DASHBOARD TRACK ---
  if (userRole === 'creator') {
    return e('div', { className: 'min-h-screen bg-[#F8F8FA] text-[#121212] max-w-md mx-auto relative shadow-md' }, [
      
      // SIDEBAR GATEWAY SYSTEM
      isSidebarOpen && e('div', { className: 'fixed inset-0 bg-black/50 z-40 max-w-md mx-auto', onClick: () => setIsSidebarOpen(false) }),
      e('div', { className: `fixed top-0 left-0 bottom-0 w-72 bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} max-w-md flex flex-col justify-between p-5` }, [
        e('div', null, [
          e('div', { className: 'flex justify-between items-center border-b border-gray-100 pb-4 mb-4' }, [
            e('h2', { className: 'font-bold text-lg' }, 'Menu Options'),
            e('button', { onClick: () => setIsSidebarOpen(false) }, e('ion-icon', { name: 'close-outline', style: { fontSize: '24px' } }))
          ]),
          e('p', { className: 'text-xs text-gray-400 italic py-2' }, 'Platform configuration pipeline layouts.')
        ]),
        e('button', { onClick: handleLogout, className: 'w-full bg-[#121212] text-white py-3.5 font-bold rounded-xl text-xs flex items-center justify-center space-x-2' }, [
          e('ion-icon', { name: 'log-out-outline' }), e('span', null, 'Sign Out Account')
        ])
      ]),

      // HEADER BLOCK
      e('div', { className: 'relative bg-[#121212] text-white pt-12 pb-6 px-4 rounded-b-[24px]' }, [
        e('div', { className: 'flex justify-between items-center mb-4' }, [
          e('button', { onClick: () => setIsSidebarOpen(true) }, e('ion-icon', { name: 'menu-outline', style: { fontSize: '26px' } })),
          e('div', { className: 'flex items-center space-x-5' }, [
            e('button', null, e('ion-icon', { name: 'flag-outline', style: { fontSize: '22px' } })),
            e('button', null, e('ion-icon', { name: 'settings-outline', style: { fontSize: '22px' } }))
          ])
        ]),
        e('h1', { className: 'text-xs font-semibold text-gray-400 mb-1' }, 'Monetization Platform'),
        e('div', { className: 'flex items-center mb-1 font-bold' }, [
          e('span', { className: 'text-2xl mt-1 mr-0.5' }, '$'),
          e('span', { className: 'text-4xl' }, '0.00'),
          e('ion-icon', { name: 'chevron-forward-outline', style: { color: '#9ca3af', marginLeft: '4px', marginTop: '6px' } })
        ]),
        e('p', { className: 'text-[11px] text-gray-400 mb-4 flex items-center' }, ['Estimated rewards in last 7 days', e('ion-icon', { name: 'help-circle-outline', style: { marginLeft: '2px' } })]),
        e('div', { className: 'bg-white/10 rounded-xl px-4 py-3 flex justify-between items-center text-xs' }, [
          e('span', null, 'Balance: $0.00'), e('span', { className: 'text-gray-400' }, 'View')
        ])
      ]),

      // ANALYTICS & ACTIVE PROGRAM HUBS
      e('div', { className: 'p-4 space-y-4' }, [
        e('div', { className: 'bg-white rounded-2xl p-4 shadow-sm' }, [
          e('h2', { className: 'text-sm font-bold mb-3' }, 'Rewards analytics'),
          e('div', { className: 'bg-[#F8F8FA] rounded-xl p-4' }, [
            e('div', { className: 'text-2xl font-bold' }, '$0.00'),
            e('div', { className: 'text-xs text-gray-400' }, 'LIVE rewards')
          ])
        ]),

        e('div', { className: 'bg-white rounded-2xl p-4 shadow-sm' }, [
          e('h2', { className: 'text-sm font-bold mb-3' }, 'Active programs'),
          e('div', { className: 'flex space-x-5 overflow-x-auto pb-2 scrollbar-none' }, activeProgramsList.map(program => (
            e('div', { key: program.id, className: 'flex flex-col items-center min-w-[72px]' }, [
              e('div', { className: 'w-14 h-14 bg-[#F8F8FA] rounded-2xl flex items-center justify-center mb-1' }, 
                e('ion-icon', { name: program.icon, style: { fontSize: '22px', color: '#121212' } })
              ),
              e('span', { className: 'text-[11px] font-bold text-[#121212]' }, program.title)
            ])
          )))
        ]),

        e('div', { className: 'bg-white rounded-2xl p-4 shadow-sm' }, [
          e('h2', { className: 'text-sm font-bold mb-2' }, 'Programs for you'),
          ['Work with Artists', 'Video Gifts', 'Subscription'].map((item, index) => (
            e('div', { key: index, className: 'flex items-center justify-between py-3 border-b border-gray-50 text-xs' }, [
              e('span', { className: 'font-bold' }, item), e('span', { className: 'bg-gray-100 text-gray-500 font-bold px-2 py-0.5 rounded' }, '🔒 Lock')
            ])
          ))
        ])
      ])
    ]);
  }

  // --- SCREEN 6B: GENERAL VIEWER TRACK ---
  if (userRole === 'viewer') {
    return e('div', { className: 'min-h-screen bg-[#F8F8FA] text-[#121212] max-w-md mx-auto relative shadow-md flex flex-col justify-between' }, [
      
      e('div', { className: 'bg-[#121212] text-white pt-12 pb-4 px-4 rounded-b-[20px] flex justify-between items-center shadow-md' }, [
        e('div', { className: 'flex items-center space-x-2' }, [
          e('div', { className: 'w-8 h-8 bg-white text-[#121212] rounded-lg flex items-center justify-center' }, e('ion-icon', { name: 'wallet' })),
          e('div', null, [
            e('div', { className: 'text-[10px] uppercase font-bold text-gray-400' }, 'Fatcoin Balance'),
            e('div', { className: 'text-sm font-black tracking-wide' }, `${fatcoinBalance} FC`)
          ])
        ]),
        e('button', { 
          onClick: () => { setErrorMessage(''); setIsTopUpOpen(true); },
          className: 'bg-white text-[#121212] font-black text-xs px-3 py-2 rounded-xl flex items-center space-x-1 active:scale-95 transition-all'
        }, [e('ion-icon', { name: 'logo-bitcoin' }), e('span', null, 'Buy Fatcoins')])
      ]),

      errorMessage && e('div', { className: 'mx-4 mt-3 bg-red-50 text-red-600 text-xs font-bold p-3 rounded-xl border border-red-100' }, errorMessage),

      e('div', { className: 'flex-1 p-4 overflow-y-auto' }, [
        activeTab === 'feed' && e('div', { className: 'space-y-4' }, sampleCreators.map(creator => {
          const isUnlocked = unlockedCreators.includes(creator.id);
          const isSubbed = subscribedCreators.includes(creator.id);

          return e('div', { key: creator.id, className: 'bg-white rounded-2xl p-4 shadow-sm border border-gray-50' }, [
            e('div', { className: 'flex justify-between items-start mb-3' }, [
              e('div', null, [
                e('h3', { className: 'font-black text-sm tracking-tight text-gray-900' }, creator.name),
                e('span', { className: 'text-[11px] font-bold text-gray-400 uppercase tracking-wider block' }, creator.skill)
              ]),
              e('button', { 
                onClick: () => toggleSubscribe(creator.id),
                className: `text-xs font-black px-3 py-1.5 rounded-xl border transition-all ${isSubbed ? 'bg-transparent text-gray-400 border-gray-200' : 'bg-[#121212] text-white border-[#121212]'}`
              }, isSubbed ? 'Subscribed' : 'Subscribe (30 FC)')
            ]),

            !isUnlocked ? e('div', { 
              onClick: () => unlockCreatorProfile(creator.id),
              className: 'bg-[#F8F8FA] border border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:bg-gray-100 transition-colors my-2'
            }, [
              e('ion-icon', { name: 'lock-closed', style: { fontSize: '20px', color: '#121212', marginBottom: '4px' } }),
              e('span', { className: 'block text-xs font-bold' }, 'Unlock Premium Creator Profile & Media'),
              e('span', { className: 'block text-[10px] text-gray-400 mt-0.5' }, 'Requires single structural base payment of 30 Fatcoins')
            ]) : e('div', { className: 'space-y-3 mt-2' }, [
              e('p', { className: 'text-xs text-gray-500 italic bg-gray-50 p-2.5 rounded-lg border border-gray-100' }, `"${creator.bio}"`),
              e('p', { className: 'text-xs text-gray-800 leading-relaxed font-medium' }, creator.post),
              
              e('div', { className: 'bg-[#121212] text-white p-3 rounded-xl flex justify-between items-center text-xs mt-2 shadow-inner' }, [
                e('div', null, [
                  e('span', { className: 'font-bold block text-white' }, 'Negotiate Service Rights & Skills'),
                  e('span', { className: 'text-[9px] text-gray-400 font-medium' }, 'Acquire exclusive commercial ownership rights')
                ]),
                e('button', { 
                  onClick: () => {
                    if (fatcoinBalance < 100) { setErrorMessage('Rights configuration negotiations require a minimum deposit reserve of 100 Fatcoins.'); return; }
                    setFatcoinBalance(prev => prev - 100);
                    alert('Premium escrow system locked. Transactions broadcasted securely over network.');
                  },
                  className: 'bg-white text-[#121212] font-black text-[10px] px-2.5 py-1.5 rounded-lg active:bg-gray-100'
                }, 'Buy Rights (100 FC)')
              ]),

              e('div', { className: 'flex justify-between items-center border-t border-gray-100 pt-3 mt-2 text-gray-400' }, [
                e('button', { className: 'flex items-center space-x-1 text-xs hover:text-[#121212]' }, [e('ion-icon', { name: 'heart-outline' }), e('span', null, 'Like')]),
                e('button', { className: 'flex items-center space-x-1 text-xs hover:text-[#121212]' }, [e('ion-icon', { name: 'repeat-outline' }), e('span', null, 'Repost')]),
                e('button', { className: 'flex items-center space-x-1 text-xs hover:text-[#121212]' }, [e('ion-icon', { name: 'share-outline' }), e('span', null, 'Share')]),
                e('button', { 
                  onClick: () => {
                    if (fatcoinBalance < 30) { setErrorMessage('Insufficient wallet balance to allocate asset tips.'); return; }
                    setFatcoinBalance(prev => prev - 30);
                    alert('Sent 30 Fatcoin Gift to creator sound registry.');
                  },
                  className: 'flex items-center space-x-0.5 text-xs font-bold text-[#121212]' 
                }, [e('ion-icon', { name: 'gift-outline' }), e('span', null, 'Gift (30 FC)')])
              ])
            ])
          ]);
        }))
      ]),

      // --- FATCOIN TOPUP EXCHANGE MODAL ---
      isTopUpOpen && e('div', { className: 'fixed inset-0 bg-black/60 z-50 flex items-end justify-center p-4 max-w-md mx-auto' }, [
        e('div', { className: 'bg-white w-full rounded-t-3xl p-6 space-y-4' }, [
          e('div', { className: 'flex justify-between items-center border-b border-gray-100 pb-3' }, [
            e('div', null, [
              e('h3', { className: 'font-black text-base' }, 'Fatcoin Wallet Token Exchange'),
              e('p', { className: 'text-[10px] text-gray-400 mt-0.5' }, 'Purchase currency spent on app features using Bitcoin (BTC)')
            ]),
            e('button', { onClick: () => setIsTopUpOpen(false), className: 'text-gray-400' }, e('ion-icon', { name: 'close-circle', style: { fontSize: '24px' } }))
          ]),
          
          e('div', { className: 'space-y-2.5' }, [
            { coins: 120, cost: 23 },
            { coins: 300, cost: 85 },
            { coins: 1000, cost: 135 }
          ].map((tier, idx) => (
            e('div', { 
              key: idx, onClick: () => purchaseFatcoins(tier.coins, tier.cost),
              className: 'bg-[#F8F8FA] border border-gray-100 p-4 rounded-xl flex justify-between items-center cursor-pointer hover:border-[#121212] transition-colors'
            }, [
              e('div', { className: 'flex items-center space-x-3' }, [
                e('ion-icon', { name: 'ticket-outline', style: { color: '#121212', fontSize: '20px' } }),
                e('span', { className: 'font-black text-sm' }, `${tier.coins} Fatcoins`)
              ]),
              e('span', { className: 'bg-[#121212] text-white text-xs font-black px-3 py-1.5 rounded-lg' }, `$${tier.cost} BTC`)
            ])
          )))
        ])
      ]),

      // BOTTOM NAVIGATION TAB BAR
      e('div', { className: 'bg-white border-t border-gray-100 py-3 px-8 flex justify-around items-center' }, [
        e('button', { onClick: () => setActiveTab('feed'), className: `flex flex-col items-center space-y-0.5 ${activeTab === 'feed' ? 'text-[#121212]' : 'text-gray-300'}` }, [
          e('ion-icon', { name: 'apps', style: { fontSize: '20px' } }), e('span', { className: 'text-[10px] font-bold' }, 'Explore')
        ]),
        e('button', { onClick: handleLogout, className: 'flex flex-col items-center space-y-0.5 text-gray-300 hover:text-red-500' }, [
          e('ion-icon', { name: 'log-out-outline', style: { fontSize: '20px' } }), e('span', { className: 'text-[10px] font-bold' }, 'Log Out')
        ])
      ])
    ]);
  }
}

const root = window.ReactDOM.createRoot(document.getElementById('root'));
root.render(e(App));
