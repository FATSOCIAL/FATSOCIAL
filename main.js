const { useState, useEffect } = window.React;
const e = window.React.createElement;

/* =========================
   STORAGE
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
   MOCK DATA
========================= */
const MockDB = {
  users: [
    { username: '@alexrivers_studio', name: 'Alex Rivers', skill: 'Brand Strategy' },
    { username: '@jordansage_code', name: 'Jordan Sage', skill: 'Backend Systems' },
    { username: '@taylormorgan_design', name: 'Taylor Morgan', skill: 'UI/UX Design' }
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
    }
  ],

  chats: [
    {
      id: 'c1',
      senderName: 'Platform Admin',
      senderHandle: '@admin',
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
    { id: 't1', network: 'TikTok', title: 'Work with Artists', reward: 15 },
    { id: 't2', network: 'Facebook', title: 'Video Gifts', reward: 35 }
  ]
};

/* =========================
   APP
========================= */
function App() {
  const [page, setPage] = useState(Storage.get('page', 'landing'));
  const [tab, setTab] = useState('home');
  const [fullName] = useState('William Hudson');
  const [email] = useState('william@email.com');
  const [earnings] = useState(0);

  const [posts, setPosts] = useState(Storage.get('posts', MockDB.posts));
  const [chats, setChats] = useState(Storage.get('chats', MockDB.chats));
  const [tasks] = useState(MockDB.tasks);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeChatId, setActiveChatId] = useState(null);
  const [typedMessage, setTypedMessage] = useState('');

  useEffect(() => {
    Storage.set('posts', posts);
    Storage.set('chats', chats);
    Storage.set('page', page);
  }, [posts, chats, page]);

  function toggleLikePost(postId) {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      )
    );
  }

  function handleSendMessage() {
    if (!typedMessage.trim()) return;

    setChats(prev =>
      prev.map(chat =>
        chat.id === activeChatId
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                { sender: 'user', text: typedMessage, time: 'Now' }
              ]
            }
          : chat
      )
    );

    setTypedMessage('');
  }

  function renderHomeTab() {
    return e('div', { className: 'p-4 space-y-4' }, [
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
  }

  function renderSearchTab() {
    const filtered = MockDB.users.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return e('div', { className: 'p-4' }, [
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
  }

  function renderChatsTab() {
    if (activeChatId) {
      const chat = chats.find(c => c.id === activeChatId);

      return e('div', { className: 'flex flex-col h-screen bg-white' }, [
        e('div', { className: 'p-4 border-b flex gap-3' }, [
          e('button', { onClick: () => setActiveChatId(null) }, '←'),
          e('div', { className: 'font-black' }, chat.senderName)
        ]),

        e('div', { className: 'flex-1 p-4 overflow-y-auto' },
          chat.messages.map((msg, index) =>
            e('div', { key: index, className: 'mb-3' }, msg.text)
          )
        ),

        e('div', { className: 'p-3 border-t flex gap-2' }, [
          e('input', {
            value: typedMessage,
            onChange: ev => setTypedMessage(ev.target.value),
            className: 'flex-1 border rounded-xl px-4 py-3'
          }),
          e('button', {
            onClick: handleSendMessage,
            className: 'bg-black text-white px-4 rounded-xl'
          }, 'Send')
        ])
      ]);
    }

    return e('div', { className: 'p-4' }, [
      e('h2', { className: 'text-xl font-black mb-4' }, 'Chats'),
      ...chats.map(chat =>
        e('div', {
          key: chat.id,
          onClick: () => setActiveChatId(chat.id),
          className: 'bg-white rounded-xl p-4 border mb-3'
        }, [
          e('div', { className: 'font-black text-sm' }, chat.senderName),
          e('div', { className: 'text-xs text-gray-400' }, chat.senderHandle)
        ])
      )
    ]);
  }

  function renderEarningsTab() {
    return e('div', { className: 'p-4 space-y-4' }, [
      e('h2', { className: 'text-2xl font-black' }, 'Earnings'),
      e('div', { className: 'bg-black text-white rounded-3xl p-6' }, [
        e('div', null, 'Current Balance'),
        e('div', { className: 'text-4xl font-black mt-2' }, `$${earnings}`)
      ]),
      ...tasks.map(task =>
        e('div', {
          key: task.id,
          className: 'bg-white border rounded-2xl p-4'
        }, [
          e('div', { className: 'font-black' }, task.title),
          e('div', { className: 'text-sm text-gray-400' }, task.network),
          e('div', { className: 'font-bold mt-2' }, `$${task.reward}`)
        ])
      )
    ]);
  }

  function renderProfileTab() {
    return e('div', { className: 'p-4' }, [
      e('div', { className: 'bg-white rounded-3xl p-6 text-center border' }, [
        e('div', {
          className: 'w-20 h-20 rounded-full bg-black text-white flex items-center justify-center mx-auto text-2xl font-black'
        }, fullName.charAt(0)),
        e('h2', { className: 'text-xl font-black mt-4' }, fullName),
        e('p', { className: 'text-sm text-gray-400' }, email)
      ])
    ]);
  }

  if (page === 'dashboard') {
    return e('div', { className: 'min-h-screen bg-[#f4f4f6] max-w-md mx-auto flex flex-col' }, [
      e('div', { className: 'flex-1 pb-20' }, [
        tab === 'home' && renderHomeTab(),
        tab === 'search' && renderSearchTab(),
        tab === 'chats' && renderChatsTab(),
        tab === 'earnings' && renderEarningsTab(),
        tab === 'profile' && renderProfileTab()
      ]),

      e('nav', {
        className: 'fixed bottom-0 left-1/2 -translate-x-1/2 max-w-md w-full bg-white border-t grid grid-cols-5 py-3'
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
          className: tab === item[0] ? 'font-black text-xs' : 'text-gray-400 text-xs'
        }, item[1])
      ))
    ]);
  }

  return e('div', {
    className: 'min-h-screen bg-black text-white flex flex-col justify-center items-center'
  }, [
    e('h1', { className: 'text-4xl font-black' }, 'FATSOCIAL'),
    e('p', { className: 'text-gray-400 mt-3' }, 'Premium social networking'),
    e('button', {
      onClick: () => setPage('dashboard'),
      className: 'mt-8 bg-white text-black px-8 py-4 rounded-xl font-black'
    }, 'Enter Platform')
  ]);
}

const root = window.ReactDOM.createRoot(
  document.getElementById('root')
);

root.render(e(App));
