// Grab React elements directly from the mobile window context
const { useState, useEffect } = window.React;
const e = window.React.createElement;

function App() {
  // --- 1. MEMORY AND SESSION STATE ENGINE ---
  const [currentPage, setCurrentPage] = useState(() => localStorage.getItem('fatsocial_page') || 'landing');
  const [userRole, setUserRole] = useState(() => localStorage.getItem('fatsocial_role') || '');
  const [fatcoinBalance, setFatcoinBalance] = useState(() => parseInt(localStorage.getItem('fatsocial_coins')) || 150);
  const [creatorEarnings, setCreatorEarnings] = useState(() => parseFloat(localStorage.getItem('fatsocial_creator_earnings')) || 0.00);

  // Layout & Global View Configurations
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  
  // --- USER SOCIAL GRAPH DATABASES ---
  const [followingCreators, setFollowingCreators] = useState(() => JSON.parse(localStorage.getItem('fatsocial_following')) || ['Alex Rivers', 'Jordan Sage']);
  const [followersCreators, setFollowersCreators] = useState(() => JSON.parse(localStorage.getItem('fatsocial_followers')) || ['Taylor Morgan']);
  const [subscribedCreators, setSubscribedCreators] = useState(() => JSON.parse(localStorage.getItem('fatsocial_subs')) || ['Alex Rivers']);
  
  // --- PREMIUM TAB NAVIGATION ROUTER ---
  const [creatorTab, setCreatorTab] = useState(() => localStorage.getItem('fatsocial_creator_tab') || 'home');
  const [feedFilter, setFeedFilter] = useState('all'); // 'all' | 'following' | 'subscribed'

  // Registration and Authentication Form Fields State Cache
  const [fullName, setFullName] = useState(() => localStorage.getItem('fatsocial_cache_name') || '');
  const [email, setEmail] = useState(() => localStorage.getItem('fatsocial_cache_email') || '');
  const [password, setPassword] = useState(() => localStorage.getItem('fatsocial_cache_pass') || '');
  const [paymentStatus, setPaymentStatus] = useState(() => localStorage.getItem('fatsocial_pay_status') || 'idle'); 
  const [isAdminViewOpen, setIsAdminViewOpen] = useState(false);

  // --- MOCK DATABASE FOR LIVE SCROLLABLE FEED ---
  // Tracks: New Account creators, Logged-back-in creators, Follows/Followers, and Subscriptions
  const [posts, setPosts] = useState([
    {
      id: 'p1',
      creator: 'Alex Rivers',
      handle: '@alexrivers_studio',
      type: 'subscribed',
      content: 'Just uploaded the raw design architecture templates for the FATSOCIAL dashboard UI layout. Premium subscribers get direct access to the asset file pool today! Let me know your thoughts.',
      timestamp: '10m ago',
      likes: 42,
      isLiked: false
    },
    {
      id: 'p2',
      creator: 'Jordan Sage',
      handle: '@jordansage_code',
      type: 'following',
      content: 'Successfully configured the secure multi-currency routing nodes for cross-border settlements. Infrastructure tests are reading perfectly clean. 🚀',
      timestamp: '2h ago',
      likes: 19,
      isLiked: false
    },
    {
      id: 'p3',
      creator: 'Taylor Morgan',
      handle: '@taylor_m_design',
      type: 'follower',
      content: 'Just logged back into the environment! Spinning up a live brand identity curation catalog over the next hour. Hit the tip node if you are tuning in.',
      timestamp: '4h ago',
      likes: 31,
      isLiked: false
    },
    {
      id: 'p4',
      creator: 'Casey Vance',
      handle: '@casey_vance_new',
      type: 'new_account',
      content: 'Account setup complete! Excited to join the platform ecosystem. Looking forward to dropping our decentralized media asset libraries here soon.',
      timestamp: 'Just Now',
      likes: 3,
      isLiked: false
    }
  ]);

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
    localStorage.setItem('fatsocial_following', JSON.stringify(followingCreators));
    localStorage.setItem('fatsocial_followers', JSON.stringify(followersCreators));
    localStorage.setItem('fatsocial_subs', JSON.stringify(subscribedCreators));
    localStorage.setItem('fatsocial_pay_status', paymentStatus);
    localStorage.setItem('fatsocial_tasks_database', JSON.stringify(tasks));
    localStorage.setItem('fatsocial_creator_tab', creatorTab);
    
    localStorage.setItem('fatsocial_cache_name', fullName);
    localStorage.setItem('fatsocial_cache_email', email);
    localStorage.setItem('fatsocial_cache_pass', password);
  }, [currentPage, userRole, fatcoinBalance, creatorEarnings, followingCreators, followersCreators, subscribedCreators, paymentStatus, tasks, creatorTab, fullName, email, password]);

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
          
          alert(`Verification Complete!\nAccess granted to your creator account dashboard workspace.`);
          setCurrentPage('dashboard');
        }
      }, 1500);
    }
    return () => { if (checkInterval) clearInterval(checkInterval); };
  }, [paymentStatus]);

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  const handleLogout = () => {
    setIsSidebarOpen(false);
    setUserRole('');
    setPaymentStatus('idle');
    setCreatorTab('home');
    localStorage.removeItem('fatsocial_admin_approved_trigger');
    navigateTo('landing');
  };

  const triggerCreatorPaymentModal = () => {
    if (!fullName || !email || !password) return;
    navigateTo('payment_creator');
  };

  const handleConfirmCreatorPayment = () => {
    setPaymentStatus('verifying');
  };

  const handleAuthViewer = () => {
    if (!fullName || !email || !password) return;
    setUserRole('viewer');
    navigateTo('dashboard');
  };

  const openSubmissionDrawer = (task) => {
    setActiveSubmissionTask(task);
    setTypedProofUrl('');
  };

  const handleExecuteProofSubmission = () => {
    if (!typedProofUrl.trim()) return;
    setTasks(prev => prev.map(t => t.id === activeSubmissionTask.id ? { ...t, status: 'pending', proofUrl: typedProofUrl } : t));
    setActiveSubmissionTask(null);
  };

  const handleAdminApproveTask = (taskId, rewardValue) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'approved' } : t));
    setCreatorEarnings(prev => prev + rewardValue);
  };

  const toggleLikePost = (postId) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 };
      }
      return p;
    }));
  };

  // --- FLOATING ADMINISTRATIVE CONTROL PANEL OVERLAY ---
  const renderInlineAdminController = () => {
    const hasPendingUser = paymentStatus === 'verifying' && fullName && email;
    const pendingTasks = tasks.filter(t => t.status === 'pending');

    return e('div', { className: 'fixed bottom-24 left-1/2 -translate-x-1/2 bg-neutral-900 border border-neutral-700 text-white text-xs p-4 rounded-2xl shadow-2xl z-[9999] w-[90%] max-w-xs space-y-3' }, [
      e('div', { className: 'flex justify-between items-center border-b border-neutral-800 pb-1.5' }, [
        e('span', { className: 'font-black text-white uppercase text-[10px]' }, '🛠️ Admin Control Panel'),
        e('button', { onClick: () => setIsAdminViewOpen(false), className: 'text-neutral-500 font-bold px-1 text-sm' }, '✕')
      ]),
      hasPendingUser && e('div', { className: 'space-y-2' }, [
        e('button', { 
          onClick: () => localStorage.setItem('fatsocial_admin_approved_trigger', 'true'),
          className: 'w-full bg-white text-black font-black py-2 rounded-xl text-[11px] uppercase'
        }, 'Approve Creator Registration')
      ]),
      pendingTasks.map(t => e('div', { key: t.id, className: 'bg-neutral-950 p-2 rounded-xl' }, [
        e('button', { onClick: () => handleAdminApproveTask(t.id, t.reward), className: 'w-full bg-white text-black font-black py-1 rounded-lg text-[10px]' }, `Approve $${t.reward} Payout`)
      ]))
    ]);
  };

  const renderAdminToggleButton = () => (
    e('button', { 
      onClick: () => setIsAdminViewOpen(!isAdminViewOpen),
      className: 'fixed top-2 right-2 opacity-10 bg-transparent text-white text-[10px] z-[9999] px-2 py-1'
    }, '• admin')
  );

  // --- 🏠 LIVE SCROLLABLE CONTENT FEED VIEW (HOME TAB) ---
  const renderHomeTab = () => {
    const filteredPosts = posts.filter(post => {
      if (feedFilter === 'following') {
        return followingCreators.includes(post.creator) || followersCreators.includes(post.creator);
      }
      if (feedFilter === 'subscribed') {
        return subscribedCreators.includes(post.creator);
      }
      return true; 
    });

    return e('div', { className: 'flex flex-col h-full animate-fade-in' }, [
      e('div', { className: 'bg-white border-b border-neutral-100 px-4 pt-4 pb-3 sticky top-0 z-30' }, [
        e('div', { className: 'flex justify-between items-center mb-4' }, [
          e('h1', { className: 'text-xl font-black tracking-tight text-neutral-950' }, 'FATSOCIAL'),
          e('div', { className: 'bg-neutral-50 border border-neutral-200/60 rounded-full px-3 py-1 flex items-center space-x-1.5' }, [
            e('span', { className: 'w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse' }),
            e('span', { className: 'text-[10px] font-mono font-black uppercase text-neutral-600' }, 'Live Network Feed')
          ])
        ]),

        // Horizontal Activity Loop
        e('div', { className: 'flex space-x-3 overflow-x-auto pb-2 scrollbar-none' }, [
          { name: 'You', status: 'Online', border: 'border-neutral-950' },
          { name: 'Alex R.', status: 'Subscribed', border: 'border-neutral-950 bg-neutral-950 text-white' },
          { name: 'Jordan S.', status: 'Following', border: 'border-neutral-300' },
          { name: 'Taylor M.', status: 'Follower', border: 'border-neutral-300' },
          { name: 'Casey V.', status: 'New Creator', border: 'border-neutral-200 dashed' }
        ].map((actor, idx) => e('div', { key: idx, className: 'flex flex-col items-center flex-shrink-0 space-y-1' }, [
          e('div', { className: `w-11 h-11 rounded-xl border flex items-center justify-center font-black text-xs ${actor.border}` }, actor.name.charAt(0)),
          e('span', { className: 'text-[9px] font-medium text-neutral-400 max-w-[52px] truncate text-center' }, actor.name)
        ]))),

        // Filter Tabs
        e('div', { className: 'grid grid-cols-3 gap-1 bg-neutral-100 p-0.5 rounded-lg mt-2' }, [
          { id: 'all', label: 'All Activity' },
          { id: 'following', label: 'Network' },
          { id: 'subscribed', label: 'Subscribed' }
        ].map(filterBtn => e('button', {
          key: filterBtn.id,
          onClick: () => setFeedFilter(filterBtn.id),
          className: `py-1.5 text-[11px] font-black rounded-md uppercase tracking-wider transition-all ${feedFilter === filterBtn.id ? 'bg-white text-neutral-950 shadow-3xs' : 'text-neutral-400'}`
        }, filterBtn.label)))
      ]),

      // Scrollable Feed List 
      e('div', { className: 'p-4 space-y-4 overflow-y-auto flex-1' }, 
        filteredPosts.length === 0 ? [
          e('div', { className: 'bg-white border rounded-2xl p-8 text-center text-xs text-neutral-400 font-medium' }, 'No active content posts match this filter node.')
        ] : filteredPosts.map(post => {
          let statusBadge = '● Active';
          if (subscribedCreators.includes(post.creator)) statusBadge = '◆ Subscribed';
          else if (followingCreators.includes(post.creator)) statusBadge = '✓ Following';
          else if (followersCreators.includes(post.creator)) statusBadge = '👥 Follower';
          else if (post.type === 'new_account') statusBadge = '✨ New Creator';

          return e('div', { key: post.id, className: 'bg-white border border-neutral-200/70 rounded-[20px] p-4 shadow-3xs space-y-3' }, [
            e('div', { className: 'flex justify-between items-center' }, [
              e('div', { className: 'flex items-center space-x-2.5' }, [
                e('div', { className: 'w-9 h-9 bg-neutral-900 text-white font-black text-xs rounded-lg flex items-center justify-center' }, post.creator.charAt(0)),
                e('div', null, [
                  e('div', { className: 'font-black text-xs text-neutral-950 tracking-tight' }, post.creator),
                  e('div', { className: 'text-[10px] font-medium text-neutral-400' }, post.handle)
                ])
              ]),
              e('span', { className: `text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wide ${statusBadge.includes('Subscribed') ? 'bg-neutral-950 text-white' : 'bg-neutral-50 text-neutral-500 border border-neutral-200'}` }, statusBadge)
            ]),

            e('p', { className: 'text-xs text-neutral-800 leading-relaxed font-medium' }, post.content),

            e('div', { className: 'flex justify-between items-center pt-2 border-t border-neutral-50 text-[11px] font-bold text-neutral-400' }, [
              e('span', null, post.timestamp),
              e('div', { className: 'flex space-x-4' }, [
                e('button', { 
                  onClick: () => toggleLikePost(post.id),
                  className: `flex items-center space-x-1 uppercase tracking-wide text-[10px] font-black ${post.isLiked ? 'text-neutral-950' : 'text-neutral-400'}` 
                }, [
                  e('span', null, post.isLiked ? '♥' : '♡'),
                  e('span', null, post.likes)
                ]),
                e('button', { onClick: () => alert('Token tipped to creator account ledger.'), className: 'hover:text-neutral-900 uppercase tracking-wide text-[10px] font-black' }, '🪙 Tip')
              ])
            ])
          ]);
        })
      )
    ]);
  };

  const renderSearchTab = () => e('div', { className: 'p-5 space-y-4 animate-fade-in' }, [
    e('div', { className: 'relative' }, [
      e('input', { type: 'text', placeholder: 'Search tasks, sound pools, or creators...', className: 'w-full bg-white border border-neutral-200 rounded-xl px-4 py-3.5 text-xs font-medium focus:outline-none focus:border-neutral-950' })
    ]),
    e('p', { className: 'text-[10px] font-black text-neutral-400 uppercase tracking-wider pl-1' }, 'Active Platforms Catalog'),
    e('div', { className: 'grid grid-cols-2 gap-3' }, ['TikTok Media', 'Facebook Video', 'Instagram Reach', 'Premium Sounds'].map(tag => e('div', { key: tag, className: 'bg-white p-4 rounded-xl border border-neutral-100 text-xs font-black text-neutral-800 text-center shadow-3xs' }, tag)))
  ]);

  const renderChatsTab = () => e('div', { className: 'p-5 space-y-3 animate-fade-in' }, [
    e('h2', { className: 'font-black text-xl tracking-tight text-neutral-900 mb-2 pl-1' }, 'Messages'),
    e('div', { className: 'bg-white rounded-2xl border border-neutral-100 divide-y divide-neutral-100' }, [
      { name: 'System Auditor', msg: 'Your professional framework access has been successfully configured.', time: 'Just Now' },
      { name: 'Campaign Desk Node', msg: 'New monetization opportunities match your deployment tracking criteria.', time: '4h ago' }
    ].map((chat, idx) => e('div', { key: idx, className: 'p-4 flex justify-between items-center cursor-pointer active:bg-neutral-50/50' }, [
      e('div', { className: 'space-y-0.5 flex-1 pr-2' }, [e('div', { className: 'font-black text-xs text-neutral-900' }, chat.name), e('p', { className: 'text-[11px] text-neutral-400 font-medium truncate max-w-[220px]' }, chat.msg)]),
      e('span', { className: 'text-[9px] font-bold text-neutral-400' }, chat.time)
    ])))
  ]);

  const renderMyProfileTab = () => e('div', { className: 'p-5 space-y-4 animate-fade-in' }, [
    e('div', { className: 'bg-white border border-neutral-200/80 rounded-[24px] p-6 text-center space-y-4 shadow-3xs' }, [
      e('div', { className: 'w-16 h-16 bg-neutral-900 text-white rounded-2xl mx-auto flex items-center justify-center font-black text-xl shadow-sm' }, fullName ? fullName.charAt(0).toUpperCase() : 'F'),
      e('div', { className: 'space-y-0.5' }, [e('h2', { className: 'font-black text-base text-neutral-900 tracking-tight' }, fullName || 'FATSOCIAL Creator'), e('p', { className: 'text-[11px] text-neutral-400 font-mono font-medium' }, email || 'account@fatsocial.github.io')]),
      e('div', { className: 'pt-3 border-t border-neutral-100 flex justify-around text-center' }, [['Verification', 'Active ✔️'], ['Tier Class', 'Premium Pro']].map(([lbl, val]) => e('div', { key: lbl }, [e('span', { className: 'block text-[9px] font-black text-neutral-400 uppercase tracking-wider mb-0.5' }, lbl), e('span', { className: 'text-xs font-black text-neutral-900' }, val)])))
    ]),
    e('button', { onClick: handleLogout, className: 'w-full bg-neutral-50 text-neutral-900 border border-neutral-200 font-black py-3.5 rounded-xl text-xs uppercase tracking-wide shadow-3xs active:scale-98 transition-transform' }, 'Log Out System Session')
  ]);

  const renderMonetizationTab = () => e('div', { className: 'animate-fade-in' }, [
    e('div', { className: 'bg-[#121212] text-white px-5 pt-8 pb-6 rounded-b-[24px] relative bg-gradient-to-b from-neutral-900 to-black shadow-lg' }, [
      e('div', { className: 'flex justify-between items-center mb-5' }, [e('button', { onClick: () => setCreatorTab('my_profile'), className: 'text-white text-xl font-medium focus:outline-none' }, '‹'), e('div', { className: 'flex space-x-4 items-center' }, [e('span', { className: 'text-white text-lg cursor-pointer' }, '🏳️'), e('span', { className: 'text-white text-lg cursor-pointer' }, '⚙️')])]),
      e('div', { className: 'space-y-1' }, [e('div', { className: 'text-sm font-semibold text-gray-400/80 tracking-wide' }, 'Monetization'), e('div', { className: 'flex items-center space-x-1.5' }, [e('span', { className: 'text-3xl font-black tracking-tight' }, `$${creatorEarnings.toFixed(2)}`), e('span', { className: 'text-gray-400 font-bold text-sm pt-1' }, '›')]), e('div', { className: 'text-[11px] text-gray-500 font-medium flex items-center space-x-1' }, [e('span', null, 'Estimated rewards in the last 7 days'), e('span', { className: 'w-3 h-3 rounded-full border border-gray-600 inline-flex items-center justify-center text-[8px] text-gray-400' }, 'i')])]),
      e('div', { className: 'mt-5 bg-white/[0.06] backdrop-blur-md border border-white/5 rounded-xl px-4 py-3 flex justify-between items-center text-xs font-semibold' }, [e('div', { className: 'text-gray-300' }, `Balance: $${creatorEarnings.toFixed(2)}`), e('div', { className: 'text-gray-400 font-bold flex items-center' }, ['View ', e('span', { className: 'text-[10px] pl-0.5' }, '›')])])
    ]),
    e('div', { className: 'bg-white mt-3 p-4 border-b border-gray-100 flex flex-col space-y-3 shadow-xs' }, [e('div', { className: 'flex justify-between items-center' }, [e('h3', { className: 'font-black text-sm tracking-tight text-gray-900' }, 'Rewards analytics'), e('span', { className: 'text-xs font-bold text-gray-400 flex items-center' }, ['View all ', e('span', { className: 'text-[9px] pl-0.5' }, '›')])]), e('div', { className: 'bg-[#F8F8FA] rounded-xl p-4 space-y-1 border border-gray-50/50' }, [e('div', { className: 'text-xl font-black tracking-tight text-gray-900' }, `$${creatorEarnings.toFixed(2)}`), e('div', { className: 'text-[11px] text-gray-500 font-semibold' }, 'LIVE rewards'), e('div', { className: 'text-[11px] text-gray-400 font-bold' }, '0.0% 7d')])]),
    e('div', { className: 'bg-white mt-3 p-4 border-b border-gray-100 space-y-3' }, [e('h3', { className: 'font-black text-sm tracking-tight text-gray-900' }, 'Active programs'), e('div', { className: 'flex flex-col items-start space-y-1.5' }, [e('div', { className: 'w-11 h-11 bg-[#F8F8FA] rounded-xl flex items-center justify-center border border-gray-100 shadow-2xs' }, '🎁'), e('span', { className: 'text-[11px] font-black text-gray-900 tracking-tight' }, 'LIVE rewards')])]),
    e('div', { className: 'bg-white mt-3 p-4 space-y-3' }, [
      e('div', { className: 'flex justify-between items-center mb-1' }, [e('div', { className: 'flex items-center space-x-1' }, [e('h3', { className: 'font-black text-sm tracking-tight text-gray-900' }, 'Programs for you'), e('span', { className: 'w-3 h-3 rounded-full border border-gray-300 inline-flex items-center justify-center text-[8px] text-gray-400 font-bold' }, 'i')]), e('span', { className: 'text-xs font-bold text-gray-400 flex items-center' }, ['View all ', e('span', { className: 'text-[9px] pl-0.5' }, '›')])]),
      tasks.map(task => {
        let actionColorText = 'text-gray-400';
        if (task.status === 'pending' || task.status === 'approved') actionColorText = 'text-neutral-900 font-bold';
        return e('div', { key: task.id, onClick: () => task.status === 'available' && openSubmissionDrawer(task), className: 'flex items-start justify-between py-3 border-b border-gray-100 last:border-0 cursor-pointer active:bg-gray-50/50 rounded-lg px-1' }, [
          e('div', { className: 'flex space-x-3 items-start flex-1 pr-2' }, [e('div', { className: 'text-lg pt-0.5' }, task.network === 'TikTok' ? '🎵' : task.network === 'Facebook' ? '🧰' : '⭐'), e('div', { className: 'space-y-0.5 flex-1' }, [e('div', { className: 'flex items-center space-x-2' }, [e('h4', { className: 'font-black text-[13px] text-gray-900 tracking-tight' }, task.title), e('span', { className: 'bg-gray-100 text-gray-500 text-[9px] font-black px-1.5 py-0.5 rounded flex items-center space-x-0.5' }, [e('span', { className: 'text-[7px]' }, '🔒'), e('span', null, task.lockStatus)])]), e('p', { className: 'text-[11px] text-gray-400 font-medium leading-normal' }, task.desc), task.status === 'pending' && e('div', { className: 'text-[9px] font-mono text-neutral-800 pt-1 truncate max-w-[200px]' }, `Awaiting Verification Link...`), task.status === 'approved' && e('div', { className: 'text-[9px] font-bold text-neutral-900 pt-1' }, '✓ Payout credited to balance')])]),
          e('div', { className: 'flex items-center space-x-1 self-center text-xs' }, [task.status === 'available' ? e('span', { className: 'text-xs text-gray-300 font-bold' }, '›') : e('span', { className: `text-[10px] ${actionColorText}` }, task.status)])
        ]);
      })
    ])
  ]);

  if (paymentStatus === 'verifying') {
    return e('div', { className: 'min-h-screen bg-white text-[#121212] max-w-md mx-auto flex flex-col items-center justify-center p-6 text-center relative' }, [
      renderAdminToggleButton(), isAdminViewOpen && renderInlineAdminController(),
      e('div', { className: 'w-12 h-12 border-4 border-neutral-100 border-t-neutral-950 rounded-full animate-spin' }),
      e('div', { className: 'space-y-2 mt-4' }, [e('h3', { className: 'font-black text-xl tracking-tight' }, 'Awaiting Verification'), e('p', { className: 'text-xs text-gray-400 px-6 font-medium' }, 'Please hold on while our automated system checks your submission setup fee status.')])
    ]);
  }

  if (currentPage === 'dashboard') {
    return e('div', { className: 'min-h-screen bg-[#F4F4F6] text-[#121212] max-w-md mx-auto relative pb-24 font-sans flex flex-col justify-between overflow-x-hidden' }, [
      e('div', { className: 'flex-1 w-full overflow-y-auto' }, [
        creatorTab === 'home' && renderHomeTab(),
        creatorTab === 'search' && renderSearchTab(),
        creatorTab === 'monetization' && renderMonetizationTab(),
        creatorTab === 'chats' && renderChatsTab(),
        creatorTab === 'my_profile' && renderMyProfileTab()
      ]),

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
          className: 'flex flex-col items-center justify-center py-0.5 rounded-xl transition-all relative ' + (isCurrent ? 'text-black scale-105 font-black' : 'text-neutral-400 font-medium')
        }, [
          e('span', { className: 'text-[18px] mb-0.5 transition-all', style: { color: isCurrent ? '#000000' : '#A3A3A3' } }, isCurrent ? tab.boldIcon : tab.outlineIcon),
          e('span', { className: 'text-[9px] uppercase tracking-wider font-bold' }, tab.label),
          isCurrent && e('div', { className: 'absolute -bottom-1 w-1.5 h-1.5 bg-black rounded-full' })
        ]);
      })),

      activeSubmissionTask && e('div', { className: 'fixed inset-0 bg-black/60 z-50 flex items-end justify-center p-4' }, [
        e('div', { className: 'bg-white w-full rounded-t-3xl p-6 space-y-4 max-w-md' }, [
          e('button', { onClick: () => setActiveSubmissionTask(null), className: 'text-neutral-400 font-black float-right' }, '✕'),
          e('h3', { className: 'font-black text-base' }, 'Verify Performance Asset'),
          e('input', { type: 'url', value: typedProofUrl, onChange: e => setTypedProofUrl(e.target.value), placeholder: 'https://example.com/submission-url', className: 'w-full px-4 py-3 bg-[#F8F8FA] border rounded-xl text-xs focus:outline-none' }),
          e('button', { onClick: handleExecuteProofSubmission, className: 'w-full bg-[#121212] text-white font-black py-3.5 rounded-xl text-xs uppercase' }, 'Lock Submission Link')
        ])
      ])
    ]);
  }

  if (currentPage === 'choose_track') {
    return e('div', { className: 'min-h-screen bg-white text-[#121212] max-w-md mx-auto flex flex-col p-6 shadow-md' }, [
      e('button', { onClick: () => navigateTo('landing'), className: 'flex items-center text-xs font-bold text-gray-400 mt-4 mb-6 uppercase tracking-wider' }, '← Back'),
      e('h2', { className: 'text-3xl font-black tracking-tight mb-6' }, 'Choose Account Type'),
      e('div', { className: 'space-y-4 flex-1' }, [
        e('div', { onClick: () => navigateTo('signup_creator'), className: 'border-2 border-[#121212] p-5 rounded-2xl cursor-pointer bg-white' }, [e('h3', { className: 'font-black text-base mb-1' }, '🏆 Content Creator'), e('p', { className: 'text-xs text-gray-500 font-medium' }, 'Access analytics dashboards, live feeds, earn project rewards, and build matching follower circles.')]),
        e('div', { onClick: () => navigateTo('signup_viewer'), className: 'border border-neutral-200 p-5 rounded-2xl cursor-pointer bg-white' }, [e('h3', { className: 'font-black text-base mb-1' }, '👁️ Standard Viewer'), e('p', { className: 'text-xs text-gray-500 font-medium' }, 'Discover premium showcases, subscribe to creators, and interact via network token systems.')])
      ])
    ]);
  }

  if (currentPage === 'signin') {
    return e('div', { className: 'min-h-screen bg-white text-[#121212] max-w-md mx-auto flex flex-col p-6 shadow-md' }, [
      e('button', { onClick: () => navigateTo('landing'), className: 'flex items-center text-xs font-bold text-gray-400 mt-4 mb-6 uppercase tracking-wider' }, '← Back'),
      e('h2', { className: 'text-3xl font-black tracking-tight mb-6' }, 'Welcome Back'),
      e('div', { className: 'space-y-4 flex-1' }, [
        e('input', { type: 'email', value: email, onChange: e => setEmail(e.target.value), placeholder: 'name@example.com', className: 'w-full px-4 py-3.5 bg-[#F8F8FA] rounded-xl text-sm focus:outline-none' }),
        e('input', { type: 'password', value: password, onChange: e => setPassword(e.target.value), placeholder: 'Enter your password', className: 'w-full px-4 py-3.5 bg-[#F8F8FA] rounded-xl text-sm focus:outline-none' }),
        e('button', { onClick: () => { setUserRole('creator'); navigateTo('dashboard'); }, className: 'w-full bg-[#121212] text-white font-black py-4 rounded-xl text-sm mt-2' }, 'Sign In Account')
      ])
    ]);
  }

  if (currentPage === 'signup_creator') {
    return e('div', { className: 'min-h-screen bg-white text-[#121212] max-w-md mx-auto flex flex-col p-6 shadow-md' }, [
      e('button', { onClick: () => navigateTo('choose_track'), className: 'flex items-center text-xs font-bold text-gray-400 mt-4 mb-6 uppercase tracking-wider' }, '← Back'),
      e('h2', { className: 'text-3xl font-black tracking-tight mb-6' }, 'Create Creator Account'),
      e('div', { className: 'space-y-4 flex-1' }, [
        e('input', { type: 'text', value: fullName, onChange: e => setFullName(e.target.value), placeholder: 'Full Name', className: 'w-full px-4 py-3.5 bg-[#F8F8FA] rounded-xl text-sm focus:outline-none' }),
        e('input', { type: 'email', value: email, onChange: e => setEmail(e.target.value), placeholder: 'name@example.com', className: 'w-full px-4 py-3.5 bg-[#F8F8FA] rounded-xl text-sm focus:outline-none' }),
        e('input', { type: 'password', value: password, onChange: e => setPassword(e.target.value), placeholder: 'Create password', className: 'w-full px-4 py-3.5 bg-[#F8F8FA] rounded-xl text-sm focus:outline-none' }),
        e('div', { className: 'bg-[#F8F8FA] p-4 rounded-xl flex items-center justify-between text-xs mt-2 border' }, [e('span', { className: 'font-bold text-sm' }, 'One-Time Setup Fee'), e('span', { className: 'text-base font-black' }, '$25.00')]),
        e('button', { onClick: triggerCreatorPaymentModal, className: 'w-full bg-[#121212] text-white font-black py-4 rounded-xl text-sm mt-2' }, 'Pay Fee & Complete Setup')
      ])
    ]);
  }

  if (currentPage === 'payment_creator') {
    return e('div', { className: 'min-h-screen bg-white text-[#121212] max-w-md mx-auto flex flex-col p-6 shadow-md' }, [
      e('button', { onClick: () => navigateTo('signup_creator'), className: 'flex items-center text-xs font-bold text-gray-400 mt-4 mb-6 uppercase tracking-wider' }, '← Back'),
      e('h2', { className: 'text-2xl font-black tracking-tight mb-4' }, 'Complete Setup Fee'),
      e('div', { className: 'bg-[#F8F8FA] border rounded-2xl p-5 space-y-3 flex-1' }, [
        e('div', { className: 'text-xs font-mono break-all bg-white p-3 border rounded-xl' }, 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'),
        e('p', { className: 'text-[11px] text-gray-400 font-medium' }, 'Transfer exactly $25.00 worth of BTC to activate platform registration variables.')
      ]),
      e('button', { onClick: handleConfirmCreatorPayment, className: 'w-full bg-neutral-900 text-white font-black py-4 rounded-xl text-sm uppercase' }, 'I Have Paid')
    ]);
  }

  if (currentPage === 'signup_viewer') {
    return e('div', { className: 'min-h-screen bg-white text-[#121212] max-w-md mx-auto flex flex-col p-6 shadow-md' }, [
      e('button', { onClick: () => navigateTo('choose_track'), className: 'flex items-center text-xs font-bold text-gray-400 mt-4 mb-6 uppercase tracking-wider' }, '← Back'),
      e('h2', { className: 'text-3xl font-black tracking-tight mb-6' }, 'Setup Viewer Profile'),
      e('div', { className: 'space-y-4 flex-1' }, [
        e('input', { type: 'text', value: fullName, onChange: e => setFullName(e.target.value), placeholder: 'Full Name', className: 'w-full px-4 py-3.5 bg-[#F8F8FA] rounded-xl text-sm focus:outline-none' }),
        e('input', { type: 'email', value: email, onChange: e => setEmail(e.target.value), placeholder: 'Email Address', className: 'w-full px-4 py-3.5 bg-[#F8F8FA] rounded-xl text-sm focus:outline-none' }),
        e('input', { type: 'password', value: password, onChange: e => setPassword(e.target.value), placeholder: 'Password', className: 'w-full px-4 py-3.5 bg-[#F8F8FA] rounded-xl text-sm focus:outline-none' }),
        e('button', { onClick: handleAuthViewer, className: 'w-full bg-[#121212] text-white font-black py-4 rounded-xl text-sm' }, 'Create Free Account')
      ])
    ]);
  }

  return e('div', { className: 'min-h-screen bg-[#121212] text-white max-w-md mx-auto flex flex-col justify-between p-6 shadow-md' }, [
    e('div', { className: 'flex-1 flex flex-col justify-center items-center text-center space-y-4' }, [e('div', { className: 'w-14 h-14 bg-white text-[#121212] rounded-2xl flex items-center justify-center font-black text-2xl' }, 'F'), e('h1', { className: 'text-3xl font-black tracking-tight' }, 'FATSOCIAL'), e('p', { className: 'text-xs text-gray-400 max-w-xs' }, 'Connect directly with premium elite skills marketplaces.')]),
    e('div', { className: 'space-y-3 pb-6' }, [e('button', { onClick: () => navigateTo('choose_track'), className: 'w-full bg-white text-[#121212] font-bold py-4 rounded-xl text-sm' }, 'Create Account'), e('button', { onClick: () => navigateTo('signin'), className: 'w-full bg-transparent border border-white/20 font-bold py-4 rounded-xl text-sm text-white' }, 'Sign In Account')])
  ]);
}

const root = window.ReactDOM.createRoot(document.getElementById('root'));
root.render(e(App));
