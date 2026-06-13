// Grab React elements directly from the mobile window context
const { useState, useEffect } = window.React;
const e = window.React.createElement;

function App() {
  // --- 1. CORE SYSTEM STATES ---
  const [currentPage, setCurrentPage] = useState(() => localStorage.getItem('fatsocial_page') || 'landing');
  const [userRole, setUserRole] = useState(() => localStorage.getItem('fatsocial_role') || '');
  const [fatcoinBalance, setFatcoinBalance] = useState(() => parseInt(localStorage.getItem('fatsocial_coins')) || 0);
  
  // Registration and Authentication Form Fields State Cache
  const [fullName, setFullName] = useState(() => localStorage.getItem('fatsocial_cache_name') || '');
  const [email, setEmail] = useState(() => localStorage.getItem('fatsocial_cache_email') || '');
  const [password, setPassword] = useState(() => localStorage.getItem('fatsocial_cache_pass') || '');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Gatekeeping Control and Administrative State Routing
  const [paymentStatus, setPaymentStatus] = useState(() => localStorage.getItem('fatsocial_pay_status') || 'idle'); 
  const [isAdminViewOpen, setIsAdminViewOpen] = useState(false);

  // Feature Drill-Down Interaction Modals States
  const [activeFeatureModal, setActiveFeatureModal] = useState(null); // 'projects', 'gifts', 'subs'
  const [taskStatuses, setTaskStatuses] = useState(() => JSON.parse(localStorage.getItem('fatsocial_task_states')) || { task1: 'open', task2: 'open' });

  // Sync state cleanly with LocalStorage on update
  useEffect(() => {
    localStorage.setItem('fatsocial_page', currentPage);
    localStorage.setItem('fatsocial_role', userRole);
    localStorage.setItem('fatsocial_coins', fatcoinBalance);
    localStorage.setItem('fatsocial_pay_status', paymentStatus);
    localStorage.setItem('fatsocial_cache_name', fullName);
    localStorage.setItem('fatsocial_cache_email', email);
    localStorage.setItem('fatsocial_cache_pass', password);
    localStorage.setItem('fatsocial_task_states', JSON.stringify(taskStatuses));
  }, [currentPage, userRole, fatcoinBalance, paymentStatus, fullName, email, password, taskStatuses]);

  // Admin Approval Polling Loop
  useEffect(() => {
    let checkInterval = null;
    if (paymentStatus === 'verifying') {
      checkInterval = setInterval(() => {
        const adminApprovalFlag = localStorage.getItem('fatsocial_admin_approved_trigger');
        if (adminApprovalFlag === 'true') {
          clearInterval(checkInterval);
          localStorage.removeItem('fatsocial_admin_approved_trigger');
          setPaymentStatus('idle');
          setUserRole('creator');
          alert(`Verification Complete!\nAn automated validation confirmation link has been sent to your registered email address (${email || 'provided address'}). Access granted.`);
          setCurrentPage('dashboard');
        }
      }, 1500);
    }
    return () => { if (checkInterval) clearInterval(checkInterval); };
  }, [paymentStatus, email]);

  const handleLogout = () => {
    setUserRole('');
    setFatcoinBalance(0);
    setFullName('');
    setEmail('');
    setPassword('');
    setPaymentStatus('idle');
    setActiveFeatureModal(null);
    localStorage.removeItem('fatsocial_admin_approved_trigger');
    setCurrentPage('landing');
  };

  const submitMockTaskProof = (taskId) => {
    setTaskStatuses(prev => ({ ...prev, [taskId]: 'verifying' }));
    alert("Proof snapshot uploaded successfully! Project verification engine auditing submission.");
  };

  // --- 2. FLOATING ADMINISTRATIVE OVERLAY PANEL ---
  const renderInlineAdminController = () => {
    const hasPendingUser = paymentStatus === 'verifying' && fullName && email;
    return e('div', { className: 'fixed bottom-4 left-1/2 -translate-x-1/2 bg-[#1A1A1E] border border-red-500 text-white text-xs p-4 rounded-2xl shadow-2xl z-[9999] w-[90%] max-w-xs space-y-3' }, [
      e('div', { className: 'flex justify-between items-center border-b border-gray-800 pb-1.5' }, [
        e('span', { className: 'font-black text-red-400 uppercase text-[10px] tracking-wider' }, '🛠️ System Admin Control'),
        e('button', { onClick: () => setIsAdminViewOpen(false), className: 'text-gray-500 font-bold px-1' }, '✕')
      ]),
      hasPendingUser ? 
        e('div', { className: 'space-y-2' }, [
          e('div', { className: 'bg-[#121214] p-2.5 rounded-xl text-[11px] font-mono border border-gray-800 space-y-1' }, [
            e('p', { className: 'text-gray-500 text-[9px] uppercase font-bold' }, 'Pending Creator Profile:'),
            e('p', null, `USER: ${fullName}`),
            e('p', { className: 'text-blue-400' }, `MAIL: ${email}`),
            e('p', { className: 'text-emerald-400' }, `SETUP: $25.00 PAID`)
          ]),
          e('button', { 
            onClick: () => localStorage.setItem('fatsocial_admin_approved_trigger', 'true'),
            className: 'w-full bg-emerald-500 text-black font-black py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all active:scale-95'
          }, 'Approve Profile Entry')
        ]) : 
        e('p', { className: 'text-gray-500 text-center py-4 italic text-[10px]' }, 'No accounts currently waiting for payment verification.')
    ]);
  };

  const renderAdminToggleButton = () => (
    e('button', { onClick: () => setIsAdminViewOpen(!isAdminViewOpen), className: 'fixed top-2 right-2 opacity-5 bg-transparent text-white text-[10px] z-[9999] px-2 py-1' }, '• admin console')
  );

  // --- 3. PLATFORM GATE INTERFACES RENDERERS ---

  if (paymentStatus === 'verifying') {
    return e('div', { className: 'min-h-screen bg-[#121214] text-white max-w-md mx-auto flex flex-col items-center justify-center p-6 text-center space-y-6 shadow-xl relative font-sans' }, [
      renderAdminToggleButton(),
      isAdminViewOpen && renderInlineAdminController(),
      e('div', { className: 'w-10 h-10 border-3 border-gray-800 border-t-emerald-500 rounded-full animate-spin' }),
      e('div', { className: 'space-y-2' }, [
        e('h3', { className: 'font-black text-xl tracking-tight' }, 'Awaiting Verification'),
        e('p', { className: 'text-xs text-gray-400 px-6 leading-relaxed font-medium' }, 'Please hold on while our automated administration system audits and verifies your setup fee submission.')
      ])
    ]);
  }

  if (currentPage === 'landing') {
    return e('div', { className: 'min-h-screen bg-[#121214] text-white max-w-md mx-auto flex flex-col justify-between p-6 shadow-xl relative font-sans' }, [
      renderAdminToggleButton(),
      isAdminViewOpen && renderInlineAdminController(),
      e('div', { className: 'flex-1 flex flex-col justify-center items-center text-center space-y-4' }, [
        e('div', { className: 'w-14 h-14 bg-emerald-500 text-black rounded-2xl flex items-center justify-center shadow-lg font-black text-2xl tracking-tighter' }, 'FS'),
        e('h1', { className: 'text-3xl font-black tracking-tight text-white' }, 'FATSOCIAL'),
        e('p', { className: 'text-xs text-gray-400 max-w-xs leading-relaxed font-medium' }, 'Connect directly with premium elite skills marketplaces.')
      ]),
      e('div', { className: 'space-y-3 pb-4' }, [
        e('button', { onClick: () => setCurrentPage('choose_track'), className: 'w-full bg-white text-black font-black py-4 rounded-xl text-sm transition-all active:scale-[0.98]' }, 'Create Account'),
        e('button', { onClick: () => setCurrentPage('signin'), className: 'w-full bg-transparent border border-gray-800 font-bold py-4 rounded-xl text-sm text-white transition-all active:scale-[0.98]' }, 'Sign In Account')
      ])
    ]);
  }

  if (currentPage === 'choose_track') {
    return e('div', { className: 'min-h-screen bg-[#121214] text-white max-w-md mx-auto flex flex-col p-6 shadow-xl relative font-sans' }, [
      renderAdminToggleButton(),
      isAdminViewOpen && renderInlineAdminController(),
      e('button', { onClick: () => setCurrentPage('landing'), className: 'flex items-center text-xs font-bold text-gray-500 mt-2 mb-6 uppercase tracking-wider' }, '← Back'),
      e('h2', { className: 'text-2xl font-black tracking-tight mb-1' }, 'Choose Account Type'),
      e('p', { className: 'text-xs text-gray-400 mb-6 font-medium' }, 'Select the customized interface suited for your platform profile.'),
      e('div', { className: 'space-y-4 flex-1' }, [
        e('div', { onClick: () => setCurrentPage('signup_creator'), className: 'border-2 border-emerald-500/30 p-5 rounded-2xl cursor-pointer bg-[#1A1A1E]' }, [
          e('div', { className: 'flex items-center space-x-2.5 mb-2' }, [
            e('span', { className: 'text-lg' }, '🏆'),
            e('h3', { className: 'font-black text-base text-white' }, 'Content Creator Career')
          ]),
          e('p', { className: 'text-xs text-gray-400 font-medium leading-relaxed' }, 'Access analytics dashboards, earn system payouts via tasks, design premium subscriptions, and monetize tools.')
        ]),
        e('div', { onClick: () => setCurrentPage('signup_viewer'), className: 'border border-gray-800 p-5 rounded-2xl cursor-pointer bg-[#1A1A1E] opacity-60' }, [
          e('div', { className: 'flex items-center space-x-2.5 mb-2' }, [
            e('span', { className: 'text-lg' }, '👁️'),
            e('h3', { className: 'font-black text-base text-white' }, 'General Consumer / Viewer')
          ]),
          e('p', { className: 'text-xs text-gray-400 font-medium leading-relaxed' }, 'Discover professional skills showcase pools, follow creators, and manage gift balances using system tokens.')
        ])
      ])
    ]);
  }

  if (currentPage === 'signin') {
    return e('div', { className: 'min-h-screen bg-[#121214] text-white max-w-md mx-auto flex flex-col p-6 shadow-xl relative font-sans' }, [
      renderAdminToggleButton(),
      isAdminViewOpen && renderInlineAdminController(),
      e('button', { onClick: () => setCurrentPage('landing'), className: 'flex items-center text-xs font-bold text-gray-500 mt-2 mb-6 uppercase tracking-wider' }, '← Back'),
      e('h2', { className: 'text-2xl font-black tracking-tight mb-6' }, 'Welcome Back'),
      e('div', { className: 'space-y-4 flex-1' }, [
        e('div', null, [
          e('label', { className: 'block text-[10px] font-black text-gray-500 uppercase mb-2 tracking-wider' }, 'EMAIL ADDRESS'),
          e('input', { type: 'email', value: email, onChange: e => setEmail(e.target.value), placeholder: 'name@example.com', className: 'w-full px-4 py-3.5 bg-[#1A1A1E] border border-gray-800 rounded-xl text-sm font-medium text-white focus:outline-none' })
        ]),
        e('div', null, [
          e('label', { className: 'block text-[10px] font-black text-gray-500 uppercase mb-2 tracking-wider' }, 'PASSWORD'),
          e('input', { type: 'password', value: password, onChange: e => setPassword(e.target.value), placeholder: '••••••••', className: 'w-full px-4 py-3.5 bg-[#1A1A1E] border border-gray-800 rounded-xl text-sm font-medium text-white focus:outline-none' })
        ]),
        e('button', { onClick: () => { setUserRole('creator'); setCurrentPage('dashboard'); }, className: 'w-full bg-emerald-500 text-black font-black py-4 rounded-xl text-sm tracking-wide mt-4' }, 'Sign In Account')
      ])
    ]);
  }

  if (currentPage === 'signup_creator') {
    return e('div', { className: 'min-h-screen bg-[#121214] text-white max-w-md mx-auto flex flex-col p-6 shadow-xl relative font-sans' }, [
      renderAdminToggleButton(),
      isAdminViewOpen && renderInlineAdminController(),
      e('button', { onClick: () => setCurrentPage('choose_track'), className: 'flex items-center text-xs font-bold text-gray-500 mt-2 mb-6 uppercase tracking-wider' }, '← Back'),
      e('h2', { className: 'text-2xl font-black tracking-tight mb-1' }, 'Create Creator Profile'),
      e('p', { className: 'text-xs text-gray-400 mb-6 font-medium' }, 'Register below to access active tasks and payouts.'),
      errorMessage && e('div', { className: 'bg-red-950/40 border border-red-900 text-red-400 text-xs font-semibold p-3 rounded-xl mb-4' }, errorMessage),
      
      e('div', { className: 'space-y-4 flex-1' }, [
        e('div', null, [
          e('label', { className: 'block text-[10px] font-black text-gray-500 uppercase mb-2 tracking-wider' }, 'FULL LEGAL NAME'),
          e('input', { type: 'text', value: fullName, onChange: e => setFullName(e.target.value), placeholder: 'William Hudson', className: 'w-full px-4 py-3.5 bg-[#1A1A1E] border border-gray-800 rounded-xl text-sm font-medium text-white focus:outline-none' })
        ]),
        e('div', null, [
          e('label', { className: 'block text-[10px] font-black text-gray-500 uppercase mb-2 tracking-wider' }, 'EMAIL ADDRESS'),
          e('input', { type: 'email', value: email, onChange: e => setEmail(e.target.value), placeholder: 'william@example.com', className: 'w-full px-4 py-3.5 bg-[#1A1A1E] border border-gray-800 rounded-xl text-sm font-medium text-white focus:outline-none' })
        ]),
        e('div', null, [
          e('label', { className: 'block text-[10px] font-black text-gray-500 uppercase mb-2 tracking-wider' }, 'PASSWORD'),
          e('input', { type: 'password', value: password, onChange: e => setPassword(e.target.value), placeholder: '••••••••', className: 'w-full px-4 py-3.5 bg-[#1A1A1E] border border-gray-800 rounded-xl text-sm font-medium text-white focus:outline-none' })
        ]),
        e('div', { className: 'bg-[#1A1A1E] border border-gray-800 p-4 rounded-xl flex items-center justify-between text-xs mt-2' }, [
          e('div', { className: 'flex flex-col space-y-0.5' }, [
            e('span', { className: 'font-bold text-white text-sm' }, 'One-Time Setup Fee'),
            e('span', { className: 'text-gray-500 font-medium text-[11px]' }, 'Unlocks global task interaction matrix')
          ]),
          e('span', { className: 'text-base font-black text-emerald-400' }, '$25.00')
        ]),
        e('button', { onClick: () => { if(!fullName || !email || !password){ setErrorMessage('Please fulfill all criteria inputs.'); return;} setCurrentPage('payment_creator'); }, className: 'w-full bg-emerald-500 text-black font-black py-4 rounded-xl text-sm active:scale-95 transition-transform mt-2' }, 'Pay Fee & Complete Setup')
      ])
    ]);
  }

  if (currentPage === 'payment_creator') {
    return e('div', { className: 'min-h-screen bg-[#121214] text-white max-w-md mx-auto flex flex-col p-6 shadow-xl relative font-sans' }, [
      renderAdminToggleButton(),
      isAdminViewOpen && renderInlineAdminController(),
      e('button', { onClick: () => setCurrentPage('signup_creator'), className: 'flex items-center text-xs font-bold text-gray-500 mt-2 mb-6 uppercase tracking-wider' }, '← Back'),
      e('h2', { className: 'text-2xl font-black tracking-tight mb-6' }, 'Complete Setup Fee'),
      
      e('div', { className: 'bg-[#1A1A1E] border border-gray-800 rounded-2xl p-5 space-y-4 flex-1' }, [
        e('div', { className: 'text-xs uppercase font-black text-gray-500 tracking-wider' }, 'Official Bitcoin Node Destination'),
        e('div', { className: 'font-mono text-xs font-bold break-all bg-[#121214] p-3 border border-gray-800 rounded-xl select-all text-emerald-400' }, 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'),
        e('p', { className: 'text-[11px] text-gray-400 leading-relaxed' }, 'Copy address above and transfer exactly $25.00 worth of BTC from your wallet application. Verification executes post network broadcast confirmation.')
      ]),
      e('div', { className: 'space-y-2 pt-4' }, [
        e('button', { onClick: () => setPaymentStatus('verifying'), className: 'w-full bg-emerald-500 text-black font-black py-4 rounded-xl text-sm uppercase tracking-wider' }, 'I Have Paid'),
        e('button', { onClick: () => setCurrentPage('signup_creator'), className: 'w-full bg-transparent text-gray-500 font-bold py-2 rounded-xl text-xs text-center' }, 'Cancel Settlement')
      ])
    ]);
  }

  // --- 4. THE PREMIUM DARK CREATOR DASHBOARD RENDERER ---
  if (currentPage === 'dashboard' && userRole === 'creator') {
    return e('div', { className: 'min-h-screen bg-[#0D0D11] text-white max-w-md mx-auto relative shadow-xl p-5 flex flex-col font-sans space-y-5' }, [
      renderAdminToggleButton(),
      isAdminViewOpen && renderInlineAdminController(),

      // Top Creator Profile Header Module Block
      e('div', { className: 'flex justify-between items-center bg-[#16161C] p-4 rounded-2xl border border-gray-900 shadow-sm' }, [
        e('div', { className: 'flex items-center space-x-3' }, [
          e('div', { className: 'w-11 h-11 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full flex items-center justify-center font-black text-black text-sm' }, fullName ? fullName.charAt(0).toUpperCase() : 'C'),
          e('div', null, [
            e('h2', { className: 'font-black text-sm tracking-tight text-white' }, fullName || 'William Hudson'),
            e('span', { className: 'inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider' }, '● Verified Creator')
          ])
        ]),
        e('button', { onClick: handleLogout, className: 'text-gray-500 hover:text-white transition-colors font-bold text-xs uppercase tracking-wider px-2 py-1' }, 'Exit')
      ]),

      // Financial Metrics Matrix Panel Container
      e('div', { className: 'grid grid-cols-2 gap-3' }, [
        e('div', { className: 'bg-[#16161C] p-4 rounded-2xl border border-gray-900' }, [
          e('span', { className: 'text-[10px] text-gray-500 font-bold uppercase tracking-wider block' }, 'FATCOIN REWARDS'),
          e('span', { className: 'text-2xl font-black text-white block mt-1 tracking-tight' }, '0.00'),
          e('span', { className: 'text-[9px] text-gray-600 block mt-0.5' }, '0 Fatcoins Total')
        ]),
        e('div', { className: 'bg-[#16161C] p-4 rounded-2xl border border-gray-900' }, [
          e('span', { className: 'text-[10px] text-gray-500 font-bold uppercase tracking-wider block' }, 'TOTAL PAYOUTS'),
          e('span', { className: 'text-2xl font-black text-emerald-400 block mt-1 tracking-tight' }, '$0.00'),
          e('span', { className: 'text-[9px] text-gray-600 block mt-0.5' }, 'Settled to local engine')
        ])
      ]),

      e('h3', { className: 'text-xs font-black text-gray-500 uppercase tracking-widest pt-2 pl-1' }, 'Active Platform Features'),

      // THE UPDATED FEATURES LIST WRAPPER CONTAINER
      e('div', { className: 'space-y-3 flex-1 overflow-y-auto' }, [
        
        // 1. Daily Creator Projects Card
        e('div', { 
          onClick: () => setActiveFeatureModal('projects'),
          className: 'bg-[#16161C] border border-gray-900 rounded-2xl p-4 cursor-pointer hover:border-emerald-500/20 transition-all space-y-1.5' 
        }, [
          e('div', { className: 'flex justify-between items-center' }, [
            e('h4', { className: 'font-black text-sm text-white tracking-tight' }, '•• Daily Creator Projects'),
            e('span', { className: 'text-[10px] font-mono text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10' }, 'Tasks Active')
          ]),
          e('p', { className: 'text-xs text-gray-400 leading-relaxed font-medium' }, 'Earn daily Fatcoins creating contents by engaging in the daily set out sponsored tasks.')
        ]),

        // 2. Video Gifts Card
        e('div', { 
          onClick: () => setActiveFeatureModal('gifts'),
          className: 'bg-[#16161C] border border-gray-900 rounded-2xl p-4 cursor-pointer hover:border-emerald-500/20 transition-all space-y-1.5' 
        }, [
          e('div', { className: 'flex justify-between items-center' }, [
            e('h4', { className: 'font-black text-sm text-white tracking-tight' }, '•• Video Gifts'),
            e('span', { className: 'text-[10px] font-mono text-gray-500 bg-gray-800 px-2 py-0.5 rounded' }, 'Live Analytics')
          ]),
          e('p', { className: 'text-xs text-gray-400 leading-relaxed font-medium' }, 'Get Gifts for your top-performing videos.')
        ]),

        // 3. Subs Card
        e('div', { 
          onClick: () => setActiveFeatureModal('subs'),
          className: 'bg-[#16161C] border border-gray-900 rounded-2xl p-4 cursor-pointer hover:border-emerald-500/20 transition-all space-y-1.5' 
        }, [
          e('div', { className: 'flex justify-between items-center' }, [
            e('h4', { className: 'font-black text-sm text-white tracking-tight' }, '•• Subs'),
            e('span', { className: 'text-[10px] font-mono text-blue-400 bg-blue-500/5 px-2 py-0.5 rounded border border-blue-500/10' }, 'Premium Gate')
          ]),
          e('p', { className: 'text-xs text-gray-400 leading-relaxed font-medium' }, 'Connect more closely with viewers through subscriber-only content and benefits.')
        ])

      ]),

      // --- DYNAMIC SLIDE PERKS DRAWER SHEET INTERACTION INJECTIONS ---
      activeFeatureModal && e('div', { className: 'fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center p-4' }, [
        e('div', { className: 'bg-[#16161C] w-full rounded-t-3xl p-5 space-y-4 max-w-md border-t border-gray-800' }, [
          
          // Header of open feature module
          e('div', { className: 'flex justify-between items-center border-b border-gray-800 pb-3' }, [
            e('h3', { className: 'font-black text-base text-white uppercase tracking-tight' }, 
              activeFeatureModal === 'projects' ? '🏆 Daily Creator Tasks' : 
              activeFeatureModal === 'gifts' ? '🎁 Video Gifts Vault' : '🔒 Subs Configuration'
            ),
            e('button', { onClick: () => setActiveFeatureModal(null), className: 'text-gray-500 hover:text-white text-sm font-bold bg-[#1E1E24] px-3 py-1 rounded-xl' }, 'Close')
          ]),

          // Sub View 1: Projects Engine List
          activeFeatureModal === 'projects' && e('div', { className: 'space-y-3' }, [
            e('div', { className: 'bg-[#0D0D11] border border-gray-900 p-3.5 rounded-xl space-y-2' }, [
              e('div', { className: 'flex justify-between items-center' }, [
                e('span', { className: 'font-black text-xs' }, 'Campaign #1: TikTok Sound Push'),
                e('span', { className: 'text-[11px] font-black text-emerald-400' }, '+45 Fatcoins')
              ]),
              e('p', { className: 'text-[11px] text-gray-400' }, 'Post a new video using the set out active sponsor background audio link.'),
              taskStatuses.task1 === 'open' ? 
                e('button', { onClick: () => submitMockTaskProof('task1'), className: 'w-full bg-[#1E1E24] text-white border border-gray-800 font-bold py-2 rounded-lg text-xs' }, 'Submit Proof Screenshot') :
                e('span', { className: 'block text-center text-[10px] bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 font-bold py-2 rounded-lg uppercase tracking-wider' }, '🕒 Audit Verification Ongoing')
            ]),
            e('div', { className: 'bg-[#0D0D11] border border-gray-900 p-3.5 rounded-xl space-y-2' }, [
              e('div', { className: 'flex justify-between items-center' }, [
                e('span', { className: 'font-black text-xs' }, 'Campaign #2: Status Banner Sync'),
                e('span', { className: 'text-[11px] font-black text-emerald-400' }, '+20 Fatcoins')
              ]),
              e('p', { className: 'text-[11px] text-gray-400' }, 'Share platform registration graphics links to your active chat timeline metrics.'),
              taskStatuses.task2 === 'open' ? 
                e('button', { onClick: () => submitMockTaskProof('task2'), className: 'w-full bg-[#1E1E24] text-white border border-gray-800 font-bold py-2 rounded-lg text-xs' }, 'Submit Proof Screenshot') :
                e('span', { className: 'block text-center text-[10px] bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 font-bold py-2 rounded-lg uppercase tracking-wider' }, '🕒 Audit Verification Ongoing')
            ])
          ]),

          // Sub View 2: Video Gifts Vault Overview
          activeFeatureModal === 'gifts' && e('div', { className: 'space-y-4 text-center py-4' }, [
            e('div', { className: 'grid grid-cols-3 gap-2' }, [
              e('div', { className: 'bg-[#0D0D11] p-3 rounded-xl border border-gray-900' }, [e('div', { className: 'text-lg' }, '💎'), e('div', { className: 'font-black text-xs mt-1' }, '0'), e('div', { className: 'text-[9px] text-gray-600' }, 'Diamonds')]),
              e('div', { className: 'bg-[#0D0D11] p-3 rounded-xl border border-gray-900' }, [e('div', { className: 'text-lg' }, '🎤'), e('div', { className: 'font-black text-xs mt-1' }, '0'), e('div', { className: 'text-[9px] text-gray-600' }, 'Mics')]),
              e('div', { className: 'bg-[#0D0D11] p-3 rounded-xl border border-gray-900' }, [e('div', { className: 'text-lg' }, '🚀'), e('div', { className: 'font-black text-xs mt-1' }, '0'), e('div', { className: 'text-[9px] text-gray-600' }, 'Rockets')])
            ]),
            e('p', { className: 'text-xs text-gray-500 leading-relaxed italic' }, 'Gifts dispatched from viewer timeline interactions automatically credit your core monetization matrix ledger below in native exchange values.')
          ]),

          // Sub View 3: Subs Gate Pricing Configuration Controls
          activeFeatureModal === 'subs' && e('div', { className: 'space-y-3' }, [
            e('div', null, [
              e('label', { className: 'block text-[9px] font-black text-gray-500 uppercase mb-1.5 tracking-wider' }, 'MONTHLY ACCESS PACK FEE'),
              e('div', { className: 'flex space-x-2' }, [
                e('input', { type: 'text', readOnly: true, value: '30 Fatcoins', className: 'w-full px-3 py-2 bg-[#0D0D11] border border-gray-800 rounded-lg text-xs font-bold text-emerald-400 focus:outline-none' }),
                e('button', { onClick: () => alert("System lock constraint active: Tier pricing defaults configured for active cycles."), className: 'bg-emerald-500 text-black text-xs font-black px-4 rounded-lg' }, 'Modify')
              ])
            ]),
            e('div', { className: 'bg-[#0D0D11] p-3 rounded-xl border border-gray-900 text-[11px] text-gray-400 space-y-1' }, [
              e('p', { className: 'font-black text-white text-xs mb-1' }, 'Active Tier Status Perks:'),
              e('p', null, '✔ Exclusive direct messaging gateway rights unlocked.'),
              e('p', null, '✔ Subscriber reward multiplier metrics amplified.')
            ])
          ])

        ])
      ])

    ]);
  }

  return e('div', { className: 'p-6 text-center text-xs text-gray-500' }, 'Initializing standard security runtime modules...');
}

const root = window.ReactDOM.createRoot(document.getElementById('root'));
root.render(e(App));
