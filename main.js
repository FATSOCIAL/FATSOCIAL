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
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isAdminViewOpen, setIsAdminViewOpen] = useState(false);
  
  // --- PREMIUM TAB NAVIGATION ROUTER ---
  const [creatorTab, setCreatorTab] = useState(() => localStorage.getItem('fatsocial_creator_tab') || 'home');
  const [feedFilter, setFeedFilter] = useState('all'); 

  // Registration and Authentication Form Fields State Cache
  const [fullName, setFullName] = useState(() => localStorage.getItem('fatsocial_cache_name') || 'William Hudson');
  const [email, setEmail] = useState(() => localStorage.getItem('fatsocial_cache_email') || 'william.hudson@fatsocial.io');
  const [password, setPassword] = useState(() => localStorage.getItem('fatsocial_cache_pass') || '');
  const [paymentStatus, setPaymentStatus] = useState(() => localStorage.getItem('fatsocial_pay_status') || 'idle'); 

  // --- EXTENDED USER METADATA PROFILE STATES ---
  const [profileGender, setProfileGender] = useState(() => localStorage.getItem('fatsocial_prof_gender') || 'Male');
  const [profileLifestyle, setProfileLifestyle] = useState(() => localStorage.getItem('fatsocial_prof_life') || 'High-Tier Tech Nomad');
  const [profileService, setProfileService] = useState(() => localStorage.getItem('fatsocial_prof_service') || 'Full-Stack UI Architecture');
  const [profilePreferences, setProfilePreferences] = useState(() => localStorage.getItem('fatsocial_prof_pref') || 'Professional Collaborations & Premium Networking');
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // --- SOCIAL COUNTERS ENGINE ---
  const [followerCount, setFollowerCount] = useState(128);
  const [subscriberCount, setSubscriberCount] = useState(42);

  // --- SEARCH BAR STATE ---
  const [searchQuery, setSearchQuery] = useState('');

  // --- MOCK DATABASE FOR USERS REGISTRY ---
  const [usersRegistry] = useState([
    { username: '@alexrivers_studio', name: 'Alex Rivers', skill: 'Brand Strategy & Visual Curation', role: 'creator' },
    { username: '@jordansage_code', name: 'Jordan Sage', skill: 'Backend Ledger Frameworks', role: 'creator' },
    { username: '@taylor_m_design', name: 'Taylor Morgan', skill: 'UI/UX Interface Optimization', role: 'creator' },
    { username: '@casey_vance_new', name: 'Casey Vance', skill: 'Decentralized Media Pipelines', role: 'creator' }
  ]);

  // --- CHATS INBOX ENGINE ---
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem('fatsocial_chats_v2');
    return saved ? JSON.parse(saved) : [
      {
        id: 'c_admin',
        senderName: 'Platform Admin',
        senderHandle: '@system_auditor',
        messages: [
          { sender: 'admin', text: 'Welcome onboard to FATSOCIAL! Your secure decentralized framework workspace is now fully initialized. You can view tasks, verify earnings balance tracking models, and network directly via token assignments.', time: 'Just Now' }
        ],
        unread: true
      }
    ];
  });
  const [activeChatId, setActiveChatId] = useState(null);
  const [typedMessage, setTypedMessage] = useState('');

  // --- MOCK DATABASE FOR LIVE SCROLLABLE FEED ---
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('fatsocial_posts_v2');
    return saved ? JSON.parse(saved) : [
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
        creator: 'William Hudson',
        handle: '@william_hudson',
        type: 'personal',
        content: 'Successfully refactored the structural modular views inside our Next.js dashboard framework repository.',
        timestamp: '1h ago',
        likes: 12,
        isLiked: false
      },
      {
        id: 'p3',
        creator: 'Jordan Sage',
        handle: '@jordansage_code',
        type: 'following',
        content: 'Successfully configured the secure multi-currency routing nodes for cross-border settlements. Infrastructure tests are reading perfectly clean. 🚀',
        timestamp: '2h ago',
        likes: 19,
        isLiked: false
      }
    ];
  });

  // --- NEW CONTENT CREATOR COMPOSER ---
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');

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
    localStorage.setItem('fatsocial_pay_status', paymentStatus);
    localStorage.setItem('fatsocial_tasks_database', JSON.stringify(tasks));
    localStorage.setItem('fatsocial_creator_tab', creatorTab);
    localStorage.setItem('fatsocial_posts_v2', JSON.stringify(posts));
    localStorage.setItem('fatsocial_chats_v2', JSON.stringify(chats));
    
    localStorage.setItem('fatsocial_cache_name', fullName);
    localStorage.setItem('fatsocial_cache_email', email);
    localStorage.setItem('fatsocial_cache_pass', password);

    localStorage.setItem('fatsocial_prof_gender', profileGender);
    localStorage.setItem('fatsocial_prof_life', profileLifestyle);
    localStorage.setItem('fatsocial_prof_service', profileService);
    localStorage.setItem('fatsocial_prof_pref', profilePreferences);
  }, [currentPage, userRole, fatcoinBalance, creatorEarnings, paymentStatus, tasks, creatorTab, fullName, email, password, profileGender, profileLifestyle, profileService, profilePreferences, posts, chats]);

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

  // --- START A CONVERSATION COST FUNCTION ---
  const handleStartConversation = (targetUser) => {
    const existingChat = chats.find(c => c.senderHandle === targetUser.username);
    if (existingChat) {
      setActiveChatId(existingChat.id);
      setCreatorTab('chats');
      return;
    }

    if (fatcoinBalance < 20) {
      alert(`Insufficient Funds!\nStarting a new conversation requires 20 Fatcoins. Please top up your ledger.`);
      return;
    }

    // Deduct 20 Fatcoins
    setFatcoinBalance(prev => prev - 20);

    const newChat = {
      id: 'c_' + Date.now(),
      senderName: targetUser.name,
      senderHandle: targetUser.username,
      messages: [
        { sender: 'admin', text: `Conversation room unlocked with ${targetUser.name}. [Secure 20 Fatcoins Session Node Allocation Accepted]`, time: 'Just Now' }
      ],
      unread: false
    };

    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setCreatorTab('chats');
  };

  // --- SEND MESSAGE CHAT CONTEXT ---
  const handleSendMessage = () => {
    if (!typedMessage.trim()) return;
    
    setChats(prev => prev.map(c => {
      if (c.id === activeChatId) {
        const updatedMessages = [...c.messages, { sender: 'user', text: typedMessage, time: 'Just Now' }];
        
        // Automated response generation for demonstration loop parity
        setTimeout(() => {
          setChats(currentChats => currentChats.map(item => {
            if (item.id === activeChatId) {
              return {
                ...item,
                messages: [...item.messages, { sender: 'admin', text: `Automated Node Response Received: Echo framework data validation accepted correctly.`, time: 'Just Now' }]
              };
            }
            return item;
          }));
        }, 1200);

        return { ...c, messages: updatedMessages, unread: false };
      }
      return c;
    }));

    setTypedMessage('');
  };

  // --- SUBMIT USER CONTENT POST GENERATOR ---
  const handlePublishPost = () => {
    if (!newPostContent.trim()) return;
    const addedPost = {
      id: 'post_' + Date.now(),
      creator: fullName || 'William Hudson',
      handle: '@william_hudson',
      type: 'personal',
      content: newPostContent,
      timestamp: 'Just Now',
      likes: 0,
      isLiked: false
    };
    setPosts(prev => [addedPost, ...prev]);
    setNewPostContent('');
    setIsCreatePostOpen(false);
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
      if (feedFilter === 'subscribed') return post.type === 'subscribed';
      if (feedFilter === 'following') return post.type === 'following' || post.type === 'personal';
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

        // Filter Tabs
        e('div', { className: 'grid grid-cols-3 gap-1 bg-neutral-100 p-0.5 rounded-lg' }, [
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
        filteredPosts.map(post => (
          e('div', { key: post.id, className: 'bg-white border border-neutral-200/70 rounded-[20px] p-4 shadow-3xs space-y-3' }, [
            e('div', { className: 'flex justify-between items-center' }, [
              e('div', { className: 'flex items-center space-x-2.5' }, [
                e('div', { className: 'w-9 h-9 bg-neutral-900 text-white font-black text-xs rounded-lg flex items-center justify-center' }, post.creator.charAt(0)),
                e('div', null, [
                  e('div', { className: 'font-black text-xs text-neutral-950 tracking-tight' }, post.creator),
                  e('div', { className: 'text-[10px] font-medium text-neutral-400' }, post.handle)
                ])
              ]),
              e('span', { className: 'text-[9px] font-black px-2 py-0.5 bg-neutral-50 text-neutral-500 border border-neutral-200 rounded-md uppercase' }, '● Active')
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
                ])
              ])
            ])
          ])
        ))
      )
    ]);
  };

  // --- 🔍 SPECIFICATION OVERHAUL: SEARCH TAB BY USERNAME ---
  const renderSearchTab = () => {
    const filteredUsers = usersRegistry.filter(user => 
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return e('div', { className: 'p-5 space-y-4 flex flex-col h-full animate-fade-in' }, [
      e('div', { className: 'space-y-1' }, [
        e('h2', { className: 'font-black text-xl tracking-tight text-neutral-950' }, 'Search Network'),
        e('p', { className: 'text-[11px] text-neutral-400 font-medium' }, 'Discover and connect with verified profiles instantly.')
      ]),
      e('div', { className: 'relative' }, [
        e('input', { 
          type: 'text', 
          value: searchQuery,
          onChange: e => setSearchQuery(e.target.value),
          placeholder: 'Search user profiles via username (e.g. @alex)...', 
          className: 'w-full bg-white border border-neutral-200 rounded-xl px-4 py-3.5 text-xs font-medium focus:outline-none focus:border-neutral-950 shadow-3xs' 
        })
      ]),
      e('div', { className: 'flex-1 overflow-y-auto space-y-3 pr-1' }, 
        filteredUsers.length === 0 ? [
          e('div', { className: 'bg-white border rounded-2xl p-8 text-center text-xs text-neutral-400 font-medium' }, 'No matching usernames found in the node matrix.')
        ] : filteredUsers.map(user => (
          e('div', { key: user.username, className: 'bg-white border border-neutral-200/80 rounded-2xl p-4 flex justify-between items-center shadow-3xs' }, [
            e('div', { className: 'space-y-1' }, [
              e('div', { className: 'flex items-center space-x-1.5' }, [
                e('span', { className: 'font-black text-xs text-neutral-900' }, user.name),
                e('span', { className: 'text-[10px] font-mono text-neutral-400' }, user.username)
              ]),
              e('p', { className: 'text-[11px] text-neutral-500 font-medium' }, user.skill)
            ]),
            e('button', { 
              onClick: () => handleStartConversation(user),
              className: 'bg-neutral-950 text-white text-[10px] uppercase font-black tracking-wide px-3 py-2 rounded-xl active:scale-95 transition-all' 
            }, 'Chat [20 🪙]')
          ])
        ))
      )
    ]);
  };

  // --- 💬 SPECIFICATION OVERHAUL: STACKED INBOX MESSAGING NODE ---
  const renderChatsTab = () => {
    if (activeChatId) {
      const openChat = chats.find(c => c.id === activeChatId);
      return e('div', { className: 'flex flex-col h-full bg-white animate-fade-in' }, [
        // Chat Window Header
        e('div', { className: 'px-4 py-3.5 border-b border-neutral-100 flex items-center space-x-3 bg-white' }, [
          e('button', { onClick: () => setActiveChatId(null), className: 'text-neutral-950 font-black text-lg pr-1' }, '←'),
          e('div', null, [
            e('div', { className: 'font-black text-xs text-neutral-900 tracking-tight' }, openChat.senderName),
            e('div', { className: 'text-[10px] font-mono text-neutral-400' }, openChat.senderHandle)
          ])
        ]),

        // Messages Flow Stream
        e('div', { className: 'flex-1 p-4 overflow-y-auto space-y-3 bg-neutral-50/50' }, 
          openChat.messages.map((m, idx) => {
            const isUser = m.sender === 'user';
            return e('div', { key: idx, className: `flex flex-col ${isUser ? 'items-end' : 'items-start'}` }, [
              e('div', { className: `max-w-[80%] p-3 rounded-2xl text-xs font-medium leading-relaxed ${isUser ? 'bg-neutral-950 text-white rounded-tr-xs' : 'bg-white border border-neutral-200 text-neutral-900 rounded-tl-xs shadow-3xs'}` }, m.text),
              e('span', { className: 'text-[9px] text-neutral-400 font-bold mt-1 px-1' }, m.time)
            ]);
          })
        ),

        // Message Input Toolbar
        e('div', { className: 'p-3 border-t border-neutral-100 bg-white flex space-x-2' }, [
          e('input', { 
            type: 'text', 
            value: typedMessage,
            onChange: e => setTypedMessage(e.target.value),
            onKeyDown: e => e.key === 'Enter' && handleSendMessage(),
            placeholder: 'Type a message response...', 
            className: 'flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs font-medium focus:outline-none focus:border-neutral-900' 
          }),
          e('button', { onClick: handleSendMessage, className: 'bg-neutral-950 text-white font-black px-4 rounded-xl text-xs uppercase tracking-wide' }, 'Send')
        ])
      ]);
    }

    return e('div', { className: 'p-5 space-y-4 flex flex-col h-full animate-fade-in' }, [
      e('div', { className: 'flex justify-between items-center' }, [
        e('div', { className: 'space-y-1' }, [
          e('h2', { className: 'font-black text-xl tracking-tight text-neutral-950' }, 'Secure Inbox'),
          e('p', { className: 'text-[11px] text-neutral-400 font-medium' }, 'Click on any stacked conversation box block to converse.')
        ]),
        e('div', { className: 'bg-neutral-100 text-neutral-800 text-[10px] font-black font-mono px-2 py-1 rounded-md' }, `Balance: ${fatcoinBalance} 🪙`)
      ]),

      // Stacked inbox tiles matching instructions strictly
      e('div', { className: 'flex-1 overflow-y-auto space-y-2 pr-1' }, 
        chats.map(item => (
          e('div', { 
            key: item.id, 
            onClick: () => {
              setChats(prev => prev.map(c => c.id === item.id ? { ...c, unread: false } : c));
              setActiveChatId(item.id);
            },
            className: 'bg-white border border-neutral-200/80 rounded-2xl p-4 flex justify-between items-center cursor-pointer active:bg-neutral-50 shadow-3xs transition-all relative overflow-hidden' 
          }, [
            item.unread && e('div', { className: 'absolute top-0 left-0 bottom-0 w-1 bg-neutral-950' }),
            e('div', { className: 'space-y-1 pr-2 flex-1 truncate' }, [
              e('div', { className: 'flex items-baseline space-x-2' }, [
                e('span', { className: 'font-black text-xs text-neutral-900' }, item.senderName),
                e('span', { className: 'text-[9px] font-mono text-neutral-400' }, item.senderHandle)
              ]),
              e('p', { className: 'text-[11px] text-neutral-500 font-medium truncate' }, item.messages[item.messages.length - 1].text)
            ]),
            e('div', { className: 'flex flex-col items-end space-y-1' }, [
              e('span', { className: 'text-[9px] font-bold text-neutral-400' }, item.messages[item.messages.length - 1].time),
              item.unread && e('span', { className: 'w-2 h-2 bg-neutral-950 rounded-full' })
            ])
          ])
        ))
      )
    ]);
  };

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
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isAdminViewOpen, setIsAdminViewOpen] = useState(false);
  
  // --- PREMIUM TAB NAVIGATION ROUTER ---
  const [creatorTab, setCreatorTab] = useState(() => localStorage.getItem('fatsocial_creator_tab') || 'home');
  const [feedFilter, setFeedFilter] = useState('all'); 

  // Registration and Authentication Form Fields State Cache
  const [fullName, setFullName] = useState(() => localStorage.getItem('fatsocial_cache_name') || 'William Hudson');
  const [email, setEmail] = useState(() => localStorage.getItem('fatsocial_cache_email') || 'william.hudson@fatsocial.io');
  const [password, setPassword] = useState(() => localStorage.getItem('fatsocial_cache_pass') || '');
  const [paymentStatus, setPaymentStatus] = useState(() => localStorage.getItem('fatsocial_pay_status') || 'idle'); 

  // --- EXTENDED USER METADATA PROFILE STATES ---
  const [profileGender, setProfileGender] = useState(() => localStorage.getItem('fatsocial_prof_gender') || 'Male');
  const [profileLifestyle, setProfileLifestyle] = useState(() => localStorage.getItem('fatsocial_prof_life') || 'High-Tier Tech Nomad');
  const [profileService, setProfileService] = useState(() => localStorage.getItem('fatsocial_prof_service') || 'Full-Stack UI Architecture');
  const [profilePreferences, setProfilePreferences] = useState(() => localStorage.getItem('fatsocial_prof_pref') || 'Professional Collaborations & Premium Networking');
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // --- SOCIAL COUNTERS ENGINE ---
  const [followerCount, setFollowerCount] = useState(128);
  const [subscriberCount, setSubscriberCount] = useState(42);

  // --- SEARCH BAR STATE ---
  const [searchQuery, setSearchQuery] = useState('');

  // --- MOCK DATABASE FOR USERS REGISTRY ---
  const [usersRegistry] = useState([
    { username: '@alexrivers_studio', name: 'Alex Rivers', skill: 'Brand Strategy & Visual Curation', role: 'creator' },
    { username: '@jordansage_code', name: 'Jordan Sage', skill: 'Backend Ledger Frameworks', role: 'creator' },
    { username: '@taylor_m_design', name: 'Taylor Morgan', skill: 'UI/UX Interface Optimization', role: 'creator' },
    { username: '@casey_vance_new', name: 'Casey Vance', skill: 'Decentralized Media Pipelines', role: 'creator' }
  ]);

  // --- CHATS INBOX ENGINE ---
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem('fatsocial_chats_v2');
    return saved ? JSON.parse(saved) : [
      {
        id: 'c_admin',
        senderName: 'Platform Admin',
        senderHandle: '@system_auditor',
        messages: [
          { sender: 'admin', text: 'Welcome onboard to FATSOCIAL! Your secure decentralized framework workspace is now fully initialized. You can view tasks, verify earnings balance tracking models, and network directly via token assignments.', time: 'Just Now' }
        ],
        unread: true
      }
    ];
  });
  const [activeChatId, setActiveChatId] = useState(null);
  const [typedMessage, setTypedMessage] = useState('');

  // --- MOCK DATABASE FOR LIVE SCROLLABLE FEED ---
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('fatsocial_posts_v2');
    return saved ? JSON.parse(saved) : [
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
        creator: 'William Hudson',
        handle: '@william_hudson',
        type: 'personal',
        content: 'Successfully refactored the structural modular views inside our Next.js dashboard framework repository.',
        timestamp: '1h ago',
        likes: 12,
        isLiked: false
      },
      {
        id: 'p3',
        creator: 'Jordan Sage',
        handle: '@jordansage_code',
        type: 'following',
        content: 'Successfully configured the secure multi-currency routing nodes for cross-border settlements. Infrastructure tests are reading perfectly clean. 🚀',
        timestamp: '2h ago',
        likes: 19,
        isLiked: false
      }
    ];
  });

  // --- NEW CONTENT CREATOR COMPOSER ---
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');

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
    localStorage.setItem('fatsocial_pay_status', paymentStatus);
    localStorage.setItem('fatsocial_tasks_database', JSON.stringify(tasks));
    localStorage.setItem('fatsocial_creator_tab', creatorTab);
    localStorage.setItem('fatsocial_posts_v2', JSON.stringify(posts));
    localStorage.setItem('fatsocial_chats_v2', JSON.stringify(chats));
    
    localStorage.setItem('fatsocial_cache_name', fullName);
    localStorage.setItem('fatsocial_cache_email', email);
    localStorage.setItem('fatsocial_cache_pass', password);

    localStorage.setItem('fatsocial_prof_gender', profileGender);
    localStorage.setItem('fatsocial_prof_life', profileLifestyle);
    localStorage.setItem('fatsocial_prof_service', profileService);
    localStorage.setItem('fatsocial_prof_pref', profilePreferences);
  }, [currentPage, userRole, fatcoinBalance, creatorEarnings, paymentStatus, tasks, creatorTab, fullName, email, password, profileGender, profileLifestyle, profileService, profilePreferences, posts, chats]);

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

  // --- START A CONVERSATION COST FUNCTION ---
  const handleStartConversation = (targetUser) => {
    const existingChat = chats.find(c => c.senderHandle === targetUser.username);
    if (existingChat) {
      setActiveChatId(existingChat.id);
      setCreatorTab('chats');
      return;
    }

    if (fatcoinBalance < 20) {
      alert(`Insufficient Funds!\nStarting a new conversation requires 20 Fatcoins. Please top up your ledger.`);
      return;
    }

    // Deduct 20 Fatcoins
    setFatcoinBalance(prev => prev - 20);

    const newChat = {
      id: 'c_' + Date.now(),
      senderName: targetUser.name,
      senderHandle: targetUser.username,
      messages: [
        { sender: 'admin', text: `Conversation room unlocked with ${targetUser.name}. [Secure 20 Fatcoins Session Node Allocation Accepted]`, time: 'Just Now' }
      ],
      unread: false
    };

    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setCreatorTab('chats');
  };

  // --- SEND MESSAGE CHAT CONTEXT ---
  const handleSendMessage = () => {
    if (!typedMessage.trim()) return;
    
    setChats(prev => prev.map(c => {
      if (c.id === activeChatId) {
        const updatedMessages = [...c.messages, { sender: 'user', text: typedMessage, time: 'Just Now' }];
        
        // Automated response generation for demonstration loop parity
        setTimeout(() => {
          setChats(currentChats => currentChats.map(item => {
            if (item.id === activeChatId) {
              return {
                ...item,
                messages: [...item.messages, { sender: 'admin', text: `Automated Node Response Received: Echo framework data validation accepted correctly.`, time: 'Just Now' }]
              };
            }
            return item;
          }));
        }, 1200);

        return { ...c, messages: updatedMessages, unread: false };
      }
      return c;
    }));

    setTypedMessage('');
  };

  // --- SUBMIT USER CONTENT POST GENERATOR ---
  const handlePublishPost = () => {
    if (!newPostContent.trim()) return;
    const addedPost = {
      id: 'post_' + Date.now(),
      creator: fullName || 'William Hudson',
      handle: '@william_hudson',
      type: 'personal',
      content: newPostContent,
      timestamp: 'Just Now',
      likes: 0,
      isLiked: false
    };
    setPosts(prev => [addedPost, ...prev]);
    setNewPostContent('');
    setIsCreatePostOpen(false);
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
      if (feedFilter === 'subscribed') return post.type === 'subscribed';
      if (feedFilter === 'following') return post.type === 'following' || post.type === 'personal';
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

        // Filter Tabs
        e('div', { className: 'grid grid-cols-3 gap-1 bg-neutral-100 p-0.5 rounded-lg' }, [
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
        filteredPosts.map(post => (
          e('div', { key: post.id, className: 'bg-white border border-neutral-200/70 rounded-[20px] p-4 shadow-3xs space-y-3' }, [
            e('div', { className: 'flex justify-between items-center' }, [
              e('div', { className: 'flex items-center space-x-2.5' }, [
                e('div', { className: 'w-9 h-9 bg-neutral-900 text-white font-black text-xs rounded-lg flex items-center justify-center' }, post.creator.charAt(0)),
                e('div', null, [
                  e('div', { className: 'font-black text-xs text-neutral-950 tracking-tight' }, post.creator),
                  e('div', { className: 'text-[10px] font-medium text-neutral-400' }, post.handle)
                ])
              ]),
              e('span', { className: 'text-[9px] font-black px-2 py-0.5 bg-neutral-50 text-neutral-500 border border-neutral-200 rounded-md uppercase' }, '● Active')
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
                ])
              ])
            ])
          ])
        ))
      )
    ]);
  };

  // --- 🔍 SPECIFICATION OVERHAUL: SEARCH TAB BY USERNAME ---
  const renderSearchTab = () => {
    const filteredUsers = usersRegistry.filter(user => 
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return e('div', { className: 'p-5 space-y-4 flex flex-col h-full animate-fade-in' }, [
      e('div', { className: 'space-y-1' }, [
        e('h2', { className: 'font-black text-xl tracking-tight text-neutral-950' }, 'Search Network'),
        e('p', { className: 'text-[11px] text-neutral-400 font-medium' }, 'Discover and connect with verified profiles instantly.')
      ]),
      e('div', { className: 'relative' }, [
        e('input', { 
          type: 'text', 
          value: searchQuery,
          onChange: e => setSearchQuery(e.target.value),
          placeholder: 'Search user profiles via username (e.g. @alex)...', 
          className: 'w-full bg-white border border-neutral-200 rounded-xl px-4 py-3.5 text-xs font-medium focus:outline-none focus:border-neutral-950 shadow-3xs' 
        })
      ]),
      e('div', { className: 'flex-1 overflow-y-auto space-y-3 pr-1' }, 
        filteredUsers.length === 0 ? [
          e('div', { className: 'bg-white border rounded-2xl p-8 text-center text-xs text-neutral-400 font-medium' }, 'No matching usernames found in the node matrix.')
        ] : filteredUsers.map(user => (
          e('div', { key: user.username, className: 'bg-white border border-neutral-200/80 rounded-2xl p-4 flex justify-between items-center shadow-3xs' }, [
            e('div', { className: 'space-y-1' }, [
              e('div', { className: 'flex items-center space-x-1.5' }, [
                e('span', { className: 'font-black text-xs text-neutral-900' }, user.name),
                e('span', { className: 'text-[10px] font-mono text-neutral-400' }, user.username)
              ]),
              e('p', { className: 'text-[11px] text-neutral-500 font-medium' }, user.skill)
            ]),
            e('button', { 
              onClick: () => handleStartConversation(user),
              className: 'bg-neutral-950 text-white text-[10px] uppercase font-black tracking-wide px-3 py-2 rounded-xl active:scale-95 transition-all' 
            }, 'Chat [20 🪙]')
          ])
        ))
      )
    ]);
  };

  // --- 💬 SPECIFICATION OVERHAUL: STACKED INBOX MESSAGING NODE ---
  const renderChatsTab = () => {
    if (activeChatId) {
      const openChat = chats.find(c => c.id === activeChatId);
      return e('div', { className: 'flex flex-col h-full bg-white animate-fade-in' }, [
        // Chat Window Header
        e('div', { className: 'px-4 py-3.5 border-b border-neutral-100 flex items-center space-x-3 bg-white' }, [
          e('button', { onClick: () => setActiveChatId(null), className: 'text-neutral-950 font-black text-lg pr-1' }, '←'),
          e('div', null, [
            e('div', { className: 'font-black text-xs text-neutral-900 tracking-tight' }, openChat.senderName),
            e('div', { className: 'text-[10px] font-mono text-neutral-400' }, openChat.senderHandle)
          ])
        ]),

        // Messages Flow Stream
        e('div', { className: 'flex-1 p-4 overflow-y-auto space-y-3 bg-neutral-50/50' }, 
          openChat.messages.map((m, idx) => {
            const isUser = m.sender === 'user';
            return e('div', { key: idx, className: `flex flex-col ${isUser ? 'items-end' : 'items-start'}` }, [
              e('div', { className: `max-w-[80%] p-3 rounded-2xl text-xs font-medium leading-relaxed ${isUser ? 'bg-neutral-950 text-white rounded-tr-xs' : 'bg-white border border-neutral-200 text-neutral-900 rounded-tl-xs shadow-3xs'}` }, m.text),
              e('span', { className: 'text-[9px] text-neutral-400 font-bold mt-1 px-1' }, m.time)
            ]);
          })
        ),

        // Message Input Toolbar
        e('div', { className: 'p-3 border-t border-neutral-100 bg-white flex space-x-2' }, [
          e('input', { 
            type: 'text', 
            value: typedMessage,
            onChange: e => setTypedMessage(e.target.value),
            onKeyDown: e => e.key === 'Enter' && handleSendMessage(),
            placeholder: 'Type a message response...', 
            className: 'flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs font-medium focus:outline-none focus:border-neutral-900' 
          }),
          e('button', { onClick: handleSendMessage, className: 'bg-neutral-950 text-white font-black px-4 rounded-xl text-xs uppercase tracking-wide' }, 'Send')
        ])
      ]);
    }

    return e('div', { className: 'p-5 space-y-4 flex flex-col h-full animate-fade-in' }, [
      e('div', { className: 'flex justify-between items-center' }, [
        e('div', { className: 'space-y-1' }, [
          e('h2', { className: 'font-black text-xl tracking-tight text-neutral-950' }, 'Secure Inbox'),
          e('p', { className: 'text-[11px] text-neutral-400 font-medium' }, 'Click on any stacked conversation box block to converse.')
        ]),
        e('div', { className: 'bg-neutral-100 text-neutral-800 text-[10px] font-black font-mono px-2 py-1 rounded-md' }, `Balance: ${fatcoinBalance} 🪙`)
      ]),

      // Stacked inbox tiles matching instructions strictly
      e('div', { className: 'flex-1 overflow-y-auto space-y-2 pr-1' }, 
        chats.map(item => (
          e('div', { 
            key: item.id, 
            onClick: () => {
              setChats(prev => prev.map(c => c.id === item.id ? { ...c, unread: false } : c));
              setActiveChatId(item.id);
            },
            className: 'bg-white border border-neutral-200/80 rounded-2xl p-4 flex justify-between items-center cursor-pointer active:bg-neutral-50 shadow-3xs transition-all relative overflow-hidden' 
          }, [
            item.unread && e('div', { className: 'absolute top-0 left-0 bottom-0 w-1 bg-neutral-950' }),
            e('div', { className: 'space-y-1 pr-2 flex-1 truncate' }, [
              e('div', { className: 'flex items-baseline space-x-2' }, [
                e('span', { className: 'font-black text-xs text-neutral-900' }, item.senderName),
                e('span', { className: 'text-[9px] font-mono text-neutral-400' }, item.senderHandle)
              ]),
              e('p', { className: 'text-[11px] text-neutral-500 font-medium truncate' }, item.messages[item.messages.length - 1].text)
            ]),
            e('div', { className: 'flex flex-col items-end space-y-1' }, [
              e('span', { className: 'text-[9px] font-bold text-neutral-400' }, item.messages[item.messages.length - 1].time),
              item.unread && e('span', { className: 'w-2 h-2 bg-neutral-950 rounded-full' })
            ])
          ])
        ))
      )
    ]);
  };

  // --- 👤 SPECIFICATION OVERHAUL: PROFILE VIEW WITH GRID GRAPH METADATA & CHRONOLOGICAL USER POSTS ---
  const renderMyProfileTab = () => {
    // Filter out posts that belong to this personal account profile
    const myPersonalPosts = posts.filter(p => p.creator === (fullName || 'William Hudson') || p.type === 'personal');

    return e('div', { className: 'flex flex-col h-full animate-fade-in overflow-hidden' }, [
      
      // Top Sticky Action Node Header Panel
      e('div', { className: 'bg-white px-4 pt-4 pb-3 border-b border-neutral-100 flex justify-between items-center shrink-0' }, [
        e('div', null, [
          e('h2', { className: 'font-black text-lg tracking-tight text-neutral-950' }, 'Workspace Profile'),
          e('p', { className: 'text-[10px] font-mono text-neutral-400 uppercase tracking-wide' }, 'Verified Network Framework Node')
        ]),
        e('div', { className: 'flex space-x-2' }, [
          e('button', { 
            onClick: () => setIsCreatePostOpen(true), 
            className: 'bg-neutral-950 text-white text-[11px] uppercase font-black tracking-wider px-3 py-2 rounded-xl active:scale-95 transition-all shadow-3xs' 
          }, '＋ Create Post'),
          e('button', { 
            onClick: () => setIsEditProfileOpen(true), 
            className: 'bg-white text-neutral-950 border border-neutral-300 text-[11px] uppercase font-black tracking-wider px-3 py-2 rounded-xl active:scale-95 transition-all shadow-3xs' 
          }, '✏️ Edit UI')
        ])
      ]),

      // Scrollable Body Frame Context
      e('div', { className: 'flex-1 overflow-y-auto p-4 space-y-4' }, [
        
        // Identity Presentation Unit Layout Card Block
        e('div', { className: 'bg-white border border-neutral-200/80 rounded-[24px] p-5 flex flex-col items-center justify-center text-center space-y-3 shadow-3xs' }, [
          e('div', { className: 'w-20 h-20 rounded-full border-2 border-neutral-950 bg-neutral-50 overflow-hidden flex items-center justify-center font-black text-2xl shadow-xs' }, [
            fullName ? fullName.charAt(0).toUpperCase() : 'W'
          ]),
          e('div', { className: 'space-y-0.5' }, [
            e('h3', { className: 'font-black text-base text-neutral-900 tracking-tight' }, fullName || 'William Hudson'),
            e('p', { className: 'text-[11px] font-mono text-neutral-400' }, email || 'william.hudson@fatsocial.io')
          ]),
          // Metrics counter array parameters
          e('div', { className: 'pt-2.5 border-t border-neutral-100 w-full grid grid-cols-2 gap-2 text-center' }, [
            ['Premium Subscribers', subscriberCount],
            ['Network Followers', followerCount]
          ].map(([labelMetric, counterValue]) => e('div', { key: labelMetric }, [
            e('span', { className: 'block text-[9px] font-black text-neutral-400 uppercase tracking-wider mb-0.5' }, labelMetric),
            e('span', { className: 'text-xs font-black text-neutral-900' }, counterValue)
          ])))
        ]),

        // Structured Profile Details Showcase Grid Map Block 
        e('div', { className: 'bg-white border border-neutral-200/80 rounded-[24px] p-5 space-y-3 shadow-3xs text-xs' }, [
          e('h4', { className: 'font-black text-[11px] uppercase tracking-wider text-neutral-400 border-b pb-1.5 border-neutral-100' }, 'User Custom Matrix Parameters'),
          
          [
            ['Gender Identity', profileGender],
            ['Lifestyle Model', profileLifestyle],
            ['Service / Domain Skill', profileService],
            ['Social Preferences Alignment', profilePreferences]
          ].map(([attributeName, attributeValue]) => e('div', { key: attributeName, className: 'space-y-0.5 pt-1 first:pt-0' }, [
            e('span', { className: 'block text-[9px] font-bold text-neutral-400 uppercase tracking-tight' }, attributeName),
            e('p', { className: 'font-black text-neutral-900 leading-relaxed' }, attributeValue)
          ]))
        ]),

        // User's own historical chronological contents loop section stream
        e('div', { className: 'space-y-3' }, [
          e('h4', { className: 'font-black text-[11px] uppercase tracking-wider text-neutral-400 pl-1' }, 'Chronological Context Timeline Stream'),
          myPersonalPosts.length === 0 ? [
            e('div', { className: 'bg-white border rounded-2xl p-6 text-center text-xs text-neutral-400 font-medium' }, 'No content blocks dropped to your personal node channel yet.')
          ] : myPersonalPosts.map(post => (
            e('div', { key: post.id, className: 'bg-white border border-neutral-200/70 rounded-2xl p-4 shadow-3xs space-y-2' }, [
              e('div', { className: 'flex justify-between items-center' }, [
                e('span', { className: 'text-[10px] font-bold text-neutral-400' }, post.timestamp),
                e('span', { className: 'text-[9px] font-black px-1.5 py-0.5 bg-neutral-950 text-white rounded uppercase' }, 'Personal Content')
              ]),
              e('p', { className: 'text-xs text-neutral-800 font-medium leading-relaxed' }, post.content),
              e('div', { className: 'flex items-center text-[10px] text-neutral-400 font-bold pt-1 border-t border-neutral-50' }, [
                e('span', null, `♥ ${post.likes} engagement marks`)
              ])
            ])
          ))
        ]),

        e('button', { 
          onClick: handleLogout, 
          className: 'w-full bg-neutral-50 text-neutral-900 border border-neutral-200 font-black py-3.5 rounded-xl text-xs uppercase tracking-wide shadow-3xs active:scale-98 transition-transform' 
        }, 'Log Out System Session')
      ]),

      // --- EDIT PROFILE CONFIGURATIONS INLINE SHEET MODAL OVERLAY ---
      isEditProfileOpen && e('div', { className: 'fixed inset-0 bg-black/60 z-[999] flex items-end justify-center p-4 backdrop-blur-3xs' }, [
        e('div', { className: 'bg-white w-full rounded-t-3xl p-6 space-y-4 max-w-md border border-neutral-200 shadow-2xl animate-slide-up' }, [
          e('div', { className: 'flex justify-between items-center border-b pb-2' }, [
            e('h3', { className: 'font-black text-sm uppercase text-neutral-950' }, 'Modify Profile Parameters'),
            e('button', { onClick: () => setIsEditProfileOpen(false), className: 'text-neutral-400 font-black' }, '✕')
          ]),
          e('div', { className: 'space-y-3 text-xs overflow-y-auto max-h-[60vh] pr-1' }, [
            e('div', { className: 'space-y-1' }, [
              e('label', { className: 'font-black text-neutral-400 uppercase text-[9px]' }, 'Full Profile Name'),
              e('input', { type: 'text', value: fullName, onChange: e => setFullName(e.target.value), className: 'w-full px-3 py-2.5 bg-[#F8F8FA] border rounded-xl font-medium' })
            ]),
            e('div', { className: 'space-y-1' }, [
              e('label', { className: 'font-black text-neutral-400 uppercase text-[9px]' }, 'Gender Identity Parameters'),
              e('input', { type: 'text', value: profileGender, onChange: e => setProfileGender(e.target.value), className: 'w-full px-3 py-2.5 bg-[#F8F8FA] border rounded-xl font-medium' })
            ]),
            e('div', { className: 'space-y-1' }, [
              e('label', { className: 'font-black text-neutral-400 uppercase text-[9px]' }, 'Lifestyle Designation'),
              e('input', { type: 'text', value: profileLifestyle, onChange: e => setProfileLifestyle(e.target.value), className: 'w-full px-3 py-2.5 bg-[#F8F8FA] border rounded-xl font-medium' })
            ]),
            e('div', { className: 'space-y-1' }, [
              e('label', { className: 'font-black text-neutral-400 uppercase text-[9px]' }, 'Domain Expertise Service / Skill Attribute'),
              e('input', { type: 'text', value: profileService, onChange: e => setProfileService(e.target.value), className: 'w-full px-3 py-2.5 bg-[#F8F8FA] border rounded-xl font-medium' })
            ]),
            e('div', { className: 'space-y-1' }, [
              e('label', { className: 'font-black text-neutral-400 uppercase text-[9px]' }, 'Social Preferences Model Mapping'),
              e('textarea', { rows: '2', value: profilePreferences, onChange: e => setProfilePreferences(e.target.value), className: 'w-full px-3 py-2.5 bg-[#F8F8FA] border rounded-xl font-medium resize-none' })
            ])
          ]),
          e('button', { 
            onClick: () => setIsEditProfileOpen(false), 
            className: 'w-full bg-[#121212] text-white font-black py-3.5 rounded-xl text-xs uppercase tracking-wider active:scale-98 transition-transform' 
          }, 'Commit Saved Updates')
        ])
      ]),

      // --- NEW POST COMPOSER DRAWER OVERLAY ---
      isCreatePostOpen && e('div', { className: 'fixed inset-0 bg-black/60 z-[999] flex items-end justify-center p-4 backdrop-blur-3xs' }, [
        e('div', { className: 'bg-white w-full rounded-t-3xl p-6 space-y-4 max-w-md border border-neutral-200' }, [
          e('div', { className: 'flex justify-between items-center' }, [
            e('h3', { className: 'font-black text-sm uppercase' }, 'Publish Personal Asset Block'),
            e('button', { onClick: () => setIsCreatePostOpen(false), className: 'text-neutral-400 font-black' }, '✕')
          ]),
          e('textarea', { 
            rows: '4', 
            value: newPostContent,
            onChange: e => setNewPostContent(e.target.value),
            placeholder: 'What design framework breakthroughs or workflow assets are we updating today?...', 
            className: 'w-full px-4 py-3 bg-[#F8F8FA] border rounded-xl text-xs font-medium focus:outline-none focus:border-neutral-950 resize-none' 
          }),
          e('button', { 
            onClick: handlePublishPost, 
            className: 'w-full bg-[#121212] text-white font-black py-3.5 rounded-xl text-xs uppercase tracking-wider' 
          }, 'Publish Content Instance')
        ])
      ])
    ]);
  };

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
    return e('div', { className: 'min-h-screen bg-[#F4F4F6] text-[#121212] max-w-md mx-auto relative pb-24 font-sans flex flex-col justify-between overflow-x-hidden shadow-xl' }, [
      e('div', { className: 'flex-1 w-full overflow-y-auto' }, [
        creatorTab === 'home' && renderHomeTab(),
        creatorTab === 'search' && renderSearchTab(),
        creatorTab === 'monetization' && renderMonetizationTab(),
        creatorTab === 'chats' && renderChatsTab(),
        creatorTab === 'my_profile' && renderMyProfileTab()
      ]),

      // --- 📌 INLINE NAVIGATION BAR NODE ---
      e('nav', { className: 'fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur-xl border-t border-neutral-200/80 px-2 py-3 grid grid-cols-5 gap-1 z-50 shadow-[0_-4px_24px_rgba(0,0,0,0.04)]' }, [
        { 
          id: 'home', 
          label: 'Home', 
          svg: e('svg', { viewBox: '0 0 100 100', className: 'w-[22px] h-[22px]', fill: 'currentColor' }, 
            e('path', { d: 'M50,23.5 L18,50 L18,81.5 C18,83.4 19.6,85 21.5,85 L42.5,85 L42.5,60 L57.5,60 L57.5,85 L78.5,85 C80.4,85 82,83.4 82,81.5 L82,50 L50,23.5 Z' })
          )
        },
        { 
          id: 'search', 
          label: 'Search', 
          svg: e('svg', { viewBox: '0 0 100 100', className: 'w-[22px] h-[22px]', stroke: 'currentColor', strokeWidth: '8', fill: 'none', strokeLinecap: 'round' }, [
            e('circle', { cx: '47', cy: '47', r: '23' }),
            e('line', { x1: '63.5', y1: '63.5', x2: '81', y2: '81' })
          ])
        },
        { 
          id: 'monetization', 
          label: 'Earnings', 
          svg: e('svg', { viewBox: '0 0 100 100', className: 'w-[24px] h-[24px]', stroke: 'currentColor', strokeWidth: '5.5', fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
            e('path', { d: 'M31.5,29.5 L78.5,27.5 C80,27.5 81.5,28.5 82,30 L87.5,61.5 C88,63 87,64.5 85.5,65 L55.5,70.5', opacity: '0.85' }),
            e('rect', { x: '15', y: '36', width: '60', height: '33', rx: '2', fill: '#FFFFFF' }),
            e('path', { d: 'M21,42 L25,42 M21,42 L21,46 M69,42 L65,42 M69,42 L69,46 M21,63 L25,63 M21,63 L21,59 M69,63 L65,63 M69,63 L69,59', strokeWidth: '4' }),
            e('circle', { cx: '45', cy: '52.5', r: '11', fill: '#FFFFFF' }),
            e('path', { d: 'M45,46.5 L45,58.5 M42,49 C42,47.5 44,47.5 45,47.5 C46.5,47.5 47.5,48 47.5,49.5 C47.5,51.5 42,51.5 42,54 C42,55.5 43.5,56.5 45,56.5 C46.5,56.5 48,56 48,54.5', strokeWidth: '4' })
          ])
        },
        { 
          id: 'chats', 
          label: 'Chats', 
          svg: e('svg', { viewBox: '0 0 100 100', className: 'w-[22px] h-[22px]', stroke: 'currentColor', strokeWidth: '7', fill: 'none' }, [
            e('circle', { cx: '50', cy: '46', r: '28' }),
            e('path', { d: 'M34,68 L28,77 C27,78.5 28.5,80 30,79 L39,73.5', strokeLinecap: 'round', strokeLinejoin: 'round' }),
            e('circle', { cx: '39', cy: '46', r: '3.5', fill: 'currentColor', stroke: 'none' }),
            e('circle', { cx: '50', cy: '46', r: '3.5', fill: 'currentColor', stroke: 'none' }),
            e('circle', { cx: '61', cy: '46', r: '3.5', fill: 'currentColor', stroke: 'none' })
          ])
        },
        { 
          id: 'my_profile', 
          label: 'Profile', 
          svg: e('svg', { viewBox: '0 0 100 100', className: 'w-[22px] h-[22px]', stroke: 'currentColor', strokeWidth: '7', fill: 'none' }, [
            e('circle', { cx: '50', cy: '50', r: '33' }),
            e('circle', { cx: '50', cy: '41', r: '12', fill: 'currentColor', stroke: 'none' }),
            e('path', { d: 'M26,69 C29,60 38,55 50,55 C62,55 71,60 74,69', strokeLinecap: 'round' })
          ])
        }
      ].map(tab => {
        const isCurrent = creatorTab === tab.id;
        return e('button', {
          key: tab.id,
          onClick: () => {
            setCreatorTab(tab.id);
            if (tab.id !== 'chats') setActiveChatId(null);
          },
          className: 'flex flex-col items-center justify-center py-0.5 rounded-xl transition-all relative ' + (isCurrent ? 'text-black scale-105 font-black' : 'text-neutral-400 font-medium')
        }, [
          e('div', { className: 'transition-all', style: { color: isCurrent ? '#000000' : '#A3A3A3' } }, tab.svg),
          e('span', { className: 'text-[9px] uppercase tracking-wider font-bold mt-1' }, tab.label),
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

  return e('div', { className: 'min-h-screen bg-[#121212] text-white max-w-md mx-auto flex flex-col justify-between p-6 shadow-xl' }, [
    e('div', { className: 'flex-1 flex flex-col justify-center items-center text-center space-y-4' }, [e('div', { className: 'w-14 h-14 bg-white text-[#121212] rounded-2xl flex items-center justify-center font-black text-2xl' }, 'F'), e('h1', { className: 'text-3xl font-black tracking-tight' }, 'FATSOCIAL'), e('p', { className: 'text-xs text-gray-400 max-w-xs' }, 'Connect directly with premium elite skills marketplaces.')]),
    e('div', { className: 'space-y-3 pb-6' }, [e('button', { onClick: () => navigateTo('choose_track'), className: 'w-full bg-white text-[#121212] font-bold py-4 rounded-xl text-sm' }, 'Create Account'), e('button', { onClick: () => navigateTo('signin'), className: 'w-full bg-transparent border border-white/20 font-bold py-4 rounded-xl text-sm text-white' }, 'Sign In Account')])
  ]);
}

const root = window.ReactDOM.createRoot(document.getElementById('root'));
root.render(e(App));

      // --- EDIT PROFILE CONFIGURATIONS INLINE SHEET MODAL OVERLAY ---
      isEditProfileOpen && e('div', { className: 'fixed inset-0 bg-black/60 z-[999] flex items-end justify-center p-4 backdrop-blur-3xs' }, [
        e('div', { className: 'bg-white w-full rounded-t-3xl p-6 space-y-4 max-w-md border border-neutral-200 shadow-2xl animate-slide-up' }, [
          e('div', { className: 'flex justify-between items-center border-b pb-2' }, [
            e('h3', { className: 'font-black text-sm uppercase text-neutral-950' }, 'Modify Profile Parameters'),
            e('button', { onClick: () => setIsEditProfileOpen(false), className: 'text-neutral-400 font-black' }, '✕')
          ]),
          e('div', { className: 'space-y-3 text-xs overflow-y-auto max-h-[60vh] pr-1' }, [
            e('div', { className: 'space-y-1' }, [
              e('label', { className: 'font-black text-neutral-400 uppercase text-[9px]' }, 'Full Profile Name'),
              e('input', { type: 'text', value: fullName, onChange: e => setFullName(e.target.value), className: 'w-full px-3 py-2.5 bg-[#F8F8FA] border rounded-xl font-medium' })
            ]),
            e('div', { className: 'space-y-1' }, [
              e('label', { className: 'font-black text-neutral-400 uppercase text-[9px]' }, 'Gender Identity Parameters'),
              e('input', { type: 'text', value: profileGender, onChange: e => setProfileGender(e.target.value), className: 'w-full px-3 py-2.5 bg-[#F8F8FA] border rounded-xl font-medium' })
            ]),
            e('div', { className: 'space-y-1' }, [
              e('label', { className: 'font-black text-neutral-400 uppercase text-[9px]' }, 'Lifestyle Designation'),
              e('input', { type: 'text', value: profileLifestyle, onChange: e => setProfileLifestyle(e.target.value), className: 'w-full px-3 py-2.5 bg-[#F8F8FA] border rounded-xl font-medium' })
            ]),
            e('div', { className: 'space-y-1' }, [
              e('label', { className: 'font-black text-neutral-400 uppercase text-[9px]' }, 'Domain Expertise Service / Skill Attribute'),
              e('input', { type: 'text', value: profileService, onChange: e => setProfileService(e.target.value), className: 'w-full px-3 py-2.5 bg-[#F8F8FA] border rounded-xl font-medium' })
            ]),
            e('div', { className: 'space-y-1' }, [
              e('label', { className: 'font-black text-neutral-400 uppercase text-[9px]' }, 'Social Preferences Model Mapping'),
              e('textarea', { rows: '2', value: profilePreferences, onChange: e => setProfilePreferences(e.target.value), className: 'w-full px-3 py-2.5 bg-[#F8F8FA] border rounded-xl font-medium resize-none' })
            ])
          ]),
          e('button', { 
            onClick: () => setIsEditProfileOpen(false), 
            className: 'w-full bg-[#121212] text-white font-black py-3.5 rounded-xl text-xs uppercase tracking-wider active:scale-98 transition-transform' 
          }, 'Commit Saved Updates')
        ])
      ]),

      // --- NEW POST COMPOSER DRAWER OVERLAY ---
      isCreatePostOpen && e('div', { className: 'fixed inset-0 bg-black/60 z-[999] flex items-end justify-center p-4 backdrop-blur-3xs' }, [
        e('div', { className: 'bg-white w-full rounded-t-3xl p-6 space-y-4 max-w-md border border-neutral-200' }, [
          e('div', { className: 'flex justify-between items-center' }, [
            e('h3', { className: 'font-black text-sm uppercase' }, 'Publish Personal Asset Block'),
            e('button', { onClick: () => setIsCreatePostOpen(false), className: 'text-neutral-400 font-black' }, '✕')
          ]),
          e('textarea', { 
            rows: '4', 
            value: newPostContent,
            onChange: e => setNewPostContent(e.target.value),
            placeholder: 'What design framework breakthroughs or workflow assets are we updating today?...', 
            className: 'w-full px-4 py-3 bg-[#F8F8FA] border rounded-xl text-xs font-medium focus:outline-none focus:border-neutral-950 resize-none' 
          }),
          e('button', { 
            onClick: handlePublishPost, 
            className: 'w-full bg-[#121212] text-white font-black py-3.5 rounded-xl text-xs uppercase tracking-wider' 
          }, 'Publish Content Instance')
        ])
      ])
    ]);
  };

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
    return e('div', { className: 'min-h-screen bg-[#F4F4F6] text-[#121212] max-w-md mx-auto relative pb-24 font-sans flex flex-col justify-between overflow-x-hidden shadow-xl' }, [
      e('div', { className: 'flex-1 w-full overflow-y-auto' }, [
        creatorTab === 'home' && renderHomeTab(),
        creatorTab === 'search' && renderSearchTab(),
        creatorTab === 'monetization' && renderMonetizationTab(),
        creatorTab === 'chats' && renderChatsTab(),
        creatorTab === 'my_profile' && renderMyProfileTab()
      ]),

      // --- 📌 INLINE NAVIGATION BAR NODE ---
      e('nav', { className: 'fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur-xl border-t border-neutral-200/80 px-2 py-3 grid grid-cols-5 gap-1 z-50 shadow-[0_-4px_24px_rgba(0,0,0,0.04)]' }, [
        { 
          id: 'home', 
          label: 'Home', 
          svg: e('svg', { viewBox: '0 0 100 100', className: 'w-[22px] h-[22px]', fill: 'currentColor' }, 
            e('path', { d: 'M50,23.5 L18,50 L18,81.5 C18,83.4 19.6,85 21.5,85 L42.5,85 L42.5,60 L57.5,60 L57.5,85 L78.5,85 C80.4,85 82,83.4 82,81.5 L82,50 L50,23.5 Z' })
          )
        },
        { 
          id: 'search', 
          label: 'Search', 
          svg: e('svg', { viewBox: '0 0 100 100', className: 'w-[22px] h-[22px]', stroke: 'currentColor', strokeWidth: '8', fill: 'none', strokeLinecap: 'round' }, [
            e('circle', { cx: '47', cy: '47', r: '23' }),
            e('line', { x1: '63.5', y1: '63.5', x2: '81', y2: '81' })
          ])
        },
        { 
          id: 'monetization', 
          label: 'Earnings', 
          svg: e('svg', { viewBox: '0 0 100 100', className: 'w-[24px] h-[24px]', stroke: 'currentColor', strokeWidth: '5.5', fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' }, [
            e('path', { d: 'M31.5,29.5 L78.5,27.5 C80,27.5 81.5,28.5 82,30 L87.5,61.5 C88,63 87,64.5 85.5,65 L55.5,70.5', opacity: '0.85' }),
            e('rect', { x: '15', y: '36', width: '60', height: '33', rx: '2', fill: '#FFFFFF' }),
            e('path', { d: 'M21,42 L25,42 M21,42 L21,46 M69,42 L65,42 M69,42 L69,46 M21,63 L25,63 M21,63 L21,59 M69,63 L65,63 M69,63 L69,59', strokeWidth: '4' }),
            e('circle', { cx: '45', cy: '52.5', r: '11', fill: '#FFFFFF' }),
            e('path', { d: 'M45,46.5 L45,58.5 M42,49 C42,47.5 44,47.5 45,47.5 C46.5,47.5 47.5,48 47.5,49.5 C47.5,51.5 42,51.5 42,54 C42,55.5 43.5,56.5 45,56.5 C46.5,56.5 48,56 48,54.5', strokeWidth: '4' })
          ])
        },
        { 
          id: 'chats', 
          label: 'Chats', 
          svg: e('svg', { viewBox: '0 0 100 100', className: 'w-[22px] h-[22px]', stroke: 'currentColor', strokeWidth: '7', fill: 'none' }, [
            e('circle', { cx: '50', cy: '46', r: '28' }),
            e('path', { d: 'M34,68 L28,77 C27,78.5 28.5,80 30,79 L39,73.5', strokeLinecap: 'round', strokeLinejoin: 'round' }),
            e('circle', { cx: '39', cy: '46', r: '3.5', fill: 'currentColor', stroke: 'none' }),
            e('circle', { cx: '50', cy: '46', r: '3.5', fill: 'currentColor', stroke: 'none' }),
            e('circle', { cx: '61', cy: '46', r: '3.5', fill: 'currentColor', stroke: 'none' })
          ])
        },
        { 
          id: 'my_profile', 
          label: 'Profile', 
          svg: e('svg', { viewBox: '0 0 100 100', className: 'w-[22px] h-[22px]', stroke: 'currentColor', strokeWidth: '7', fill: 'none' }, [
            e('circle', { cx: '50', cy: '50', r: '33' }),
            e('circle', { cx: '50', cy: '41', r: '12', fill: 'currentColor', stroke: 'none' }),
            e('path', { d: 'M26,69 C29,60 38,55 50,55 C62,55 71,60 74,69', strokeLinecap: 'round' })
          ])
        }
      ].map(tab => {
        const isCurrent = creatorTab === tab.id;
        return e('button', {
          key: tab.id,
          onClick: () => {
            setCreatorTab(tab.id);
            if (tab.id !== 'chats') setActiveChatId(null);
          },
          className: 'flex flex-col items-center justify-center py-0.5 rounded-xl transition-all relative ' + (isCurrent ? 'text-black scale-105 font-black' : 'text-neutral-400 font-medium')
        }, [
          e('div', { className: 'transition-all', style: { color: isCurrent ? '#000000' : '#A3A3A3' } }, tab.svg),
          e('span', { className: 'text-[9px] uppercase tracking-wider font-bold mt-1' }, tab.label),
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

  return e('div', { className: 'min-h-screen bg-[#121212] text-white max-w-md mx-auto flex flex-col justify-between p-6 shadow-xl' }, [
    e('div', { className: 'flex-1 flex flex-col justify-center items-center text-center space-y-4' }, [e('div', { className: 'w-14 h-14 bg-white text-[#121212] rounded-2xl flex items-center justify-center font-black text-2xl' }, 'F'), e('h1', { className: 'text-3xl font-black tracking-tight' }, 'FATSOCIAL'), e('p', { className: 'text-xs text-gray-400 max-w-xs' }, 'Connect directly with premium elite skills marketplaces.')]),
    e('div', { className: 'space-y-3 pb-6' }, [e('button', { onClick: () => navigateTo('choose_track'), className: 'w-full bg-white text-[#121212] font-bold py-4 rounded-xl text-sm' }, 'Create Account'), e('button', { onClick: () => navigateTo('signin'), className: 'w-full bg-transparent border border-white/20 font-bold py-4 rounded-xl text-sm text-white' }, 'Sign In Account')])
  ]);
}

const root = window.ReactDOM.createRoot(document.getElementById('root'));
root.render(e(App));
