// Grab React elements directly from the mobile window context
const { useState, useEffect } = window.React;
const e = window.React.createElement;

function App() {
  // --- 1. MEMORY AND SESSION STATE ENGINE ---
  const [currentPage, setCurrentPage] = useState(() => localStorage.getItem('fatsocial_page') || 'landing');
  const [userRole, setUserRole] = useState(() => localStorage.getItem('fatsocial_role') || '');
  const [fatcoinBalance, setFatcoinBalance] = useState(() => parseInt(localStorage.getItem('fatsocial_coins')) || 150);
  const [creatorEarnings, setCreatorEarnings] = useState(() => parseFloat(localStorage.getItem('fatsocial_creator_earnings')) || 0.00);

  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isAdminViewOpen, setIsAdminViewOpen] = useState(false);
  const [creatorTab, setCreatorTab] = useState(() => localStorage.getItem('fatsocial_creator_tab') || 'home');
  const [feedFilter, setFeedFilter] = useState('all'); 

  const [fullName, setFullName] = useState(() => localStorage.getItem('fatsocial_cache_name') || 'William Hudson');
  const [email, setEmail] = useState(() => localStorage.getItem('fatsocial_cache_email') || 'william.hudson@fatsocial.io');
  const [password, setPassword] = useState(() => localStorage.getItem('fatsocial_cache_pass') || '');
  const [paymentStatus, setPaymentStatus] = useState(() => localStorage.getItem('fatsocial_pay_status') || 'idle'); 

  const [profileGender, setProfileGender] = useState(() => localStorage.getItem('fatsocial_prof_gender') || 'Male');
  const [profileLifestyle, setProfileLifestyle] = useState(() => localStorage.getItem('fatsocial_prof_life') || 'High-Tier Tech Nomad');
  const [profileService, setProfileService] = useState(() => localStorage.getItem('fatsocial_prof_service') || 'Full-Stack UI Architecture');
  const [profilePreferences, setProfilePreferences] = useState(() => localStorage.getItem('fatsocial_prof_pref') || 'Professional Collaborations & Premium Networking');
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const [followerCount, setFollowerCount] = useState(128);
  const [subscriberCount, setSubscriberCount] = useState(42);
  const [searchQuery, setSearchQuery] = useState('');
  const [usersRegistry] = useState([
    { username: '@alexrivers_studio', name: 'Alex Rivers', skill: 'Brand Strategy & Visual Curation', role: 'creator' },
    { username: '@jordansage_code', name: 'Jordan Sage', skill: 'Backend Ledger Frameworks', role: 'creator' },
    { username: '@taylor_m_design', name: 'Taylor Morgan', skill: 'UI/UX Interface Optimization', role: 'creator' },
    { username: '@casey_vance_new', name: 'Casey Vance', skill: 'Decentralized Media Pipelines', role: 'creator' }
  ]);

  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem('fatsocial_chats_v2');
    return saved ? JSON.parse(saved) : [{ id: 'c_admin', senderName: 'Platform Admin', senderHandle: '@system_auditor', messages: [{ sender: 'admin', text: 'Welcome onboard to FATSOCIAL!', time: 'Just Now' }], unread: true }];
  });
  const [activeChatId, setActiveChatId] = useState(null);
  const [typedMessage, setTypedMessage] = useState('');

  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('fatsocial_posts_v2');
    return saved ? JSON.parse(saved) : [
      { id: 'p1', creator: 'Alex Rivers', handle: '@alexrivers_studio', type: 'subscribed', content: 'Design architecture templates ready.', timestamp: '10m ago', likes: 42, isLiked: false },
      { id: 'p2', creator: 'William Hudson', handle: '@william_hudson', type: 'personal', content: 'Refactoring dashboard framework.', timestamp: '1h ago', likes: 12, isLiked: false }
    ];
  });

  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('fatsocial_tasks_database');
    return saved ? JSON.parse(saved) : [
      { id: 't1', network: 'TikTok', title: 'Work with Artists', reward: 15.00, desc: 'Create posts with featured sounds.', status: 'available', lockStatus: '1/2', proofUrl: '' },
      { id: 't2', network: 'Facebook', title: 'Video Gifts', reward: 35.00, desc: 'Get Gifts for your top-performing videos.', status: 'available', lockStatus: '4/5', proofUrl: '' }
    ];
  });
  const [activeSubmissionTask, setActiveSubmissionTask] = useState(null);
  const [typedProofUrl, setTypedProofUrl] = useState('');

  // --- PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem('fatsocial_page', currentPage);
    localStorage.setItem('fatsocial_role', userRole);
    localStorage.setItem('fatsocial_coins', fatcoinBalance);
    localStorage.setItem('fatsocial_creator_earnings', creatorEarnings);
    localStorage.setItem('fatsocial_tasks_database', JSON.stringify(tasks));
    localStorage.setItem('fatsocial_creator_tab', creatorTab);
    localStorage.setItem('fatsocial_posts_v2', JSON.stringify(posts));
    localStorage.setItem('fatsocial_cache_name', fullName);
    localStorage.setItem('fatsocial_cache_email', email);
    localStorage.setItem('fatsocial_prof_gender', profileGender);
    localStorage.setItem('fatsocial_prof_life', profileLifestyle);
    localStorage.setItem('fatsocial_prof_service', profileService);
  }, [currentPage, userRole, fatcoinBalance, creatorEarnings, tasks, creatorTab, fullName, email, profileGender, profileLifestyle, profileService, posts]);

  // --- REFACTORED PROFILE VIEW ---
  const renderMyProfileTab = () => {
    const myPersonalPosts = posts.filter(p => p.creator === (fullName || 'William Hudson') || p.type === 'personal');

    return e('div', { className: 'flex flex-col h-full bg-neutral-100 p-4 space-y-4 animate-fade-in' }, [
      e('div', { className: 'flex justify-between items-center mb-2' }, [
        e('div', null, [
          e('h2', { className: 'font-black text-2xl text-neutral-950' }, 'Workspace Profile'),
          e('p', { className: 'text-[10px] font-black uppercase text-neutral-400 tracking-widest' }, 'Verified Framework Node')
        ]),
        e('div', { className: 'flex gap-2' }, [
          e('button', { onClick: () => setIsCreatePostOpen(true), className: 'bg-black text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase' }, '+ Create'),
          e('button', { onClick: () => setIsEditProfileOpen(true), className: 'bg-white border border-black px-4 py-2 rounded-xl text-[10px] font-black uppercase' }, 'Edit UI')
        ])
      ]),

      // Premium Profile Card
      e('div', { className: 'bg-white border border-neutral-200 rounded-[32px] p-8 shadow-sm flex flex-col items-center text-center' }, [
        e('div', { className: 'w-24 h-24 rounded-full border-2 border-black flex items-center justify-center text-2xl font-black mb-4 bg-neutral-100' }, fullName.charAt(0).toUpperCase()),
        e('h3', { className: 'text-xl font-black mb-1' }, fullName),
        e('p', { className: 'text-[11px] text-neutral-400 font-medium mb-6' }, email),
        
        e('div', { className: 'grid grid-cols-3 gap-4 w-full pt-6 border-t border-neutral-100' }, [
          ['Subscribers', subscriberCount],
          ['Followers', followerCount],
          ['Following', '84']
        ].map(([label, val]) => e('div', { key: label }, [
          e('div', { className: 'text-[9px] font-black text-neutral-400 uppercase tracking-widest' }, label),
          e('div', { className: 'text-lg font-black' }, val)
        ])))
      ]),

      // Content Catalogue
      e('div', { className: 'space-y-3' }, [
        e('h4', { className: 'text-[10px] font-black text-neutral-400 uppercase tracking-widest pl-2' }, 'Content Catalogue'),
        myPersonalPosts.map(post => (
          e('div', { key: post.id, className: 'bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm space-y-2' }, [
            e('p', { className: 'text-xs text-neutral-800 font-medium' }, post.content),
            e('div', { className: 'text-[9px] font-black text-neutral-400 uppercase' }, post.timestamp)
          ])
        ))
      ]),
      
      e('button', { onClick: () => { setUserRole(''); setCurrentPage('landing'); }, className: 'w-full py-4 border border-neutral-200 rounded-xl text-[10px] font-black uppercase text-neutral-400' }, 'Sign Out')
    ]);
  };

  // ... [Keep all your existing helper functions like renderHomeTab, renderSearchTab, etc. exactly as they were] ...

  // --- RENDER APP ---
  if (currentPage === 'dashboard') {
    return e('div', { className: 'min-h-screen bg-[#F4F4F6] text-[#121212] max-w-md mx-auto relative pb-24 font-sans' }, [
      e('div', { className: 'flex-1 w-full overflow-y-auto' }, [
        creatorTab === 'home' && renderHomeTab(),
        creatorTab === 'search' && renderSearchTab(),
        creatorTab === 'chats' && renderChatsTab(),
        creatorTab === 'my_profile' && renderMyProfileTab(),
        // Add other tabs...
      ]),
      // ... [Keep your existing Nav bar code] ...
    ]);
  }

  // ... [Keep your remaining Auth/Landing screens as they are] ...
}

const root = window.ReactDOM.createRoot(document.getElementById('root'));
root.render(e(App));
