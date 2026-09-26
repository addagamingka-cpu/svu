import React from 'react';
import { Calendar, PlusCircle, Ticket, BadgeCheck } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  onChangeTab: (tab: string) => void;
  passCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onChangeTab,
  passCount
}) => {
  const tabs = [
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'post-event', label: 'Post Event', icon: PlusCircle, isCreate: true },
    { id: 'my-passes', label: 'My Passes', icon: Ticket, badge: passCount },
    { id: 'profile', label: 'Profile', icon: BadgeCheck }
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-[#ecfdf6]/95 backdrop-blur-xl border-t border-[#0d4a36]/10 shadow-[0_-4px_20px_rgba(0,50,34,0.06)] pb-safe">
      <div className="max-w-md mx-auto h-16 px-4 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[64px] h-12 transition-all relative ${
                isActive ? 'text-[#003222]' : 'text-[#404944] hover:text-[#003222]'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-6 h-6 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.75]'
                  } ${tab.isCreate && !isActive ? 'text-[#855300]' : ''}`}
                />
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 px-1.5 py-0.2 bg-[#fea619] text-[#684000] text-[9px] font-black rounded-full shadow-sm">
                    {tab.badge}
                  </span>
                ) : null}
              </div>
              <span
                className={`text-[10px] mt-0.5 tracking-tight ${
                  isActive ? 'font-black text-[#003222]' : 'font-medium'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#003222] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
