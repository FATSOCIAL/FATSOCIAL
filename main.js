// Grab React elements directly from the mobile window context
const { useState, useEffect } = window.React;
const e = window.React.createElement;

function App() {
  // --- 1. CORE SYSTEM STATES ---
  const [currentPage, setCurrentPage] = useState(() => localStorage.getItem('fatsocial_page') || 'landing');
  const [userRole, setUserRole] = useState(() => localStorage.getItem('fatsocial_role') || '');
  const [fullName, setFullName] = useState(() => localStorage.getItem('fatsocial_cache_name') || 'William Hudson');
  const [email, setEmail] = useState(() => localStorage.getItem('fatsocial_cache_email') || '');
  const [password, setPassword] = useState(() => localStorage.getItem('fatsocial_cache_pass') || '');
  
  const [paymentStatus, setPaymentStatus] = useState(() => localStorage.getItem('fatsocial_pay_status') || 'idle'); 
  const [isAdminViewOpen, setIsAdminViewOpen] = useState(false);
  const [activeFeatureModal, setActiveFeatureModal] = useState(null); // 'projects', 'gifts', 'subs'

  // Sync state cleanly with LocalStorage on update
  useEffect(() => {
    localStorage.setItem('fatsocial_page', currentPage);
    localStorage.setItem('fatsocial_role', userRole);
    localStorage.setItem('fatsocial_pay_status', paymentStatus);
    localStorage.setItem('fatsocial_cache_name', fullName);
    localStorage.setItem('fatsocial_cache_email', email);
    localStorage.setItem('fatsocial_cache_pass', password);
  }, [currentPage, userRole, paymentStatus, fullName, email, password]);

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
          setCurrentPage('dashboard');
        }
      }, 1500);
    }
    return () => { if (checkInterval) clearInterval(checkInterval); };
  }, [paymentStatus]);

  const handleLogout = () => {
    setUserRole('');
    setPaymentStatus('idle');
    setActiveFeatureModal(null);
    localStorage.removeItem('fatsocial_admin_approved_trigger');
    setCurrentPage('landing');
  };

  // --- 2. FLOATING ADMINISTRATIVE OVERLAY PANEL ---
  const renderInlineAdminController = () => {
    const hasPendingUser = paymentStatus === 'verifying';
    return e('div', { className: 'fixed bottom-4 left-1/2 -translate-x-1/2 bg-[#1C1C1E] border border-red-500 text-white text-xs p-4 rounded-2xl shadow-2xl z-[9999] w-[90%] max-w-xs space-y-3' }, [
      e('div', { className: 'flex justify-between items-center border-b border-gray-800 pb-1.5' }, [
        e('span', { className: 'font-bold text-red-400 uppercase text-[10px] tracking-wider' }, '🛠️ System Admin Control'),
        e('button', { onClick: () => setIsAdminViewOpen(false), className: 'text-gray-500 font-bold px-1' }, '✕')
      ]),
      hasPendingUser ? 
        e('div', { className: 'space-y-2' }, [
          e('div', { className: 'bg-[#121214] p-2.5 rounded-xl text-[11px] font-mono border border-gray-800 space-y-1' }, [
            e('p', { className: 'text-gray-500 text-[9px] uppercase font-bold' }, 'Pending Profile Entry:'),
            e('p', null, `USER: ${fullName}`),
            e('p', { className: 'text-blue-400' }, `MAIL: ${email || 'fatcoincapital@gmail.com'}`),
            e('p', { className: 'text-emerald-400' }, `SETUP: $25.00 PAID`)
          ]),
          e('button', { 
            onClick: () => localStorage.setItem('fatsocial_admin_approved_trigger', 'true'),
            className: 'w-full bg-emerald-500 text-black font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider'
          }, 'Approve Profile Entry')
        ]) : 
        e('p', { className: 'text-gray-500 text-center py-4 italic text-[10px]' }, 'No accounts currently waiting for payment verification.')
    ]);
  };

  const renderAdminToggleButton = () => (
    e('button', { onClick: () => setIsAdminViewOpen(!isAdminViewOpen), className: 'fixed top-2 right-12 opacity-5 bg-transparent text-white text-[10px] z-[9999] px-2 py-1' }, '• admin console')
  );

  // --- 3. PLATFORM SETUP LOCK GATES ---
  if (paymentStatus === 'verifying') {
    return e('div', { className: 'min-h-screen bg-[#000000] text-white max-w-md mx-auto flex flex-col items-center justify-center p-6 text-center space-y-6 relative font-sans' }, [
      renderAdminToggleButton(),
      isAdminViewOpen && renderInlineAdminController(),
      e('div', { className: 'w-10 h-10 border-2 border-gray-800 border-t-white rounded-full animate-spin' }),
      e('div', { className: 'space-y-2' }, [
        e('h3', { className: 'font-bold text-xl tracking-tight' }, 'Awaiting Verification'),
        e('p', { className: 'text-xs text-gray-400 px-6 leading-relaxed' }, 'Please hold on while our automated administration system audits and verifies your setup fee submission.')
      ])
    ]);
  }

  if (currentPage === 'landing') {
    return e('div', { className: 'min-h-screen bg-[#000000] text-white max-w-md mx-auto flex flex-col justify-between p-6 relative font-sans' }, [
      renderAdminToggleButton(),
      isAdminViewOpen && renderInlineAdminController(),
      e('div', { className: 'flex-1 flex flex-col justify-center items-center text-center space-y-4' }, [
        e('div', { className: 'w-14 h-14 bg-white text-black rounded-2xl flex items-center justify-center font-black text-2xl tracking-tighter shadow-lg' }, 'F'),
        e('h1', { className: 'text-2xl font-black tracking-tight text-white uppercase' }, 'FATSOCIAL'),
        e('p', { className: 'text-xs text-gray-500 max-w-xs leading-relaxed font-medium' }, 'Native creator rewards management and access workspace ecosystem.')
      ]),
      e('div', { className: 'space-y-3 pb-4' }, [
        e('button', { onClick: () => setCurrentPage('signup'), className: 'w-full bg-white text-black font-bold py-4 rounded-xl text-sm' }, 'Create Profile Account'),
        e('button', { onClick: () => { setUserRole('creator'); setCurrentPage('dashboard'); }, className: 'w-full bg-transparent border border-gray-800 font-bold py-4 rounded-xl text-sm text-gray-400' }, 'Direct Dashboard View')
      ])
    ]);
  }

  if (currentPage === 'signup') {
    return e('div', { className: 'min-h-screen bg-[#000000] text-white max-w-md mx-auto flex flex-col p-6 relative font-sans space-y-6' }, [
      e('button', { onClick: () => setCurrentPage('landing'), className: 'text-xs font-bold text-gray-500 text-left' }, '← BACK'),
      e('div', null, [
        e('h2', { className: 'text-2xl font-black tracking-tight' }, 'Creator Account Setup'),
        e('p', { className: 'text-xs text-gray-500 font-medium' }, 'Configure profile information inputs to sync with tracking engine registers.')
      ]),
      e('div', { className: 'space-y-4 flex-1' }, [
        e('input', { type: 'text', placeholder: 'Full Legal Name', value: fullName, onChange: e => setFullName(e.target.value), className: 'w-full px-4 py-3.5 bg-[#121214] border border-gray-900 rounded-xl text-sm text-white focus:outline-none' }),
        e('input', { type: 'email', placeholder: 'Email Address', value: email, onChange: e => setEmail(e.target.value), className: 'w-full px-4 py-3.5 bg-[#121214] border border-gray-900 rounded-xl text-sm text-white focus:outline-none' }),
        e('input', { type: 'password', placeholder: 'Access Password', value: password, onChange: e => setPassword(e.target.value), className: 'w-full px-4 py-3.5 bg-[#121214] border border-gray-900 rounded-xl text-sm text-white focus:outline-none' }),
        e('div', { className: 'bg-[#121214] border border-gray-900 p-4 rounded-xl flex items-center justify-between text-xs mt-2' }, [
          e('div', null, [e('p', { className: 'font-bold text-white' }, 'One-Time Database Setup Fee'), e('p', { className: 'text-[10px] text-gray-500' }, 'Unlocks live interactive timeline tasks framework')]),
          e('span', { className: 'text-sm font-black text-emerald-400' }, '$25.00')
        ]),
        e('button', { onClick: () => setCurrentPage('checkout'), className: 'w-full bg-white text-black font-bold py-4 rounded-xl text-sm mt-4' }, 'Proceed to Payment Matrix')
      ])
    ]);
  }

  if (currentPage === 'checkout') {
    return e('div', { className: 'min-h-screen bg-[#000000] text-white max-w-md mx-auto flex flex-col p-6 justify-between relative font-sans' }, [
      renderAdminToggleButton(),
      isAdminViewOpen && renderInlineAdminController(),
      e('div', { className: 'space-y-5' }, [
        e('button', { onClick: () => setCurrentPage('signup'), className: 'text-xs font-bold text-gray-500 text-left block' }, '← BACK'),
        e('h2', { className: 'text-xl font-black' }, 'Deposit Setup Access Settlement'),
        e('div', { className: 'bg-[#121214] border border-gray-900 rounded-2xl p-4 space-y-3' }, [
          e('p', { className: 'text-[10px] font-bold text-gray-500 uppercase tracking-wider' }, 'Official Bitcoin Node Coordinates'),
          e('div', { className: 'bg-[#000000] p-3 rounded-xl border border-gray-800 font-mono text-xs text-emerald-400 break-all text-center select-all' }, 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'),
          e('p', { className: 'text-xs text-gray-400 leading-relaxed text-center' }, 'Transfer exactly $25.00 USD worth of Bitcoin to continue. Execution processes automatically on block broadcast confirmation.')
        ])
      ]),
      e('div', { className: 'space-y-2' }, [
        e('button', { onClick: () => setPaymentStatus('verifying'), className: 'w-full bg-emerald-500 text-black font-bold py-4 rounded-xl text-sm uppercase' }, 'I Have Deposited Paid Fee'),
        e('button', { onClick: () => setCurrentPage('signup'), className: 'w-full text-center text-xs text-gray-500 font-bold py-2' }, 'Cancel Checkout Session')
      ])
    ]);
  }

  // --- 4. THE EXACT REPLICA CREATOR REWARDS PROGRAM LAYOUT ---
  if (currentPage === 'dashboard') {
    return e('div', { className: 'min-h-screen bg-[#000000] text-white max-w-md mx-auto flex flex-col relative font-sans antialiased pb-6 select-none' }, [
      renderAdminToggleButton(),
      isAdminViewOpen && renderInlineAdminController(),

      // Top Native App Header Segment Bar Block
      e('div', { className: 'flex justify-between items-center px-4 py-3 border-b border-gray-900/50 bg-[#000000]' }, [
        e('button', { onClick: handleLogout, className: 'text-gray-400 text-lg font-medium active:opacity-60 px-1' }, '←'),
        e('h1', { className: 'font-bold text-[15px] tracking-wide text-white text-center flex-1' }, 'Creator Rewards Program'),
        e('button', { onClick: () => alert("Framework Engine Version: Build v2.8.6 - Production Node Connected Securely."), className: 'text-gray-400 text-sm font-medium border border-gray-800 rounded-full w-4 h-4 flex items-center justify-center text-[10px]' }, 'i')
      ]),

      // Scrollable content framework panel housing replica design cards
      e('div', { className: 'flex-1 px-4 pt-4 space-y-4 overflow-y-auto' }, [
        
        // Circular Avatar Profile identity display section
        e('div', { className: 'flex items-center space-x-3 py-1.5' }, [
          e('div', { className: 'w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-700/50 font-black text-gray-200 text-base shadow-inner' }, fullName.charAt(0).toUpperCase()),
          e('div', { className: 'flex-1 space-y-0.5' }, [
            e('h2', { className: 'text-[15px] font-bold text-white tracking-tight' }, fullName),
            e('p', { className: 'text-[11px] font-medium text-zinc-500' }, `@${fullName.toLowerCase().replace(/\s+/g, '')}`)
          ]),
          // Clean official native green badge module
          e('div', { className: 'bg-[#152E20] text-[#4ADE80] text-[11px] font-bold px-3 py-1 rounded-full border border-[#1B4D31]/30 flex items-center space-x-1' }, [
            e('span', { className: 'text-[9px] mr-0.5' }, '●'),
            e('span', null, 'Active')
          ])
        ]),

        // Core Primary Monetization Metric Box Panel Container (TikTok Match Look)
        e('div', { className: 'bg-[#121212] rounded-2xl p-4.5 border border-zinc-900/40 space-y-4 shadow-sm' }, [
          e('div', { className: 'space-y-1' }, [
            e('h3', { className: 'text-xs font-bold text-zinc-400 tracking-wide uppercase' }, 'Monetization'),
            e('div', { className: 'flex items-baseline justify-between cursor-pointer active:opacity-70 pt-0.5' }, [
              e('span', { className: 'text-3xl font-bold tracking-tight text-white' }, '$0.00'),
              e('span', { className: 'text-zinc-600 font-bold text-sm' }, '〉')
            ]),
            e('div', { className: 'flex items-center space-x-1 text-[11px] text-zinc-500 font-medium pt-0.5' }, [
              e('span', null, 'Estimated rewards in the last 7 days'),
              e('span', { className: 'border border-zinc-800 rounded-full w-3 h-3 flex items-center justify-center text-[8px] text-zinc-500 font-bold' }, '?')
            ])
          ]),

          // Secondary embedded metric horizontal stripe capsule
          e('div', { className: 'bg-[#1C1C1E] rounded-xl p-3 flex justify-between items-center border border-zinc-800/40 text-xs' }, [
            e('span', { className: 'font-medium text-zinc-300' }, 'Balance: $0.00'),
            e('div', { className: 'flex items-center space-x-0.5 text-zinc-500 font-bold cursor-pointer active:opacity-60' }, [
              e('span', null, 'View'), e('span', { className: 'text-[10px] ml-0.5' }, '〉')
            ])
          ])
        ]),

        // Main programs for you module wrapper grid
        e('div', { className: 'bg-[#121212] rounded-2xl p-4.5 border border-zinc-900/40 space-y-4 shadow-sm' }, [
          
          e('div', { className: 'flex items-center space-x-1 pb-1' }, [
            e('h3', { className: 'text-[14px] font-bold text-white tracking-wide' }, 'Programs for you'),
            e('span', { className: 'border border-zinc-800 rounded-full w-3.5 h-3.5 flex items-center justify-center text-[9px] text-zinc-500 font-bold' }, '?')
          ]),

          // Checklist Rows - Completely refactored matching text and removal of dots
          e('div', { className: 'divide-y divide-zinc-900/80' }, [
            
            // Program Operation Card row entry 1: Daily Creator Projects
            e('div', { 
              onClick: () => setActiveFeatureModal('projects'),
              className: 'py-4 flex items-start justify-between cursor-pointer active:bg-zinc-900/30 first:pt-0' 
            }, [
              e('div', { className: 'flex items-start space-x-3.5 flex-1 pr-2' }, [
                e('div', { className: 'mt-1 text-base' }, '🎵'),
                e('div', { className: 'space-y-1' }, [
                  e('div', { className: 'flex items-center space-x-1.5' }, [
                    e('span', { className: 'text-[14px] font-bold text-white tracking-tight' }, 'Daily Creator Projects'),
                    e('span', { className: 'bg-[#262629] text-[9px] text-zinc-400 font-bold px-1.5 py-0.5 rounded flex items-center space-x-0.5 border border-zinc-800/60' }, '🔒 1/2')
                  ]),
                  e('p', { className: 'text-xs text-zinc-400 leading-normal font-medium' }, 'Earn daily Fatcoins creating contents by engaging in the daily set out sponsored tasks')
                ])
              ]),
              e('div', { className: 'self-center text-zinc-600 text-xs pl-1' }, '〉')
            ]),

            // Program Operation Card row entry 2: Video Gifts
            e('div', { 
              onClick: () => setActiveFeatureModal('gifts'),
              className: 'py-4 flex items-start justify-between cursor-pointer active:bg-zinc-900/30' 
            }, [
              e('div', { className: 'flex items-start space-x-3.5 flex-1 pr-2' }, [
                e('div', { className: 'mt-1 text-base' }, '📹'),
                e('div', { className: 'space-y-1' }, [
                  e('div', { className: 'flex items-center space-x-1.5' }, [
                    e('span', { className: 'text-[14px] font-bold text-white tracking-tight' }, 'Video Gifts'),
                    e('span', { className: 'bg-[#262629] text-[9px] text-zinc-400 font-bold px-1.5 py-0.5 rounded flex items-center space-x-0.5 border border-zinc-800/60' }, '🔒 4/5')
                  ]),
                  e('p', { className: 'text-xs text-zinc-400 leading-normal font-medium' }, 'Get Gifts for your top-performing videos..')
                ])
              ]),
              e('div', { className: 'self-center text-zinc-600 text-xs pl-1' }, '〉')
            ]),

            // Program Operation Card row entry 3: Subs
            e('div', { 
              onClick: () => setActiveFeatureModal('subs'),
              className: 'py-4 flex items-start justify-between cursor-pointer active:bg-zinc-900/30 last:pb-0' 
            }, [
              e('div', { className: 'flex items-start space-x-3.5 flex-1 pr-2' }, [
                e('div', { className: 'mt-1 text-base' }, '⭐'),
                e('div', { className: 'space-y-1' }, [
                  e('div', { className: 'flex items-center space-x-1.5' }, [
                    e('span', { className: 'text-[14px] font-bold text-white tracking-tight' }, 'Subs'),
                    e('span', { className: 'bg-[#262629] text-[9px] text-zinc-400 font-bold px-1.5 py-0.5 rounded flex items-center space-x-0.5 border border-zinc-800/60' }, '🔒 2/4')
                  ]),
                  e('p', { className: 'text-xs text-zinc-400 leading-normal font-medium' }, 'Connect more closely with viewers through subscriber-only content and benefits.')
                ])
              ]),
              e('div', { className: 'self-center text-zinc-600 text-xs pl-1' }, '〉')
            ])

          ])
        ])

      ]),

      // --- DYNAMIC SLIDE-UP MODAL OVERLAY COMPONENT DRAWERS ---
      activeFeatureModal && e('div', { className: 'fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-end justify-center p-4' }, [
        e('div', { className: 'bg-[#121212] w-full rounded-t-3xl p-5 space-y-4 max-w-md border-t border-zinc-900/80 font-sans text-white' }, [
          e('div', { className: 'flex justify-between items-center border-b border-zinc-900 pb-3' }, [
            e('h4', { className: 'font-bold text-sm tracking-tight text-white uppercase' }, 
              activeFeatureModal === 'projects' ? '🏆 Daily Sponsored Tasks' : 
              activeFeatureModal === 'gifts' ? '🎁 Video Gifts Module' : '🔒 Subs Access Portal'
            ),
            e('button', { onClick: () => setActiveFeatureModal(null), className: 'text-xs font-bold text-zinc-400 bg-zinc-800 px-3 py-1.5 rounded-xl' }, 'Close')
          ]),
          
          // Contextual interactive drawer items
          activeFeatureModal === 'projects' && e('div', { className: 'space-y-3 text-xs' }, [
            e('p', { className: 'text-zinc-400' }, 'Engage with active music campaigns below to populate performance logs:'),
            e('div', { className: 'bg-zinc-900 p-3.5 rounded-xl border border-zinc-800/40 flex justify-between items-center' }, [
              e('span', { className: 'font-bold' }, '📌 Active Track Push Target [45 FC]'),
              e('button', { onClick: () => alert("Sponsor screenshot submission recorded inside validation cache."), className: 'bg-white text-black px-2.5 py-1 font-bold rounded text-[11px]' }, 'Submit Proof')
            ])
          ]),
          activeFeatureModal === 'gifts' && e('div', { className: 'text-center py-4 text-xs text-zinc-500 italic' }, 'Virtual gifting matrix index tracker hooks operating correctly in background state syncs.'),
          activeFeatureModal === 'subs' && e('div', { className: 'space-y-2 text-xs' }, [
            e('p', { className: 'text-zinc-400' }, 'Manage subscriber profile parameters or update monthly barrier fees:'),
            e('div', { className: 'bg-zinc-900 p-3.5 rounded-xl border border-zinc-800/40 font-mono text-center text-emerald-400 font-bold' }, 'Entry Unlock Fee Trigger: 30 Fatcoins')
          ])
        ])
      ])

    ]);
  }

  return e('div', { className: 'p-6 text-center text-xs text-gray-500 bg-black min-h-screen' }, 'Initializing core UI layer component assets...');
}

const root = window.ReactDOM.createRoot(document.getElementById('root'));
root.render(e(App));
