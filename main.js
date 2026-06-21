const { useState, useEffect } = window.React;
const e = window.React.createElement;

function App() {
  const [currentPage, setCurrentPage] = useState(() => localStorage.getItem('fatsocial_page') || 'landing');
  const [creatorTab, setCreatorTab] = useState(() => localStorage.getItem('fatsocial_creator_tab') || 'home');
  const [fullName, setFullName] = useState('Budiarti Ramlan');
  const [fatcoinBalance, setFatcoinBalance] = useState(150);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [posts, setPosts] = useState([{ id: 'p1', creator: 'Alex Rivers', content: 'Design architecture templates updated.', timestamp: '10m ago', likes: 42, isLiked: false }]);

  // --- DARK MODE HELPERS ---
  const renderSettingsRow = (label, hasToggle, hasArrow, isActive = false) => {
    return e('div', { className: 'flex items-center justify-between p-4 border-b border-neutral-800 last:border-0' }, [
      e('span', { className: 'text-sm text-white' }, label),
      hasToggle 
        ? e('div', { className: `w-11 h-6 ${isActive ? 'bg-[#CCFF00]' : 'bg-neutral-700'} rounded-full p-0.5 transition-colors` }, 
            e('div', { className: `w-5 h-5 bg-white rounded-full ${isActive ? 'ml-auto' : ''}` }))
        : hasArrow ? e('span', { className: 'text-neutral-500' }, '›') : null
    ]);
  };

  // --- UPDATED PROFILE & SETTINGS VIEWS ---
  const renderSettingsTab = () => {
    return e('div', { className: 'h-full bg-black text-white p-4 overflow-y-auto' }, [
      e('div', { className: 'flex items-center mb-6 pt-4' }, [
        e('button', { onClick: () => setCreatorTab('my_profile'), className: 'text-xl mr-4' }, '←'),
        e('h2', { className: 'text-lg font-bold' }, 'Settings')
      ]),
      e('div', { className: 'bg-[#1C1C1E] rounded-2xl p-4 mb-4 flex items-center justify-between' }, [
        e('div', { className: 'flex items-center' }, [
          e('div', { className: 'w-12 h-12 rounded-full bg-neutral-700 mr-3' }),
          e('div', null, [e('div', { className: 'font-bold' }, fullName), e('div', { className: 'text-xs text-neutral-400' }, '@budiarti12')])
        ]),
        e('span', { className: 'text-neutral-500' }, '›')
      ]),
      e('div', { className: 'bg-[#1C1C1E] rounded-2xl overflow-hidden mb-6' }, [
        renderSettingsRow('Pause notifications', true, false, true),
        renderSettingsRow('Dark mode', true, false, false),
        renderSettingsRow('My Contact', false, true)
      ]),
      e('button', { className: 'w-full py-4 rounded-2xl border border-red-900/50 text-red-500 font-bold bg-[#1C1C1E]' }, 'Log Out')
    ]);
  };

  const renderMyProfileTab = () => {
    return e('div', { className: 'h-full bg-black text-white p-6' }, [
      e('div', { className: 'flex flex-col items-center pt-8' }, [
        e('div', { className: 'w-24 h-24 rounded-full bg-neutral-800 mb-4 border-2 border-[#CCFF00]' }),
        e('h2', { className: 'text-xl font-black' }, fullName),
        e('div', { className: 'flex bg-[#1C1C1E] p-1 rounded-full mt-6' }, [
          e('button', { className: 'px-6 py-2 bg-[#CCFF00] text-black font-black rounded-full text-xs uppercase' }, 'Feed'),
          e('button', { className: 'px-6 py-2 text-white text-xs uppercase' }, 'Challenge')
        ]),
        e('button', { onClick: () => setCreatorTab('settings'), className: 'mt-6 text-xs text-neutral-400' }, 'View Settings')
      ])
    ]);
  };

  const renderHomeTab = () => {
    return e('div', { className: 'bg-black min-h-screen text-white p-4' }, [
      e('h1', { className: 'text-xl font-black mb-4' }, 'Your Feed'),const { useState, useEffect } = window.React;
const e = window.React.createElement;

/* =========================
   STORAGE HELPERS
========================= */
const Storage = {
  get(key, fallback) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  },

  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

/* =========================
   MOCK DATABASE
========================= */
const MockDB = {
  users: [
    {
      username: '@alexrivers_studio',
      name: 'Alex Rivers',
      skill: 'Brand Strategy',
      role: 'creator'
    },
    {
      username: '@jordansage_code',
      name: 'Jordan Sage',
      skill: 'Backend Systems',
      role: 'creator'
    },
    {
      username: '@taylor_m_design',
      name: 'Taylor Morgan',
      skill: 'UI/UX Design',
      role: 'creator'
    }
  ],

  posts: [
    {
      id: 'p1',
      creator: 'Alex Rivers',
      handle: '@alexrivers_studio',
      content: 'New FATSOCIAL dashboard assets uploaded.',
      likes: 42,
      isLiked: false,
      timestamp: '10m ago'
    },
    {
      id: 'p2',
      creator: 'William Hudson',
      handle: '@william_hudson',
      content: 'Testing the FATSOCIAL mobile build.',
      likes: 12,
      isLiked: false,
      timestamp: '1h ago'
    }
  ],

  chats: [
    {
      id: 'c1',
      senderName: 'Platform Admin',
      senderHandle: '@admin',
      unread: true,
      messages: [
        {
          sender: 'admin',
          text: 'Welcome to FATSOCIAL.',
          time: 'Now'
        }
      ]
    }
  ],

  tasks: [
    {
      id: 't1',
      network: 'TikTok',
      title: 'Work with Artists',
      reward: 15,
      status: 'available'
    },
    {
      id: 't2',
      network: 'Facebook',
      title: 'Video Gifts',
      reward: 35,
      status: 'available'
    }
  ]
};

/* =========================
   MAIN APP
========================= */
function App() {
  const [page, setPage] = useState(
    Storage.get('fatsocial_page', 'landing')
  );

  const [tab, setTab] = useState(
    Storage.get('fatsocial_tab', 'home')
  );

  const [fullName, setFullName] = useState(
    Storage.get('fatsocial_name', 'William Hudson')
  );

  const [email, setEmail] = useState(
    Storage.get('fatsocial_email', '')
  );

  const [password, setPassword] = useState(
    Storage.get('fatsocial_password', '')
  );

  const [coins, setCoins] = useState(
    Storage.get('fatsocial_coins', 150)
  );

  const [earnings, setEarnings] = useState(
    Storage.get('fatsocial_earnings', 0)
  );

  const [posts, setPosts] = useState(
    Storage.get('fatsocial_posts', MockDB.posts)
  );

  const [chats, setChats] = useState(
    Storage.get('fatsocial_chats', MockDB.chats)
  );

  const [tasks, setTasks] = useState(
    Storage.get('fatsocial_tasks', MockDB.tasks)
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [activeChatId, setActiveChatId] = useState(null);
  const [typedMessage, setTypedMessage] = useState('');
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  /* =========================
     SAVE TO LOCAL STORAGE
  ========================= */
  useEffect(() => {
    Storage.set('fatsocial_page', page);
    Storage.set('fatsocial_tab', tab);
    Storage.set('fatsocial_name', fullName);
    Storage.set('fatsocial_email', email);
    Storage.set('fatsocial_password', password);
    Storage.set('fatsocial_coins', coins);
    Storage.set('fatsocial_earnings', earnings);
    Storage.set('fatsocial_posts', posts);
    Storage.set('fatsocial_chats', chats);
    Storage.set('fatsocial_tasks', tasks);
  }, [
    page,
    tab,
    fullName,
    email,
    password,
    coins,
    earnings,
    posts,
    chats,
    tasks
  ]);

  /* =========================
     HANDLERS
  ========================= */
  const navigateTo = (nextPage) => {
    setPage(nextPage);
  };

  const handleLogout = () => {
    setPage('landing');
    setTab('home');
  };

  const toggleLikePost = (postId) => {
    setPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            isLiked: !post.isLiked,
            likes: post.isLiked
              ? post.likes - 1
              : post.likes + 1
          };
        }
        return post;
      })
    );
  };

  const handlePublishPost = () => {
    if (!newPostContent.trim()) return;

    const post = {
      id: 'post_' + Date.now(),
      creator: fullName,
      handle: '@william_hudson',
      content: newPostContent,
      likes: 0,
      isLiked: false,
      timestamp: 'Just now'
    };

    setPosts(prev => [post, ...prev]);
    setNewPostContent('');
    setIsCreatePostOpen(false);
  };

  const handleSendMessage = () => {
    if (!typedMessage.trim()) return;

    setChats(prev =>
      prev.map(chat => {
        if (chat.id === activeChatId) {
          return {
            ...chat,
            messages: [
              ...chat.messages,
              {
                sender: 'user',
                text: typedMessage,
                time: 'Now'
              }
            ]
          };
        }
        return chat;
      })
    );

    setTypedMessage('');
  };
    /* =========================
     HOME TAB
  ========================= */
  const renderHomeTab = () =>
    e('div', { className: 'p-4 space-y-4 animate-fade-in' }, [
      e('h1', { className: 'text-2xl font-black' }, 'FATSOCIAL'),

      ...posts.map(post =>
        e('div', {
          key: post.id,
          className: 'bg-white rounded-2xl p-4 shadow border'
        }, [
          e('div', { className: 'flex justify-between mb-2' }, [
            e('div', null, [
              e('div', { className: 'font-black text-sm' }, post.creator),
              e('div', { className: 'text-xs text-gray-400' }, post.handle)
            ]),
            e('div', { className: 'text-xs text-gray-400' }, post.timestamp)
          ]),

          e('p', { className: 'text-sm mb-3' }, post.content),

          e('button', {
            onClick: () => toggleLikePost(post.id),
            className: 'text-sm font-bold'
          }, `${post.isLiked ? '♥' : '♡'} ${post.likes}`)
        ])
      )
    ]);

  /* =========================
     SEARCH TAB
  ========================= */
  const renderSearchTab = () => {
    const filtered = MockDB.users.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return e('div', { className: 'p-4 animate-fade-in' }, [
      e('h2', { className: 'text-xl font-black mb-4' }, 'Search'),

      e('input', {
        value: searchQuery,
        onChange: ev => setSearchQuery(ev.target.value),
        placeholder: 'Search users...',
        className: 'w-full px-4 py-3 rounded-xl border mb-4'
      }),

      ...filtered.map(user =>
        e('div', {
          key: user.username,
          className: 'bg-white rounded-xl p-4 border mb-3'
        }, [
          e('div', { className: 'font-black text-sm' }, user.name),
          e('div', { className: 'text-xs text-gray-400' }, user.username),
          e('div', { className: 'text-xs mt-2' }, user.skill)
        ])
      )
    ]);
  };

  /* =========================
     CHAT TAB
  ========================= */
  const renderChatsTab = () => {
    if (activeChatId) {
      const chat = chats.find(c => c.id === activeChatId);

      return e('div', { className: 'flex flex-col h-full bg-white' }, [
        e('div', {
          className: 'p-4 border-b flex items-center gap-3'
        }, [
          e('button', {
            onClick: () => setActiveChatId(null)
          }, '←'),

          e('div', { className: 'font-black' }, chat.senderName)
        ]),

        e('div', {
          className: 'flex-1 p-4 space-y-3 overflow-y-auto'
        },
          chat.messages.map((msg, index) =>
            e('div', {
              key: index,
              className: msg.sender === 'user'
                ? 'text-right'
                : 'text-left'
            }, [
              e('div', {
                className:
                  'inline-block px-4 py-2 rounded-2xl bg-gray-100 text-sm'
              }, msg.text)
            ])
          )
        ),

        e('div', {
          className: 'p-3 border-t flex gap-2'
        }, [
          e('input', {
            value: typedMessage,
            onChange: ev => setTypedMessage(ev.target.value),
            placeholder: 'Type message...',
            className: 'flex-1 border rounded-xl px-4 py-3'
          }),

          e('button', {
            onClick: handleSendMessage,
            className: 'bg-black text-white px-4 rounded-xl'
          }, 'Send')
        ])
      ]);
    }

    return e('div', { className: 'p-4 animate-fade-in' }, [
      e('h2', { className: 'text-xl font-black mb-4' }, 'Chats'),

      ...chats.map(chat =>
        e('div', {
          key: chat.id,
          onClick: () => setActiveChatId(chat.id),
          className:
            'bg-white rounded-xl p-4 border mb-3 cursor-pointer'
        }, [
          e('div', { className: 'font-black text-sm' }, chat.senderName),
          e('div', { className: 'text-xs text-gray-400' }, chat.senderHandle),
          e('div', { className: 'text-xs mt-2 truncate' },
            chat.messages[chat.messages.length - 1].text
          )
        ])
      )
    ]);
  };
    /* =========================
     EARNINGS TAB
  ========================= */
  const renderEarningsTab = () =>
    e('div', { className: 'p-4 space-y-4 animate-fade-in' }, [
      e('h2', { className: 'text-2xl font-black' }, 'Earnings'),

      e('div', {
        className: 'bg-black text-white rounded-3xl p-6'
      }, [
        e('div', { className: 'text-sm text-gray-400' }, 'Current Balance'),
        e('div', { className: 'text-4xl font-black mt-2' }, `$${earnings}`)
      ]),

      ...tasks.map(task =>
        e('div', {
          key: task.id,
          className: 'bg-white border rounded-2xl p-4'
        }, [
          e('div', { className: 'font-black' }, task.title),
          e('div', { className: 'text-sm text-gray-400' }, task.network),
          e('div', { className: 'mt-2 font-bold' }, `$${task.reward}`)
        ])
      )
    ]);

  /* =========================
     PROFILE TAB
  ========================= */
  const renderProfileTab = () =>
    e('div', { className: 'p-4 space-y-4 animate-fade-in' }, [
      e('div', {
        className: 'bg-white rounded-3xl p-6 text-center border'
      }, [
        e('div', {
          className:
            'w-20 h-20 rounded-full bg-black text-white flex items-center justify-center mx-auto text-2xl font-black'
        }, fullName.charAt(0).toUpperCase()),

        e('h2', {
          className: 'text-xl font-black mt-4'
        }, fullName),

        e('p', {
          className: 'text-sm text-gray-400'
        }, email)
      ]),

      e('button', {
        onClick: () => setIsCreatePostOpen(true),
        className:
          'w-full bg-black text-white py-4 rounded-xl font-bold'
      }, 'Create Post'),

      e('button', {
        onClick: handleLogout,
        className:
          'w-full bg-red-500 text-white py-4 rounded-xl font-bold'
      }, 'Logout')
    ]);

  /* =========================
     DASHBOARD RENDER
  ========================= */
  if (page === 'dashboard') {
    return e('div', {
      className:
        'min-h-screen bg-[#f4f4f6] max-w-md mx-auto flex flex-col'
    }, [

      e('div', { className: 'flex-1 overflow-auto pb-20' }, [
        tab === 'home' && renderHomeTab(),
        tab === 'search' && renderSearchTab(),
        tab === 'chats' && renderChatsTab(),
        tab === 'earnings' && renderEarningsTab(),
        tab === 'profile' && renderProfileTab()
      ]),

      e('nav', {
        className:
          'fixed bottom-0 left-1/2 -translate-x-1/2 max-w-md w-full bg-white border-t grid grid-cols-5 py-3'
      }, [
        ['home', 'Home'],
        ['search', 'Search'],
        ['chats', 'Chats'],
        ['earnings', 'Earn'],
        ['profile', 'Profile']
      ].map(item =>
        e('button', {
          key: item[0],
          onClick: () => setTab(item[0]),
          className:
            tab === item[0]
              ? 'font-black text-black text-xs'
              : 'text-gray-400 text-xs'
        }, item[1])
      ))
    ]);
  }

  /* =========================
     LANDING PAGE
  ========================= */
  return e('div', {
    className:
      'min-h-screen bg-black text-white flex flex-col justify-center items-center p-6'
  }, [
    e('h1', {
      className: 'text-4xl font-black'
    }, 'FATSOCIAL'),

    e('p', {
      className: 'text-sm text-gray-400 mt-3'
    }, 'Premium social networking'),

    e('button', {
      onClick: () => setPage('dashboard'),
      className:
        'mt-8 bg-white text-black px-8 py-4 rounded-xl font-black'
    }, 'Enter Platform')
  ]);
}

/* =========================
   ROOT RENDER
========================= */
const root = window.ReactDOM.createRoot(
  document.getElementById('root')
);

root.render(e(App));
