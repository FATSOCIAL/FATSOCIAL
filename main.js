// Grab the React engines directly from the browser window
const { useState } = window.React;
const e = window.React.createElement;

function App() {
  // Navigation Routing State: 'landing', 'signin', 'signup', or 'dashboard'
  const [currentPage, setCurrentPage] = useState('landing');
  
  // Form states for inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Dashboard state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Your 4 active programs configured in strict black & white theme
  const activeProgramsList = [
    { id: 'live', title: 'LIVE rewards', icon: 'gift-outline' },
    { id: 'tips', title: 'Sub Tips', icon: 'cash-outline' },
    { id: 'tasks', title: 'Task Rewards', icon: 'checkbox-outline' },
    { id: 'creator', title: 'Creator Rewards', icon: 'trophy-outline' }
  ];

  // Form Validation Action Handler
  const handleAuthAction = (actionType) => {
    if (!email || !password || (actionType === 'signup' && !fullName)) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    
    // Clear errors and route cleanly to the functional dashboard
    setErrorMessage('');
    setCurrentPage('dashboard');
  };

  // --- 1. LANDING WELCOME VIEW ---
  if (currentPage === 'landing') {
    return e('div', { className: 'min-h-screen bg-[#121212] text-white max-w-md mx-auto flex flex-col justify-between p-6 shadow-md' },
      e('div', { className: 'flex-1 flex flex-col justify-center items-center text-center space-y-6 pt-12' },
        e('div', { className: 'w-20 h-20 bg-white text-[#121212] rounded-3xl flex items-center justify-center shadow-lg mb-2' },
          e('ion-icon', { name: 'flash', style: { fontSize: '42px' } })
        ),
        e('h1', { className: 'text-3xl font-black tracking-tight' }, 'FATSOCIAL'),
        e('p', { className: 'text-sm text-gray-400 max-w-xs leading-relaxed' }, 
          'The premier marketplace platform for influencers, business experts, and creators to showcase skills and maximize daily earnings.'
        )
      ),
      e('div', { className: 'space-y-3.5 pb-8' },
        e('button', { 
          onClick: () => { setErrorMessage(''); setCurrentPage('signup'); },
          className: 'w-full bg-white text-[#121212] font-bold py-4 rounded-xl hover:bg-gray-100 active:scale-[0.99] transition-all text-sm'
        }, 'Create Account'),
        e('button', { 
          onClick: () => { setErrorMessage(''); setCurrentPage('signin'); },
          className: 'w-full bg-transparent text-white border border-white/20 font-bold py-4 rounded-xl hover:bg-white/5 active:scale-[0.99] transition-all text-sm'
        }, 'Sign In to Account')
      )
    );
  }

  // --- 2. SIGN IN GATEWAY ---
  if (currentPage === 'signin') {
    return e('div', { className: 'min-h-screen bg-white text-[#121212] max-w-md mx-auto flex flex-col p-6 shadow-md' },
      e('div', { className: 'pt-6 mb-8' },
        e('button', { onClick: () => setCurrentPage('landing'), className: 'flex items-center text-sm font-semibold text-gray-500 hover:text-[#121212]' },
          e('ion-icon', { name: 'arrow-back-outline', style: { marginRight: '4px', fontSize: '16px' } }), 'Back'
        )
      ),
      e('div', { className: 'flex-1 space-y-6' },
        e('div', null,
          e('h2', { className: 'text-2xl font-bold tracking-tight' }, 'Welcome Back'),
          e('p', { className: 'text-sm text-gray-400 mt-1' }, 'Sign in to access your creator dashboard analytics.')
        ),
        errorMessage && e('div', { className: 'bg-red-50 text-red-600 text-xs font-semibold p-3.5 rounded-xl border border-red-100' }, errorMessage),
        e('div', { className: 'space-y-4' },
          e('div', null,
            e('label', { className: 'block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2' }, 'Email Address'),
            e('input', { 
              type: 'email', value: email, onChange: (e) => setEmail(e.target.value),
              placeholder: 'name@example.com', className: 'w-full px-4 py-3.5 bg-[#F8F8FA] border border-gray-100 rounded-xl focus:outline-none focus:border-[#121212] text-sm font-medium'
            })
          ),
          e('div', null,
            e('label', { className: 'block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2' }, 'Password'),
            e('div', { className: 'relative' },
              e('input', { 
                type: showPassword ? 'text' : 'password', value: password, onChange: (e) => setPassword(e.target.value),
                placeholder: 'Enter account password', className: 'w-full px-4 py-3.5 bg-[#F8F8FA] border border-gray-100 rounded-xl focus:outline-none focus:border-[#121212] text-sm font-medium pr-12'
              }),
              e('button', { 
                onClick: () => setShowPassword(!showPassword),
                className: 'absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#121212] flex items-center'
              }, e('ion-icon', { name: showPassword ? 'eye-off-outline' : 'eye-outline', style: { fontSize: '18px' } }))
            )
          )
        ),
        e('button', { 
          onClick: () => handleAuthAction('signin'),
          className: 'w-full bg-[#121212] text-white font-bold py-4 rounded-xl hover:bg-[#222222] active:scale-[0.99] transition-all text-sm mt-2 shadow-sm'
        }, 'Sign In Now'),
        e('div', { className: 'text-center pt-2' },
          e('span', { className: 'text-xs text-gray-400 font-medium' }, "Don't have an account? "),
          e('button', { onClick: () => { setErrorMessage(''); setCurrentPage('signup'); }, className: 'text-xs font-bold underline text-[#121212]' }, 'Register here')
        )
      )
    );
  }

  // --- 3. SIGN UP REGISTRATION GATEWAY ---
  if (currentPage === 'signup') {
    return e('div', { className: 'min-h-screen bg-white text-[#121212] max-w-md mx-auto flex flex-col p-6 shadow-md' },
      e('div', { className: 'pt-6 mb-8' },
        e('button', { onClick: () => setCurrentPage('landing'), className: 'flex items-center text-sm font-semibold text-gray-500 hover:text-[#121212]' },
          e('ion-icon', { name: 'arrow-back-outline', style: { marginRight: '4px', fontSize: '16px' } }), 'Back'
        )
      ),
      e('div', { className: 'flex-1 space-y-5' },
        e('div', null,
          e('h2', { className: 'text-2xl font-bold tracking-tight' }, 'Create Creator Account'),
          e('p', { className: 'text-sm text-gray-400 mt-1' }, 'Register below to access active tasks and payouts.')
        ),
        errorMessage && e('div', { className: 'bg-red-50 text-red-600 text-xs font-semibold p-3.5 rounded-xl border border-red-100' }, errorMessage),
        e('div', { className: 'space-y-4' },
          e('div', null,
            e('label', { className: 'block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2' }, 'Full Legal Name'),
            e('input', { 
              type: 'text', value: fullName, onChange: (e) => setFullName(e.target.value),
              placeholder: 'John Doe', className: 'w-full px-4 py-3.5 bg-[#F8F8FA] border border-gray-100 rounded-xl focus:outline-none focus:border-[#121212] text-sm font-medium'
            })
          ),
          e('div', null,
            e('label', { className: 'block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2' }, 'Email Address'),
            e('input', { 
              type: 'email', value: email, onChange: (e) => setEmail(e.target.value),
              placeholder: 'name@example.com', className: 'w-full px-4 py-3.5 bg-[#F8F8FA] border border-gray-100 rounded-xl focus:outline-none focus:border-[#121212] text-sm font-medium'
            })
          ),
          e('div', null,
            e('label', { className: 'block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2' }, 'Password'),
            e('div', { className: 'relative' },
              e('input', { 
                type: showPassword ? 'text' : 'password', value: password, onChange: (e) => setPassword(e.target.value),
                placeholder: 'Create minimum 6-character password', className: 'w-full px-4 py-3.5 bg-[#F8F8FA] border border-gray-100 rounded-xl focus:outline-none focus:border-[#121212] text-sm font-medium pr-12'
              }),
              e('button', { 
                onClick: () => setShowPassword(!showPassword),
                className: 'absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#121212] flex items-center'
              }, e('ion-icon', { name: showPassword ? 'eye-off-outline' : 'eye-outline', style: { fontSize: '18px' } }))
            )
          )
        ),
        // Platform One-Time Setup Fee Requirement Box
        e('div', { className: 'bg-[#F8F8FA] border border-gray-100 p-4 rounded-xl flex items-center justify-between text-xs mt-1' },
          e('div', { className: 'space-y-0.5' },
            e('span', { className: 'font-bold block text-gray-900' }, 'One-Time Setup Fee'),
            e('span', { className: 'text-gray-400 font-medium' }, 'Includes verified platform dashboard access')
          ),
          e('span', { className: 'text-sm font-black text-[#121212]' }, '$25.00')
        ),
        e('button', { 
          onClick: () => handleAuthAction('signup'),
          className: 'w-full bg-[#121212] text-white font-bold py-4 rounded-xl hover:bg-[#222222] active:scale-[0.99] transition-all text-sm shadow-sm'
        }, 'Pay Fee & Complete Registration'),
        e('div', { className: 'text-center pt-1' },
          e('span', { className: 'text-xs text-gray-400 font-medium' }, 'Already have an account? '),
          e('button', { onClick: () => { setErrorMessage(''); setCurrentPage('signin'); }, className: 'text-xs font-bold underline text-[#121212]' }, 'Log In')
        )
      )
    );
  }

  // --- 4. SECURE DASHBOARD VIEW (FULLY PRESERVED STRUCTURAL CODE) ---
  return e('div', { className: 'min-h-screen bg-[#F8F8FA] text-[#121212] max-w-md mx-auto relative shadow-md' },
    
    // --- SIDEBAR OVERLAY & MENU ---
    isSidebarOpen && e('div', { 
      className: 'fixed inset-0 bg-black/50 z-40 max-w-md mx-auto',
      onClick: () => setIsSidebarOpen(false)
    }),
    
    e('div', { className: `fixed top-0 left-0 bottom-0 w-72 bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} max-w-md` },
      e('div', { className: 'p-5 flex justify-between items-center border-b border-gray-100' },
        e('h2', { className: 'font-bold text-lg text-gray-900' }, 'Menu Options'),
        e('button', { onClick: () => setIsSidebarOpen(false), className: 'p-1 hover:bg-gray-100 rounded-full' }, 
          e('ion-icon', { name: 'close-outline', style: { fontSize: '24px' } })
        )
      ),
      e('div', { className: 'p-4 flex flex-col justify-between h-[calc(100%-70px)]' },
        e('div', null,
          e('p', { className: 'text-sm text-gray-400 italic px-2 py-4' }, 'Sidebar features layout placeholder. We can configure these navigation options later.')
        ),
        // Sign Out functioning controller returning user strictly to onboarding
        e('button', { 
          onClick: () => { setIsSidebarOpen(false); setCurrentPage('landing'); },
          className: 'w-full bg-[#121212] text-white py-3.5 font-bold rounded-xl text-xs flex items-center justify-center space-x-2 active:bg-black'
        }, [e('ion-icon', { name: 'log-out-outline', style: { fontSize: '16px' } }), e('span', null, 'Sign Out Account')])
      )
    ),

    // --- HEADER BLOCK ---
    e('div', { className: 'relative bg-[#121212] text-white pt-12 pb-6 px-4 rounded-b-[24px] overflow-hidden' },
      e('div', { className: 'relative z-10 flex justify-between items-center mb-4' },
        e('button', { onClick: () => setIsSidebarOpen(true), className: 'p-1 -ml-1' }, 
          e('ion-icon', { name: 'menu-outline', style: { fontSize: '26px' } })
        ),
        e('div', { className: 'flex items-center space-x-5' },
          e('button', null, e('ion-icon', { name: 'flag-outline', style: { fontSize: '22px' } })),
          e('button', null, e('ion-icon', { name: 'settings-outline', style: { fontSize: '22px' } }))
        )
      ),
      e('div', { className: 'relative z-10 mb-2' },
        e('h1', { className: 'text-[17px] font-semibold text-gray-400' }, 'Monetization')
      ),
      e('div', { className: 'relative z-10 flex items-center mb-1 w-fit' },
        e('span', { className: 'text-2xl font-bold self-start mt-1 mr-0.5' }, '$'),
        e('span', { className: 'text-4xl font-bold' }, '0.00'),
        e('ion-icon', { name: 'chevron-forward-outline', style: { color: '#9ca3af', marginLeft: '4px', marginTop: '6px' } })
      ),
      e('div', { className: 'relative z-10 flex items-center space-x-1 mb-5 text-[12px] text-gray-400' },
        e('span', null, 'Estimated rewards in the last 7 days'),
        e('ion-icon', { name: 'help-circle-outline' })
      ),
      e('div', { className: 'relative z-10 bg-white/10 rounded-xl px-4 py-3.5 flex justify-between items-center' },
        e('span', { className: 'text-[14px] font-medium text-gray-200' }, 'Balance: $0.00'),
        e('div', { className: 'flex items-center space-x-0.5 text-gray-400 text-[13px]' },
          e('span', null, 'View'),
          e('ion-icon', { name: 'chevron-forward-outline' })
        )
      )
    ),

    // --- BODY CONTENT AREA ---
    e('div', { className: 'px-4 py-5 space-y-4' },
      
      // Rewards Analytics
      e('div', { className: 'bg-white rounded-2xl p-4 shadow-sm' },
        e('div', { className: 'flex justify-between items-center mb-3.5' },
          e('h2', { className: 'text-[16px] font-bold' }, 'Rewards analytics'),
          e('div', { className: 'flex items-center text-gray-400 text-[13px]' },
            e('span', null, 'View all'),
            e('ion-icon', { name: 'chevron-forward-outline' })
          )
        ),
        e('div', { className: 'bg-[#F8F8FA] rounded-xl p-4' },
          e('div', { className: 'text-[24px] font-bold' }, '$0.00'),
          e('div', { className: 'text-[12px] font-medium text-gray-500 mt-0.5' }, 'LIVE rewards'),
          e('div', { className: 'text-[12px] font-semibold text-gray-400 mt-1' }, '0.0% 7d')
        )
      ),

      // --- BLACK & WHITE ACTIVE PROGRAMS SECTION ---
      e('div', { className: 'bg-white rounded-2xl p-4 shadow-sm' },
        e('h2', { className: 'text-[16px] font-bold mb-4' }, 'Active programs'),
        
        // Horizontal sliding container
        e('div', { className: 'flex items-start space-x-5 overflow-x-auto pb-2 scrollbar-none' },
          activeProgramsList.map((program) => (
            e('div', { key: program.id, className: 'flex flex-col items-center text-center min-w-[76px] cursor-pointer' },
              e('div', { className: 'w-14 h-14 bg-[#F8F8FA] rounded-2xl flex items-center justify-center mb-2 active:bg-gray-100 transition-colors' },
                e('ion-icon', { name: program.icon, style: { fontSize: '24px', color: '#121212' } })
              ),
              e('span', { className: 'text-[11px] font-bold text-[#121212] leading-tight max-w-[80px] break-words' }, program.title)
            )
          ))
        )
      ),

      // Programs For You
      e('div', { className: 'bg-white rounded-2xl p-4 shadow-sm' },
        e('div', { className: 'flex justify-between items-center mb-4' },
          e('div', { className: 'flex items-center space-x-1' },
            e('h2', { className: 'text-[16px] font-bold' }, 'Programs for you'),
            e('ion-icon', { name: 'help-circle-outline', style: { color: '#9ca3af' } })
          ),
          e('div', { className: 'flex items-center text-gray-400 text-[13px]' },
            e('span', null, 'View all'),
            e('ion-icon', { name: 'chevron-forward-outline' })
          )
        ),
        e('div', { className: 'divide-y divide-gray-100' },
          
          // Work with Artists
          e('div', { className: 'flex items-start py-4' },
            e('div', { className: 'mt-0.5 mr-3.5' }, e('ion-icon', { name: 'musical-notes-outline', style: { fontSize: '20px' } })),
            e('div', { className: 'flex-1 pr-2' },
              e('div', { className: 'flex items-center space-x-2' },
                e('span', { className: 'text-[15px] font-bold' }, 'Work with Artists'),
                e('span', { className: 'bg-[#EFEFEF] text-[#666666] text-[10px] font-bold px-1.5 py-0.5 rounded-md' }, '🔒 1/2')
              ),
              e('p', { className: 'text-[13px] text-gray-500 mt-1' }, 'Create posts with featured sounds and get paid based on how your post performs.')
            ),
            e('ion-icon', { name: 'chevron-forward-outline', style: { color: '#d1d5db', alignSelf: 'center' } })
          ),

          // Video Gifts
          e('div', { className: 'flex items-start py-4' },
            e('div', { className: 'mt-0.5 mr-3.5' }, e('ion-icon', { name: 'videocam-outline', style: { fontSize: '20px' } })),
            e('div', { className: 'flex-1 pr-2' },
              e('div', { className: 'flex items-center space-x-2' },
                e('span', { className: 'text-[15px] font-bold' }, 'Video Gifts'),
                e('span', { className: 'bg-[#EFEFEF] text-[#666666] text-[10px] font-bold px-1.5 py-0.5 rounded-md' }, '🔒 4/5')
              ),
              e('p', { className: 'text-[13px] text-gray-500 mt-1' }, 'Get Gifts for your top-performing videos.')
            ),
            e('ion-icon', { name: 'chevron-forward-outline', style: { color: '#d1d5db', alignSelf: 'center' } })
          ),

          // Subscription
          e('div', { className: 'flex items-start py-4' },
            e('div', { className: 'mt-0.5 mr-3.5' }, e('ion-icon', { name: 'star-outline', style: { fontSize: '20px' } })),
            e('div', { className: 'flex-1 pr-2' },
              e('div', { className: 'flex items-center space-x-2' },
                e('span', { className: 'text-[15px] font-bold' }, 'Subscription'),
                e('span', { className: 'bg-[#EFEFEF] text-[#666666] text-[10px] font-bold px-1.5 py-0.5 rounded-md' }, '🔒 2/4')
              ),
              e('p', { className: 'text-[13px] text-gray-500 mt-1' }, 'Connect more closely with viewers through subscriber-only content and benefits.')
            ),
            e('ion-icon', { name: 'chevron-forward-outline', style: { color: '#d1d5db', alignSelf: 'center' } })
          )

        )
      )

    )
  );
}

// Render the structural wrapper directly to the DOM hook
const root = window.ReactDOM.createRoot(document.getElementById('root'));
root.render(e(App));
