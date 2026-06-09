import React, { useState } from 'https://esm.sh/react@18.2.0';
import ReactDOM from 'https://esm.sh/react-dom@18.2.0/client';

function MonetizationDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    React.createElement('div', { className: 'min-h-screen bg-[#F8F8FA] text-[#121212] max-w-md mx-auto relative shadow-md' },
      
      // --- SIDEBAR OVERLAY & MENU ---
      isSidebarOpen && React.createElement('div', { 
        className: 'fixed inset-0 bg-black/50 z-40 max-w-md mx-auto',
        onClick: () => setIsSidebarOpen(false)
      }),
      
      React.createElement('div', { className: `fixed top-0 left-0 bottom-0 w-72 bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} max-w-md` },
        React.createElement('div', { className: 'p-5 flex justify-between items-center border-b border-gray-100' },
          React.createElement('h2', { className: 'font-bold text-lg text-gray-900' }, 'Menu Options'),
          React.createElement('button', { onClick: () => setIsSidebarOpen(false), className: 'p-1 hover:bg-gray-100 rounded-full' }, 
            React.createElement('ion-icon', { name: 'close-outline', style: { fontSize: '24px' } })
          )
        ),
        React.createElement('div', { className: 'p-4' },
          React.createElement('p', { className: 'text-sm text-gray-400 italic px-2 py-4' }, 'Sidebar features layout placeholder. We can configure these navigation options later.')
        )
      ),

      // --- HEADER BLOCK ---
      React.createElement('div', { className: 'relative bg-[#121212] text-white pt-12 pb-6 px-4 rounded-b-[24px] overflow-hidden' },
        React.createElement('div', { className: 'relative z-10 flex justify-between items-center mb-4' },
          React.createElement('button', { onClick: () => setIsSidebarOpen(true), className: 'p-1 -ml-1' }, 
            React.createElement('ion-icon', { name: 'menu-outline', style: { fontSize: '26px' } })
          ),
          React.createElement('div', { className: 'flex items-center space-x-5' },
            React.createElement('button', null, React.createElement('ion-icon', { name: 'flag-outline', style: { fontSize: '22px' } })),
            React.createElement('button', null, React.createElement('ion-icon', { name: 'settings-outline', style: { fontSize: '22px' } }))
          )
        ),
        React.createElement('div', { className: 'relative z-10 mb-2' },
          React.createElement('h1', { className: 'text-[17px] font-semibold text-gray-400' }, 'Monetization')
        ),
        React.createElement('div', { className: 'relative z-10 flex items-center mb-1 w-fit' },
          React.createElement('span', { className: 'text-2xl font-bold self-start mt-1 mr-0.5' }, '$'),
          React.createElement('span', { className: 'text-4xl font-bold' }, '0.00'),
          React.createElement('ion-icon', { name: 'chevron-forward-outline', style: { color: '#9ca3af', marginLeft: '4px', marginTop: '6px' } })
        ),
        React.createElement('div', { className: 'relative z-10 flex items-center space-x-1 mb-5 text-[12px] text-gray-400' },
          React.createElement('span', null, 'Estimated rewards in the last 7 days'),
          React.createElement('ion-icon', { name: 'help-circle-outline' })
        ),
        React.createElement('div', { className: 'relative z-10 bg-white/10 rounded-xl px-4 py-3.5 flex justify-between items-center' },
          React.createElement('span', { className: 'text-[14px] font-medium text-gray-200' }, 'Balance: $0.00'),
          React.createElement('div', { className: 'flex items-center space-x-0.5 text-gray-400 text-[13px]' },
            React.createElement('span', null, 'View'),
            React.createElement('ion-icon', { name: 'chevron-forward-outline' })
          )
        )
      ),

      // --- BODY CONTENT AREA ---
      React.createElement('div', { className: 'px-4 py-5 space-y-4' },
        
        // Rewards Analytics
        React.createElement('div', { className: 'bg-white rounded-2xl p-4 shadow-sm' },
          React.createElement('div', { className: 'flex justify-between items-center mb-3.5' },
            React.createElement('h2', { className: 'text-[16px] font-bold' }, 'Rewards analytics'),
            React.createElement('div', { className: 'flex items-center text-gray-400 text-[13px]' },
              React.createElement('span', null, 'View all'),
              React.createElement('ion-icon', { name: 'chevron-forward-outline' })
            )
          ),
          React.createElement('div', { className: 'bg-[#F8F8FA] rounded-xl p-4' },
            React.createElement('div', { className: 'text-[24px] font-bold' }, '$0.00'),
            React.createElement('div', { className: 'text-[12px] font-medium text-gray-500 mt-0.5' }, 'LIVE rewards'),
            React.createElement('div', { className: 'text-[12px] font-semibold text-gray-400 mt-1' }, '0.0% 7d')
          )
        ),

        // Active Programs
        React.createElement('div', { className: 'bg-white rounded-2xl p-4 shadow-sm' },
          React.createElement('h2', { className: 'text-[16px] font-bold mb-3.5' }, 'Active programs'),
          React.createElement('div', { className: 'flex flex-col items-start' },
            React.createElement('div', { className: 'w-14 h-14 bg-[#F8F8FA] rounded-2xl flex items-center justify-center mb-2' },
              React.createElement('ion-icon', { name: 'gift-outline', style: { fontSize: '24px' } })
            ),
            React.createElement('span', { className: 'text-[12px] font-bold' }, 'LIVE rewards')
          )
        ),

        // Programs For You
        React.createElement('div', { className: 'bg-white rounded-2xl p-4 shadow-sm' },
          React.createElement('div', { className: 'flex justify-between items-center mb-4' },
            React.createElement('div', { className: 'flex items-center space-x-1' },
              React.createElement('h2', { className: 'text-[16px] font-bold' }, 'Programs for you'),
              React.createElement('ion-icon', { name: 'help-circle-outline', style: { color: '#9ca3af' } })
            ),
            React.createElement('div', { className: 'flex items-center text-gray-400 text-[13px]' },
              React.createElement('span', null, 'View all'),
              React.createElement('ion-icon', { name: 'chevron-forward-outline' })
            )
          ),
          React.createElement('div', { className: 'divide-y divide-gray-100' },
            
            // Work with Artists
            React.createElement('div', { className: 'flex items-start py-4' },
              React.createElement('div', { className: 'mt-0.5 mr-3.5' }, React.createElement('ion-icon', { name: 'musical-notes-outline', style: { fontSize: '20px' } })),
              React.createElement('div', { className: 'flex-1 pr-2' },
                React.createElement('div', { className: 'flex items-center space-x-2' },
                  React.createElement('span', { className: 'text-[15px] font-bold' }, 'Work with Artists'),
                  React.createElement('span', { className: 'bg-[#EFEFEF] text-[#666666] text-[10px] font-bold px-1.5 py-0.5 rounded-md' }, '🔒 1/2')
                ),
                React.createElement('p', { className: 'text-[13px] text-gray-500 mt-1' }, 'Create posts with featured sounds and get paid based on how your post performs.')
              ),
              React.createElement('ion-icon', { name: 'chevron-forward-outline', style: { color: '#d1d5db', alignSelf: 'center' } })
            ),

            // Video Gifts
            React.createElement('div', { className: 'flex items-start py-4' },
              React.createElement('div', { className: 'mt-0.5 mr-3.5' }, React.createElement('ion-icon', { name: 'videocam-outline', style: { fontSize: '20px' } })),
              React.createElement('div', { className: 'flex-1 pr-2' },
                React.createElement('div', { className: 'flex items-center space-x-2' },
                  React.createElement('span', { className: 'text-[15px] font-bold' }, 'Video Gifts'),
                  React.createElement('span', { className: 'bg-[#EFEFEF] text-[#666666] text-[10px] font-bold px-1.5 py-0.5 rounded-md' }, '🔒 4/5')
                ),
                React.createElement('p', { className: 'text-[13px] text-gray-500 mt-1' }, 'Get Gifts for your top-performing videos.')
              ),
              React.createElement('ion-icon', { name: 'chevron-forward-outline', style: { color: '#d1d5db', alignSelf: 'center' } })
            ),

            // Subscription
            React.createElement('div', { className: 'flex items-start py-4' },
              React.createElement('div', { className: 'mt-0.5 mr-3.5' }, React.createElement('ion-icon', { name: 'star-outline', style: { fontSize: '20px' } })),
              React.createElement('div', { className: 'flex-1 pr-2' },
                React.createElement('div', { className: 'flex items-center space-x-2' },
                  React.createElement('span', { className: 'text-[15px] font-bold' }, 'Subscription'),
                  React.createElement('span', { className: 'bg-[#EFEFEF] text-[#666666] text-[10px] font-bold px-1.5 py-0.5 rounded-md' }, '🔒 2/4')
                ),
                React.createElement('p', { className: 'text-[13px] text-gray-500 mt-1' }, 'Connect more closely with viewers through subscriber-only content and benefits.')
              ),
              React.createElement('ion-icon', { name: 'chevron-forward-outline', style: { color: '#d1d5db', alignSelf: 'center' } })
            )

          )
        )

      )
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(MonetizationDashboard));
