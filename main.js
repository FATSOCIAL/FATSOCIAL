// Grab React elements directly from the mobile window context
const { useState, useEffect } = window.React;
const e = window.React.createElement;

function App() {
  // --- 1. MEMORY AND SESSION STATE ENGINE ---
  const [currentPage, setCurrentPage] = useState(() => localStorage.getItem('fatsocial_page') || 'landing');
  const [userRole, setUserRole] = useState(() => localStorage.getItem('fatsocial_role') || '');
  const [fatcoinBalance, setFatcoinBalance] = useState(() => parseInt(localStorage.getItem('fatsocial_coins')) || 150);
  const [creatorEarnings, setCreatorEarnings] = useState(() => parseFloat(localStorage.getItem('fatsocial_creator_earnings')) || 0.00);

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

  const [followerCount] = useState(128);
  const [subscriberCount] = useState(42);
  const [searchQuery, setSearchQuery] = useState('');
  const [usersRegistry] = useState([
    { username: '@alexrivers_studio', name: 'Alex Rivers', skill: 'Brand Strategy & Visual Curation', role: 'creator' },
    { username: '@jordansage_code', name: 'Jordan Sage', skill: 'Backend Ledger Frameworks', role: 'creator' },
    { username: '@taylor_m_design', name: 'Taylor Morgan', skill: 'UI/UX Interface Optimization', role: 'creator' }
  ]);

  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem('fatsocial_chats_v2');
    return saved ? JSON.parse(saved) : [{ id: 'c_admin', senderName: 'Platform Admin', senderHandle: '@system_auditor', messages: [{ sender: 'admin', text: 'Welcome to FATSOCIAL!', time: 'Just Now' }], unread: true }];
  });
  const [activeChatId, setActiveChatId] = useState(null);
  const [typedMessage, setTypedMessage] = useState('');

  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('fatsocial_posts_v2');
    return saved ? JSON.parse(saved) : [
      { id: 'p1', creator: 'Alex Rivers', handle: '@alexrivers_studio', type: 'subscribed', content: 'FATSOCIAL UI templates ready.', timestamp: '10m ago', likes: 42, isLiked: false },
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
    localStorage.setItem('fatsocial_creator_earnings', creatorEarnings);
    localStorage.setItem('fatsocial_tasks_database', JSON.stringify(tasks));
    localStorage.setItem('fatsocial_creator_tab', creatorTab);
  }, [currentPage, creatorEarnings, tasks, creatorTab]);

  // --- RENDERERS ---
  const renderMyProfileTab = () => {
    const myPersonalPosts = posts.filter(p => p.creator === (fullName || 'William Hudson'));

    return e('div', { className: 'flex flex-col h-full bg-white animate-fade-in' }, [
      e('div', { className: 'relative h-32 bg-neutral-100 shrink-0' }, [
        e('button', { 
          onClick: () => setIsEditProfileOpen(true),
          className: 'absolute top-4 right-4 text-[10px] font-black uppercase tracking-widest border border-black/20 bg-white/50 backdrop-blur px-4 py-1.5 rounded-full hover:bg-black hover:text-white transition' 
        }, 'Edit Profile')
      ]),
      e('div', { className: 'px-6 relative pb-10' }, [
        e('div', { className: 'w-24 h-24 -mt-12 rounded-full border-4 border-white bg-neutral-900 shadow-xl flex items-center justify-center text-white font-black text-3xl' }, fullName?.charAt(0).toUpperCase() || 'W'),
        e('div', { className: 'mt-4' }, [
          e('h1', { className: 'text-2xl font-black text-neutral-950' }, fullName),
          e('p', { className: 'text-sm text-neutral-400 font-medium' }, `@${fullName?.toLowerCase().replace(' ', '_')}`)
        ]),
        e('p', { className: 'mt-6 text-sm text-neutral-700 leading-relaxed max-w-sm' }, "Digital creator building the future of social finance."),
        e('div', { className: 'flex gap-8 mt-8 py-6 border-y border-neutral-100' }, [
          ['Posts', myPersonalPosts.length],
          ['Followers', followerCount],
          ['Subscribers', subscriberCount]
        ].map(([label, val]) => e('div', { key: label }, [
          e('div', { className: 'font-black text-lg' }, val),
          e('div', { className: 'text-[10px] uppercase tracking-widest text-neutral-400 font-bold' }, label)
        ]))),
        e('button', { onClick: () => { setUserRole(''); navigateTo('landing'); }, className: 'mt-8 w-full border border-neutral-200 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-neutral-500' }, 'Sign Out')
      ])
    ]);
  };

  const navigateTo = (page) => setCurrentPage(page);

  // --- MAIN APP RENDER ---
  if (currentPage === 'dashboard') {
    return e('div', { className: 'min-h-screen bg-[#F4F4F6] text-[#121212] max-w-md mx-auto relative pb-24 font-sans' }, [
      e('div', { className: 'flex-1 w-full overflow-y-auto' }, [
        creatorTab === 'my_profile' && renderMyProfileTab(),
        // ... (Other tabs here, use similar structure)
      ]),
      // ... (Navigation bar logic here)
    ]);
  }

  // --- AUTH / LANDING ---
  return e('div', { className: 'min-h-screen bg-[#121212] text-white max-w-md mx-auto flex flex-col justify-center p-6' }, [
    e('h1', { className: 'text-3xl font-black' }, 'FATSOCIAL'),
    e('button', { onClick: () => navigateTo('choose_track'), className: 'bg-white text-black p-4 rounded-xl mt-6' }, 'Create Account')
  ]);
}

const root = window.ReactDOM.createRoot(document.getElementById('root'));
root.render(e(App));
