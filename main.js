// Grab React elements directly from the mobile window context
const { useState, useEffect } = window.React;
const e = window.React.createElement;

function App() {
  // --- 1. MEMORY AND SESSION STATE ENGINE ---
  const [currentPage, setCurrentPage] = useState(() => localStorage.getItem('fatsocial_page') || 'landing');
  const [userRole, setUserRole] = useState(() => localStorage.getItem('fatsocial_role') || '');
  const [fatcoinBalance, setFatcoinBalance] = useState(() => parseInt(localStorage.getItem('fatsocial_coins')) || 0);
  
  // Dynamic Creator Earnings Account Engine
  const [creatorEarnings, setCreatorEarnings] = useState(() => parseFloat(localStorage.getItem('fatsocial_creator_earnings')) || 0.00);

  // Layout & Global View Configurations
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [unlockedCreators, setUnlockedCreators] = useState(() => JSON.parse(localStorage.getItem('fatsocial_unlocked')) || []);
  const [subscribedCreators, setSubscribedCreators] = useState(() => JSON.parse(localStorage.getItem('fatsocial_subs')) || []);
  
  // --- PREMIUM TAB NAVIGATION ROUTER (Defaults to your Monetization page layout) ---
  const [creatorTab, setCreatorTab] = useState(() => localStorage.getItem('fatsocial_creator_tab') || 'monetization');

  // Registration and Authentication Form Fields State Cache
  const [fullName, setFullName] = useState(() => localStorage.getItem('fatsocial_cache_name') || '');
  const [email, setEmail] = useState(() => localStorage.getItem('fatsocial_cache_email') || '');
  const [password, setPassword] = useState(() => localStorage.getItem('fatsocial_cache_pass') || '');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState('feed'); 

  // Payment Interface and Administrative State Routing
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('crypto'); 
  const [paymentStatus, setPaymentStatus] = useState(() => localStorage.getItem('fatsocial_pay_status') || 'idle'); 
  const [isAdminViewOpen, setIsAdminViewOpen] = useState(false);

  // --- PLATFORM TASK SYSTEM STATE STORAGE ---
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('fatsocial_tasks_database');
    return saved ? JSON.parse(saved) : [
      { id: 't1', network: 'TikTok', title: 'Work with Artists', reward: 15.00, desc: 'Create posts with featured sounds and get paid based on how your post performs.', status: 'available', lockStatus: '1/2', proofUrl: '' },
      { id: 't2', network: 'Facebook', title: 'Video Gifts', reward: 35.00, desc: 'Get Gifts for your top-performing videos.', status: 'available', lockStatus: '4/5', proofUrl: '' },
      { id: 't3', network: 'Instagram', title: 'Subscription', reward: 20.00, desc: 'Connect more closely with viewers through subscriber-only content and benefits.', status: 'available', lockStatus: '2/4', proofUrl: '' }
    ];
  });
  const [activeSubmissionTask, setActiveSubmissionTask] = useState(null);
  const [typedProofUrl, setTypedProofUrl] = useState('');

  // Sync state cleanly with LocalStorage on refresh
  useEffect(() => {
    localStorage.setItem('fatsocial_page', currentPage);
    localStorage.setItem('fatsocial_role', userRole);
    localStorage.setItem('fatsocial_coins', fatcoinBalance);
    localStorage.setItem('fatsocial_creator_earnings', creatorEarnings);
    localStorage.setItem('fatsocial_unlocked', JSON.stringify(unlockedCreators));
    localStorage.setItem('fatsocial_subs', JSON.stringify(subscribedCreators));
    localStorage.setItem('fatsocial_pay_status', paymentStatus);
    localStorage.setItem('fatsocial_tasks_database', JSON.stringify(tasks));
    localStorage.setItem('fatsocial_creator_tab', creatorTab);
    
    localStorage.setItem('fatsocial_cache_name', fullName);
    localStorage.setItem('fatsocial_cache_email', email);
    localStorage.setItem('fatsocial_cache_pass', password);
  }, [currentPage, userRole, fatcoinBalance, creatorEarnings, unlockedCreators, subscribedCreators, paymentStatus, tasks, creatorTab, fullName, email, password]);

  // Infinite Polling Loop for Administrative updates
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

  const navigateTo = (page) => {
    setErrorMessage('');
    setCurrentPage(page);
  };

  const handleLogout = () => {
    setIsSidebarOpen(false);
    setUserRole('');
    setFatcoinBalance(0);
    setCreatorEarnings(0.00);
    setUnlockedCreators([]);
    setSubscribedCreators([]);
    setFullName('');
    setEmail('');
    setPassword('');
    setPaymentStatus('idle');
    setCreatorTab('monetization');
    localStorage.removeItem('fatsocial_admin_approved_trigger');
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
    if (!fullName || !email) {
      alert("Missing registration variables. Please go back and fill the setup form completely.");
      return;
    }
    setPaymentStatus('verifying');
  };

  const handleAuthViewer = () => {
    if (!fullName || !email || !password) {
      setErrorMessage('Please fill out all required setup fields.');
      return;
    }
    setUserRole('viewer');
    navigateTo('dashboard');
  };

  const openSubmissionDrawer = (task) => {
    setActiveSubmissionTask(task);
    setTypedProofUrl('');
  };

  const handleExecuteProofSubmission = () => {
    if (!typedProofUrl.trim()) {
      alert("Please provide a valid platform validation link destination.");
      return;
    }
    setTasks(prev => prev.map(t => t.id === activeSubmissionTask.id ? { ...t, status: 'pending', proofUrl: typedProofUrl } : t));
    setActiveSubmissionTask(null);
    alert("Campaign performance data locked. Task verification request routed directly to administrative queue.");
  };

  const handleAdminApproveTask = (taskId, rewardValue) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'approved' } : t));
    setCreatorEarnings(prev => prev + rewardValue);
  };

  // --- FLOATING ADMINISTRATIVE OVERLAY PANEL ---
  const renderInlineAdminController = () => {
    const hasPendingUser = paymentStatus === 'verifying' && fullName && email;
    const pendingTasks = tasks.filter(t => t.status === 'pending');

    return e('div', { className: 'fixed bottom-24 left-1/2 -translate-x-1/2 bg-neutral-900 border border-neutral-700 text-white text-xs p-4 rounded-2xl shadow-2xl z-[9999] w-[90%] max-w-xs space-y-3' }, [
      e('div', { className: 'flex justify-between items-center border-b border-neutral-800 pb-1.5' }, [
        e('span', { className: 'font-black text-white tracking-wide uppercase text-[10px]' }, '🛠️ Admin Control Panel'),
        e('button', { onClick: () => setIsAdminViewOpen(false), className: 'text-neutral-500 font-bold px-1 text-sm' }, '✕')
      ]),
      hasPendingUser && e('div', { className: 'space-y-2 border-b border-neutral-800 pb-2' }, [
        e('div', { className: 'bg-neutral-950 p-2.5 rounded-xl text-[11px] font-mono border border-neutral-800 space-y-1' }, [
          e('p', { className: 'text-neutral-500 font-bold text-[10px] uppercase' }, 'Awaiting Account:'),
          e('p', { className: 'text-white font-bold' }, `NAME: ${fullName}`),
          e('p', { className: 'text-neutral-300' }, `EMAIL: ${email}`)
        ]),
        e('button', { 
          onClick: () => localStorage.setItem('fatsocial_admin_approved_trigger', 'true'),
          className: 'w-full bg-white text-black font-black py-2.5 rounded-xl text-xs uppercase tracking-wider'
        }, 'Approve User Account')
      ]),
      pendingTasks.map(t => e('div', { key: t.id, className: 'bg-neutral-950 p-2 rounded-xl text-[10px] font-mono space-y-1 border border-neutral-800' }, [
        e('button', { onClick: () => handleAdminApproveTask(t.id, t.reward), className: 'w-full bg-white text-black font-black py-1.5 rounded-lg' }, `Approve $${t.reward}`)
      ]))
    ]);
  };

  const renderAdminToggleButton = () => (
    e('button', { 
      onClick: () => setIsAdminViewOpen(!isAdminViewOpen),
      className: 'fixed top-2 right-2 opacity-5 bg-transparent text-white text-[10px] z-[9999] px-2 py-1'
    }, '• admin console')
  );

  // --- MONOCHROME NAVIGATION SUB-VIEWS ---
  const renderHomeTab = () => e('div', { className: 'p-5 space-y-4 animate-fade-in' }, [
    e('div', { className: 'bg-white p-6 rounded-[24px] border border-neutral-200/60 shadow-xs space-y-1' }, [
      e('h2', { className: 'font-black text-xl tracking-tight text-neutral-900' }, 'FATSOCIAL Workspace'),
      e('p', { className: 'text-xs text-neutral-400 font-medium' }, 'All systems running normally. Your creator pipeline is fully online.')
    ]),
    e('div', { className: 'bg-neutral-900 text-white p-6 rounded-[24px] space-y-3' }, [
      e('div', { className: 'flex justify-between items-center' }, [
        e('h3', { className: 'font-black text-xs tracking-wider text-neutral-400 uppercase' }, 'Overview Performance'),
        e('span', { className: 'text-[10px] bg-neutral-800 px-2 py-0.5 rounded-md font-bold' }, 'Live')
      ]),
      e('p', { className: 'text-xs text-neutral-300 font-medium leading-relaxed' }, 'Task verification channels are currently optimized. Submissions securely forward direct validation alerts to the administrative audit desk layer.')
    ])
  ]);

  const renderSearchTab = () => e('div', { className: 'p-5 space-y-4 animate-fade-in' }, [
    e('div', { className: 'relative' }, [
      e('input', { 
        type: 'text', 
        placeholder: 'Search tasks, brand opportunities, campaigns...', 
        className: 'w-full bg-white border border-neutral-200 rounded-xl px-4 py-3.5 text-xs font-medium focus:outline-none focus:border-neutral-950' 
      })
    ]),
    e('p', { className: 'text-[10px] font-black text-neutral-400 uppercase tracking-wider pl-1' }, 'Active Platforms Catalog'),
    e('div', { className: 'grid grid-cols-2 gap-3' }, 
      ['TikTok Media', 'Facebook Video', 'Instagram Reach', 'Premium Sounds'].map(tag => 
        e('div', { key: tag, className: 'bg-white p-4 rounded-xl border border-neutral-100 text-xs font-black text-neutral-800 text-center shadow-3xs' }, tag)
      )
    )
  ]);

  const renderChatsTab = () => e('div', { className: 'p-5 space-y-3 animate-fade-in' }, [
    e('h2', { className: 'font-black text-xl tracking-tight text-neutral-900 mb-2 pl-1' }, 'Messages'),
    e('div', { className: 'bg-white rounded-2xl border border-neutral-100 divide-y divide-neutral-100' }, [
      { name: 'System Auditor', msg: 'Your professional framework access has been successfully configured.', time: 'Just Now' },
      { name: 'Campaign Desk Node', msg: 'New monetization opportunities match your deployment tracking criteria.', time: '4h ago' }
    ].map((chat, idx) => e('div', { key: idx, className: 'p-4 flex justify-between items-center cursor-pointer active:bg-neutral-50/50' }, [
      e('div', { className: 'space-y-0.5 flex-1 pr-2' }, [
        e('div', { className: 'font-black text-xs text-neutral-900' }, chat.name),
        e('p', { className: 'text-[11px] text-neutral-400 font-medium truncate max-w-[220px]' }, chat.msg)
      ]),
      e('span', { className: 'text-[9px] font-bold text-neutral-400' }, chat.time)
    ])))
  ]);

  const renderMyProfileTab = () => e('div', { className: 'p-5 space-y-4 animate-fade-in' }, [
    e('div', { className: 'bg-white border border-neutral-200/80 rounded-[24px] p-6 text-center space-y-4 shadow-3xs' }, [
      e('div', { className: 'w-16 h-16 bg-neutral-900 text-white rounded-2xl mx-auto flex items-center justify-center font-black text-xl shadow-sm' }, fullName ? fullName.charAt(0).toUpperCase() : 'F'),
      e('div', { className: 'space-y-0.5' }, [
        e('h2', { className: 'font-black text-base text-neutral-900 tracking-tight' }, fullName || 'FATSOCIAL Creator'),
        e('p', { className: 'text-[11px] text-neutral-400 font-mono font-medium' }, email || 'account@fatsocial.github.io')
      ]),
      e('div', { className: 'pt-3 border-t border-neutral-100 flex justify-around text-center' }, [
        ['Verification', 'Active ✔️'], ['Tier Class', 'Premium Pro']
      ].map(([lbl, val]) => e('div', { key: lbl }, [
        e('span', { className: 'block text-[9px] font-black text-neutral-400 uppercase tracking-wider mb-0.5' }, lbl),
        e('span', { className: 'text-xs font-black text-neutral-900' }, val)
      ])))
    ]),
    e('button', { 
      onClick: handleLogout, 
      className: 'w-full bg-neutral-50 text-neutral-900 border border-neutral-200 font-black py-3.5 rounded-xl text-xs uppercase tracking-wide shadow-3xs active:scale-98 transition-transform' 
    }, 'Log Out System Session')
  ]);

  // --- UNTOUCHED ORIGINAL MONETIZATION VIEW BLOCK ---
  const renderMonetizationTab = () => e('div', { className: 'animate-fade-in' }, [
    e('div', { className: 'bg-[#121212] text-white px-5 pt-8 pb-6 rounded-b-[24px] relative bg-gradient-to-b from-neutral-900 to-black shadow-lg' }, [
      e('div', { className: 'flex justify-between items-center mb-5' }, [
        e('button', { onClick: () => setCreatorTab('my_profile'), className: 'text-white text-xl font-medium focus:outline-none' }, '‹'),
        e('div', { className: 'flex space-x-4 items-center' }, [
          e('span', { className: 'text-white text-lg cursor-pointer' }, '🏳️'),
          e('span', { className: 'text-white text-lg cursor-pointer' }, '⚙️')
        ])
      ]),
      e('div', { className: 'space-y-1' }, [
        e('div', { className: 'text-sm font-semibold text-gray-400/80 tracking-wide' }, 'Monetization'),
        e('div', { className: 'flex items-center space-x-1.5' }, [
          e('span', { className: 'text-3xl font-black tracking-tight' }, `$${creatorEarnings.toFixed(2)}`),
          e('span', { className: 'text-gray-400 font-bold text-sm pt-1' }, '›')
        ]),
        e('div', { className: 'text-[11px] text-gray-500 font-medium flex items-center space-x-1' }, [
          e('span', null, 'Estimated rewards in the last 7 days'),
          e('span', { className: 'w-3 h-3 rounded-full border border-gray-600 inline-flex items-center justify-center text-[8px] text-gray-400' }, 'i')
        ])
      ]),
      e('div', { className: 'mt-5 bg-white/[0.06] backdrop-blur-md border border-white/5 rounded-xl px-4 py-3 flex justify-between items-center text-xs font-semibold' }, [
        e('div', { className: 'text-gray-300' }, `Balance: $${creatorEarnings.toFixed(2)}`),
        e('div', { className: 'text-gray-400 font-bold flex items-center' }, ['View ', e('span', { className: 'text-[10px] pl-0.5' }, '›')])
      ])
    ]),

    e('div', { className: 'bg-white mt-3 p-4 border-b border-gray-100 flex flex-col space-y-3 shadow-xs' }, [
      e('div', { className: 'flex justify-between items-center' }, [
        e('h3', { className: 'font-black text-sm tracking-tight text-gray-900' }, 'Rewards analytics'),
        e('span', { className: 'text-xs font-bold text-gray-400 flex items-center' }, ['View all ', e('span', { className: 'text-[9px] pl-0.5' }, '›')])
      ]),
      e('div', { className: 'bg-[#F8F8FA] rounded-xl p-4 space-y-1 border border-gray-50/50' }, [
        e('div', { className: 'text-xl font-black tracking-tight text-gray-900' }, `$${creatorEarnings.toFixed(2)}`),
        e('div', { className: 'text-[11px] text-gray-500 font-semibold' }, 'LIVE rewards'),
        e('div', { className: 'text-[11px] text-gray-400 font-bold' }, '0.0% 7d')
      ])
    ]),

    e('div', { className: 'bg-white mt-3 p-4 border-b border-gray-100 space-y-3' }, [
      e('h3', { className: 'font-black text-sm tracking-tight text-gray-900' }, 'Active programs'),
      e('div', { className: 'flex flex-col items-start space-y-1.5' }, [
        e('div', { className: 'w-11 h-11 bg-[#F8F8FA] rounded-xl flex items-center justify-center border border-gray-100 shadow-2xs' }, '🎁'),
        e('span', { className: 'text-[11px] font-black text-gray-900 tracking-tight' }, 'LIVE rewards')
      ])
    ]),

    e('div', { className: 'bg-white mt-3 p-4 space-y-3' }, [
      e('div', { className: 'flex justify-between items-center mb-1' }, [
        e('div', { className: 'flex items-center space-x-1' }, [
          e('h3', { className: 'font-black text-sm tracking-tight text-gray-900' }, 'Programs for you'),
          e('span', { className: 'w-3 h-3 rounded-full border border-gray-300 inline-flex items-center justify-center text-[8px] text-gray-400 font-bold' }, 'i')
        ]),
        e('span', { className: 'text-xs font-bold text-gray-400 flex items-center' }, ['View all ', e('span', { className: 'text-[9px] pl-0.5' }, '›')])
      ]),
      
      tasks.map(task => {
        let actionColorText = 'text-gray-400';
        if (task.status === 'pending' || task.status === 'approved') actionColorText = 'text-neutral-900 font-bold';

        return e('div', { 
          key: task.id, 
          onClick: () => task.status === 'available' && openSubmissionDrawer(task),
          className: 'flex items-start justify-between py-3 border-b border-gray-100 last:border-0 cursor-pointer active:bg-gray-50/50 rounded-lg px-1' 
        }, [
          e('div', { className: 'flex space-x-3 items-start flex-1 pr-2' }, [
            e('div', { className: 'text-lg pt-0.5' }, task.network === 'TikTok' ? '🎵' : task.network === 'Facebook' ? '🧰' : '⭐'),
            e('div', { className: 'space-y-0.5 flex-1' }, [
              e('div', { className: 'flex items-center space-x-2' }, [
                e('h4', { className: 'font-black text-[13px] text-gray-900 tracking-tight' }, task.title),
                e('span', { className: 'bg-gray-100 text-gray-500 text-[9px] font-black px-1.5 py-0.5 rounded flex items-center space-x-0.5' }, [
                  e('span', { className: 'text-[7px]' }, '🔒'), e('span', null, task.lockStatus)
                ])
              ]),
              e('p', { className: 'text-[11px] text-gray-400 font-medium leading-normal' }, task.desc),
              task.status === 'pending' && e('div', { className: 'text-[9px] font-mono text-neutral-800 pt-1 truncate max-w-[200px]' }, `Awaiting Verification Link...`),
              task.status === 'approved' && e('div', { className: 'text-[9px] font-bold text-neutral-900 pt-1' }, '✓ Payout successfully credited to wallet balance')
            ])
          ]),
          e('div', { className: 'flex items-center space-x-1 self-center text-xs' }, [
            task.status === 'available' ? e('span', { className: 'text-xs text-gray-300 font-bold' }, '›') : e('span', { className: `text-[10px] ${actionColorText}` }, task.status)
          ])
        ]);
      })
    ])
  ]);

  // --- CORE VIEW ROUTING SWITCH ENGINE ---
  if (paymentStatus === 'verifying') {
    return e('div', { className: 'min-h-screen bg-white text-[#121212] max-w-md mx-auto flex flex-col items-center justify-center p-6 text-center shadow-md relative' }, [
      renderAdminToggleButton(),
      isAdminViewOpen && renderInlineAdminController(),
      e('div', { className: 'w-12 h-12 border-4 border-neutral-100 border-t-neutral-950 rounded-full animate-spin' }),
      e('div', { className: 'space-y-2 mt-4' }, [
        e('h3', { className: 'font-black text-xl tracking-tight' }, 'Awaiting Verification'),
        e('p', { className: 'text-xs text-gray-400 px-6 font-medium' }, 'Please hold on while our automated system checks your submission setup fee status.')
      ])
    ]);
  }

  // Creator Dashboard Interface Render Container
  if (currentPage === 'dashboard' && userRole === 'creator') {
    return e('div', { className: 'min-h-screen bg-[#F4F4F6] text-[#121212] max-w-md mx-auto relative shadow-md pb-24 font-sans flex flex-col justify-between overflow-x-hidden' }, [
      e('div', { className: 'flex-1 w-full' }, [
        creatorTab === 'home' && renderHomeTab(),
        creatorTab === 'search' && renderSearchTab(),
        creatorTab === 'monetization' && renderMonetizationTab(),
        creatorTab === 'chats' && renderChatsTab(),
        creatorTab === 'my_profile' && renderMyProfileTab()
      ]),

      // --- 📌 PREMIUM MONOCHROME ACTION BOLDING BOTTOM NAVIGATION BAR ---
      e('nav', { className: 'fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur-xl border-t border-neutral-200/80 px-2 py-3 grid grid-cols-5 gap-1 z-50 shadow-[0_-4px_24px_rgba(0,0,0,0.04)]' }, [
        { id: 'home', label: 'Home', outlineIcon: '○', boldIcon: '●' },
        { id: 'search', label: 'Search', outlineIcon: '⌕', boldIcon: '🔍' },
        { id: 'monetization', label: 'Earnings', outlineIcon: '◇', boldIcon: '◆' },
        { id: 'chats', label: 'Chats', outlineIcon: '💬', boldIcon: '💬' },
        { id: 'my_profile', label: 'Profile', outlineIcon: '👤', boldIcon: '👤' }
      ].map(tab => {
        const isCurrent = creatorTab === tab.id;
        return e('button', {
          key: tab.id,
          onClick: () => setCreatorTab(tab.id),
          className: 'flex flex-col items-center justify-center py-0.5 rounded-xl transition-all relative ' + (isCurrent ? 'text-black scale-105 font-black' : 'text-neutral-400 font-medium hover:text-neutral-600')
        }, [
          e('span', { 
            className: 'text-[18px] mb-0.5 transition-all ' + (isCurrent ? 'text-black font-black scale-110' : 'text-neutral-400'),
            style: { color: isCurrent ? '#000000' : '#A3A3A3' }
          }, isCurrent ? tab.boldIcon : tab.outlineIcon),
          e('span', { className: 'text-[9px] uppercase tracking-wider font-bold' }, tab.label),
          isCurrent && e('div', { className: 'absolute -bottom-1 w-1.5 h-1.5 bg-black rounded-full' })
        ]);
      })),

      // Task Link Submission Drawer Overlay
      activeSubmissionTask && e('div', { className: 'fixed inset-0 bg-black/60 z-50 flex items-end justify-center p-4' }, [
        e('div', { className: 'bg-white w-full rounded-t-3xl p-6 space-y-4 max-w-md shadow-2xl' }, [
          e('button', { onClick: () => setActiveSubmissionTask(null), className: 'text-neutral-400 font-black float-right' }, '✕'),
          e('h3', { className: 'font-black text-base text-neutral-900' }, 'Verify Performance Asset'),
          e('input', { type: 'url', value: typedProofUrl, onChange: e => setTypedProofUrl(e.target.value), placeholder: 'https://example.com/submission-url', className: 'w-full px-4 py-3 bg-[#F8F8FA] border rounded-xl text-xs font-medium focus:outline-none' }),
          e('button', { onClick: handleExecuteProofSubmission, className: 'w-full bg-[#121212] text-white font-black py-3.5 rounded-xl text-xs uppercase' }, 'Lock Submission Link')
        ])
      ])
    ]);
  }

  // Consumer/Viewer profile dashboard view logic
  if (currentPage === 'dashboard' && userRole === 'viewer') {
    return e('div', { className: 'min-h-screen bg-[#F8F8FA] text-[#121212] max-w-md mx-auto shadow-md flex flex-col justify-between relative' }, [
      renderAdminToggleButton(),
      isAdminViewOpen && renderInlineAdminController(),
      e('div', { className: 'bg-[#121212] text-white p-4 flex justify-between items-center' }, [
        e('div', null, [
          e('div', { className: 'text-[10px] uppercase font-bold text-gray-400' }, 'Fatcoin Balance'),
          e('div', { className: 'text-sm font-black' }, `${fatcoinBalance} FC`)
        ]),
        e('button', { onClick: () => { setFatcoinBalance(prev => prev + 100); alert('Coins added successfully'); }, className: 'bg-white text-[#121212] font-black text-xs px-3 py-1.5 rounded-xl' }, '+ Buy Coins')
      ]),
      e('div', { className: 'flex-1 p-4 space-y-4' }, [
        e('div', { className: 'bg-white rounded-2xl p-4 shadow-sm border space-y-2' }, [
          e('h3', { className: 'font-black text-sm text-gray-900' }, 'Alex Rivers'),
          e('button', { onClick: () => alert('Subscribed'), className: 'bg-[#121212] text-white text-xs px-3 py-1.5 rounded-xl font-bold' }, 'Subscribe (30 FC)')
        ])
      ]),
      e('div', { className: 'bg-white border-t py-3 px-8 flex justify-around items-center shadow-md' }, [
        e('button', { onClick: () => setActiveTab('feed'), className: 'text-[#121212] font-bold text-xs' }, 'Explore'),
        e('button', { onClick: handleLogout, className: 'text-gray-400 font-bold text-xs' }, 'Log Out')
      ])
    ]);
  }

  // --- ARRESTED DEAD END LOOP — INTERCEPTING ROUTER VIEWS ---
  if (currentPage === 'choose_track') {
    return e('div', { className: 'min-h-screen bg-white text-[#121212] max-w-md mx-auto flex flex-col p-6 shadow-md relative' }, [
      renderAdminToggleButton(),
      isAdminViewOpen && renderInlineAdminController(),
      e('button', { onClick: () => navigateTo('landing'), className: 'flex items-center text-xs font-bold text-gray-400 mt-4 mb-6 uppercase tracking-wider' }, '← Back'),
      e('h2', { className: 'text-3xl font-black tracking-tight mb-2' }, 'Choose Account Type'),
      e('p', { className: 'text-xs text-gray-400 mb-6 font-medium' }, 'Select the customized interface suited for your platform profile.'),
      e('div', { className: 'space-y-4 flex-1' }, [
        e('div', { onClick: () => navigateTo('signup_creator'), className: 'border-2 border-[#121212] p-5 rounded-2xl cursor-pointer bg-white' }, [
          e('div', { className: 'flex items-center space-x-2.5 mb-2' }, [
            e('span', { className: 'text-lg' }, '🏆'),
            e('h3', { className: 'font-black text-base' }, 'Content Creator Career')
          ]),
          e('p', { className: 'text-xs text-gray-500 font-medium pl-7' }, 'Access analytics dashboards, earn system payouts via tasks, design premium subscriptions, and monetize tools.')
        ]),
        e('div', { onClick: () => navigateTo('signup_viewer'), className: 'border border-neutral-200 p-5 rounded-2xl cursor-pointer bg-white' }, [
          e('div', { className: 'flex items-center space-x-2.5 mb-2' }, [
            e('span', { className: 'text-lg' }, '👁️'),
            e('h3', { className: 'font-black text-base' }, 'General Consumer / Viewer')
          ]),
          e('p', { className: 'text-xs text-gray-500 font-medium pl-7' }, 'Discover professional skills showcase pools, follow creators, or send media tokens.')
        ])
      ])
    ]);
  }

  if (currentPage === 'signin') {
    return e('div', { className: 'min-h-screen bg-white text-[#121212] max-w-md mx-auto flex flex-col p-6 shadow-md relative' }, [
      renderAdminToggleButton(),
      isAdminViewOpen && renderInlineAdminController(),
      e('button', { onClick: () => navigateTo('landing'), className: 'flex items-center text-xs font-bold text-gray-400 mt-4 mb-6 uppercase tracking-wider' }, '← Back'),
      e('h2', { className: 'text-3xl font-black tracking-tight mb-6' }, 'Welcome Back'),
      e('div', { className: 'space-y-4 flex-1' }, [
        e('div', null, [
          e('label', { className: 'block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-wider' }, 'EMAIL ADDRESS'),
          e('input', { type: 'email', value: email, onChange: e => setEmail(e.target.value), placeholder: 'name@example.com', className: 'w-full px-4 py-3.5 bg-[#F8F8FA] border-transparent rounded-xl text-sm font-medium focus:outline-none' })
        ]),
        e('div', null, [
          e('label', { className: 'block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-wider' }, 'PASSWORD'),
          e('input', { type: 'password', value: password, onChange: e => setPassword(e.target.value), placeholder: 'Enter your password', className: 'w-full px-4 py-3.5 bg-[#F8F8FA] border-transparent rounded-xl text-sm font-medium focus:outline-none' })
        ]),
        e('button', { onClick: handleAuthViewer, className: 'w-full bg-[#121212] text-white font-black py-4 rounded-xl text-sm shadow-sm mt-2' }, 'Sign In Account')
      ])
    ]);
  }

  if (currentPage === 'signup_creator') {
    return e('div', { className: 'min-h-screen bg-white text-[#121212] max-w-md mx-auto flex flex-col p-6 shadow-md relative' }, [
      renderAdminToggleButton(),
      isAdminViewOpen && renderInlineAdminController(),
      e('button', { onClick: () => navigateTo('choose_track'), className: 'flex items-center text-xs font-bold text-gray-400 mt-4 mb-6 uppercase tracking-wider' }, '← Back'),
      e('h2', { className: 'text-3xl font-black tracking-tight mb-1' }, 'Create Creator Account'),
      e('p', { className: 'text-xs text-gray-400 mb-6 font-medium' }, 'Register below to access active tasks and payouts.'),
      e('div', { className: 'space-y-4 flex-1' }, [
        e('div', null, [
          e('label', { className: 'block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-wider' }, 'FULL LEGAL NAME'),
          e('input', { type: 'text', value: fullName, onChange: e => setFullName(e.target.value), placeholder: 'John Doe', className: 'w-full px-4 py-3.5 bg-[#F8F8FA] rounded-xl text-sm font-medium focus:outline-none border-0' })
        ]),
        e('div', null, [
          e('label', { className: 'block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-wider' }, 'EMAIL ADDRESS'),
          e('input', { type: 'email', value: email, onChange: e => setEmail(e.target.value), placeholder: 'name@example.com', className: 'w-full px-4 py-3.5 bg-[#F8F8FA] rounded-xl text-sm font-medium focus:outline-none border-0' })
        ]),
        e('div', null, [
          e('label', { className: 'block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-wider' }, 'PASSWORD'),
          e('input', { type: 'password', value: password, onChange: e => setPassword(e.target.value), placeholder: 'Create password', className: 'w-full px-4 py-3.5 bg-[#F8F8FA] rounded-xl text-sm font-medium focus:outline-none border-0' })
        ]),
        e('div', { className: 'bg-[#F8F8FA] p-4 rounded-xl flex items-center justify-between text-xs mt-2 border border-neutral-100' }, [
          e('span', { className: 'font-bold text-gray-900 text-sm' }, 'One-Time Setup Fee'),
          e('span', { className: 'text-base font-black text-[#121212]' }, '$25.00')
        ]),
        e('button', { onClick: triggerCreatorPaymentModal, className: 'w-full bg-[#121212] text-white font-black py-4 rounded-xl text-sm shadow-sm mt-2' }, 'Pay Fee & Complete Registration')
      ])
    ]);
  }

  if (currentPage === 'payment_creator') {
    return e('div', { className: 'min-h-screen bg-white text-[#121212] max-w-md mx-auto flex flex-col p-6 shadow-md relative' }, [
      renderAdminToggleButton(),
      isAdminViewOpen && renderInlineAdminController(),
      e('button', { onClick: () => navigateTo('signup_creator'), className: 'flex items-center text-xs font-bold text-gray-400 mt-4 mb-6 uppercase tracking-wider' }, '← Back'),
      e('h2', { className: 'text-2xl font-black tracking-tight mb-1' }, 'Complete Setup Fee'),
      e('div', { className: 'grid grid-cols-2 gap-2 mb-6 bg-[#F8F8FA] p-1 rounded-xl' }, [
        e('button', { onClick: () => setSelectedPaymentMethod('crypto'), className: `py-2.5 text-center text-xs font-black rounded-lg ${selectedPaymentMethod === 'crypto' ? 'bg-white text-[#121212]' : 'text-gray-400'}` }, 'Crypto'),
        e('button', { onClick: () => setSelectedPaymentMethod('naira'), className: `py-2.5 text-center text-xs font-black rounded-lg ${selectedPaymentMethod === 'naira' ? 'bg-white text-[#121212]' : 'text-gray-400'}` }, 'Naira Account')
      ]),
      e('div', { className: 'flex-1 space-y-4' }, [
        selectedPaymentMethod === 'crypto' && e('div', { className: 'bg-[#F8F8FA] border rounded-2xl p-5 space-y-3' }, [
          e('div', { className: 'text-xs font-mono break-all bg-white p-3 border rounded-xl' }, 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'),
          e('p', { className: 'text-[11px] text-gray-400 font-medium' }, 'Transfer exactly $25.00 worth of BTC to activate registration.')
        ]),
        selectedPaymentMethod === 'naira' && e('div', { className: 'bg-[#F8F8FA] border rounded-2xl p-5 space-y-2 text-xs font-bold text-gray-800' }, [
          e('div', { className: 'flex justify-between' }, [e('span', { className: 'text-gray-400' }, 'Bank:'), e('span', null, 'Wema Bank')]),
          e('div', { className: 'flex justify-between' }, [e('span', { className: 'text-gray-400' }, 'Account:'), e('span', null, '0123456789')]),
          e('div', { className: 'flex justify-between' }, [e('span', { className: 'text-gray-400' }, 'Amount:'), e('span', null, '₦37,500')])
        ])
      ]),
      e('button', { onClick: handleConfirmCreatorPayment, className: 'w-full bg-neutral-900 text-white font-black py-4 rounded-xl text-sm uppercase' }, 'I Have Paid')
    ]);
  }

  if (currentPage === 'signup_viewer') {
    return e('div', { className: 'min-h-screen bg-white text-[#121212] max-w-md mx-auto flex flex-col p-6 shadow-md relative' }, [
      renderAdminToggleButton(),
      isAdminViewOpen && renderInlineAdminController(),
      e('button', { onClick: () => navigateTo('choose_track'), className: 'flex items-center text-xs font-bold text-gray-400 mt-4 mb-6 uppercase tracking-wider' }, '← Back'),
      e('h2', { className: 'text-3xl font-black tracking-tight mb-1' }, 'Setup Viewer Profile'),
      e('div', { className: 'space-y-4 flex-1' }, [
        e('input', { type: 'text', value: fullName, onChange: e => setFullName(e.target.value), placeholder: 'Full Name', className: 'w-full px-4 py-3.5 bg-[#F8F8FA] rounded-xl text-sm font-medium focus:outline-none' }),
        e('input', { type: 'email', value: email, onChange: e => setEmail(e.target.value), placeholder: 'Email Address', className: 'w-full px-4 py-3.5 bg-[#F8F8FA] rounded-xl text-sm font-medium focus:outline-none' }),
        e('input', { type: 'password', value: password, onChange: e => setPassword(e.target.value), placeholder: 'Password', className: 'w-full px-4 py-3.5 bg-[#F8F8FA] rounded-xl text-sm font-medium focus:outline-none' }),
        e('button', { onClick: handleAuthViewer, className: 'w-full bg-[#121212] text-white font-black py-4 rounded-xl text-sm' }, 'Create Free Account')
      ])
    ]);
  }

  // DEFAULT PROTECTION RENDER GATE
  return e('div', { className: 'min-h-screen bg-[#121212] text-white max-w-md mx-auto flex flex-col justify-between p-6 shadow-md relative' }, [
    renderAdminToggleButton(),
    isAdminViewOpen && renderInlineAdminController(),
    e('div', { className: 'flex-1 flex flex-col justify-center items-center text-center space-y-5' }, [
      e('div', { className: 'w-16 h-16 bg-white text-[#121212] rounded-2xl flex items-center justify-center shadow-md font-black text-2xl' }, 'F'),
      e('h1', { className: 'text-3xl font-black tracking-tight' }, 'FATSOCIAL'),
      e('p', { className: 'text-xs text-gray-400 max-w-xs' }, 'Connect directly with premium elite skills marketplaces.')
    ]),
    e('div', { className: 'space-y-3 pb-6' }, [
      e('button', { onClick: () => navigateTo('choose_track'), className: 'w-full bg-white text-[#121212] font-bold py-4 rounded-xl text-sm shadow-sm' }, 'Create Account'),
      e('button', { onClick: () => navigateTo('signin'), className: 'w-full bg-transparent border border-white/20 font-bold py-4 rounded-xl text-sm text-white text-center' }, 'Sign In Account')
    ])
  ]);
}

const root = window.ReactDOM.createRoot(document.getElementById('root'));
root.render(e(App));
