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
      e('h1', { className: 'text-xl font-black mb-4' }, 'Your Feed'),
      posts.map(post => e('div', { key: post.id, className: 'bg-[#1C1C1E] rounded-[24px] p-4 mb-4' }, [
        e('p', { className: 'text-sm text-white mb-3' }, post.content),
        e('div', { className: 'flex space-x-4 text-neutral-400 text-xs' }, [`♥ ${post.likes}`, '💬 244'])
      ]))
    ]);
  };

  // --- APP ROUTING ---
  if (creatorTab === 'settings') return renderSettingsTab();
  
  return e('div', { className: 'bg-black min-h-screen' }, [
    e('div', { className: 'pb-24' }, [
      creatorTab === 'home' && renderHomeTab(),
      creatorTab === 'my_profile' && renderMyProfileTab(),
    ]),
    e('nav', { className: 'fixed bottom-0 w-full bg-[#1C1C1E] p-4 flex justify-around text-white' }, [
      e('button', { onClick: () => setCreatorTab('home') }, 'Home'),
      e('button', { onClick: () => setCreatorTab('my_profile') }, 'Profile')
    ])
  ]);
}

const root = window.ReactDOM.createRoot(document.getElementById('root'));
root.render(e(App));
