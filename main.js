// Grab the React engines directly from the browser window
const { useState } = window.React;
const e = window.React.createElement;

function MonetizationDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      e('div', { className: 'p-4' },
        e('p', { className: 'text-sm text-gray-400 italic px-2 py-4' }, 'Sidebar features layout placeholder. We can configure these navigation options later.')
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

      // Active Programs
      e('div', { className: 'bg-white rounded-2xl p-4 shadow-sm' },
        e('h2', { className: 'text-[16px] font-bold mb-3.5' }, 'Active programs'),
        e('div', { className: 'flex flex-col items-start' },
          e('div', { className: 'w-14 h-14 bg-[#F8F8FA] rounded-2xl flex items-center justify-center mb-2' },
            e('ion-icon', { name: 'gift-outline', style: { fontSize: '24px' } })
          ),
          e('span', { className: 'text-[12px] font-bold' }, 'LIVE rewards')
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

// Render the UI directly into the DOM container
const root = window.ReactDOM.createRoot(document.getElementById('root'));
root.render(e(MonetizationDashboard));
