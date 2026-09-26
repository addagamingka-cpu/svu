import React from 'react';
import { Bell, ShieldCheck } from 'lucide-react';
import { StudentProfile } from '../types';

interface HeaderProps {
  currentTab: string;
  student: StudentProfile;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onOpenLogin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  student,
  unreadCount,
  onOpenNotifications,
  onOpenProfile,
  onOpenLogin
}) => {
  const getSubTitle = () => {
    switch (currentTab) {
      case 'post-event':
        return 'Post Event';
      case 'my-passes':
        return 'My Passes';
      case 'profile':
        return 'Student ID';
      default:
        return 'Events Feed';
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-[#ecfdf6]/90 backdrop-blur-xl border-b border-[#0d4a36]/10 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="max-w-md mx-auto h-16 px-4 flex items-center justify-between gap-2">
        {/* Left: SVU Insignia & Brand */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <img
            src="https://lh3.googleusercontent.com/aida/AEtjO1WiiBJPJHWOp9w12qrIJVV3UaTpWFl6cuxiFIzhwUevQXy42Db6LEpA-TCF1H6UE6kVlv0qCTP3FwyCySta5Eu7QfvmH3I4-bhsN_3g2vKU0H9GK9Uc97cmTP4bcw611TINsRhQq14WtroA7WJu20zSshRzc89UFqlW3VdmyoEUubyxUer7SEOVU4c3x3jUAC8kvfar691QPwcRjb_AQpkCaoRYrVj-QZyvL4VcSEynvV-dPFu_0m2XejcqL2Jz13B8JsylSyvzKw"
            alt="Swami Vivekananda University Logo"
            className="h-8 w-auto object-contain shrink-0 drop-shadow-sm"
          />
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] tracking-wider font-bold text-[#855300] uppercase truncate">
              Swami Vivekananda University
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[17px] font-bold text-[#003222] tracking-tight leading-tight truncate">
                Campus Pulse
              </span>
              <span className="text-[#c0c9c2] text-xs hidden sm:inline">•</span>
              <span className="text-xs font-semibold text-[#404944] truncate hidden sm:inline">
                {getSubTitle()}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Notification Bell & Profile Avatar */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onOpenNotifications}
            aria-label="Campus Notifications & Reminders"
            className="w-10 h-10 flex items-center justify-center rounded-full text-[#003222] hover:bg-[#e0f2eb] active:scale-95 transition-all relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#fea619] border-2 border-[#ecfdf6] animate-pulse" />
            )}
          </button>

          {student.isLoggedIn ? (
            <button
              onClick={onOpenProfile}
              aria-label="Student Profile"
              className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-full hover:bg-[#e0f2eb] active:scale-95 transition-all"
            >
              <div className="relative">
                {student.avatarUrl ? (
                  <img
                    src={student.avatarUrl}
                    alt={student.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-[#003222]/20"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#003222] text-[#6ffbbe] text-xs font-bold flex items-center justify-center ring-2 ring-[#003222]/20 shadow-sm">
                    {student.name.slice(0, 2).toUpperCase() || 'SV'}
                  </div>
                )}
                <span className="absolute -bottom-0.5 -right-0.5 bg-[#004b32] text-white rounded-full p-0.5">
                  <ShieldCheck className="w-2.5 h-2.5" />
                </span>
              </div>
              <div className="hidden xs:flex flex-col text-left leading-none">
                <span className="text-[11px] font-bold text-[#003222] truncate max-w-[80px]">
                  {student.name.split(' ')[0]}
                </span>
                <span className="text-[9px] text-[#404944] truncate max-w-[80px]">
                  {student.rollNo.split('/')[3] || 'SVU'}
                </span>
              </div>
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-3 py-1.5 rounded-xl bg-[#003222] text-white text-xs font-semibold shadow-sm hover:bg-[#0d4a36] active:scale-95 transition-all"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
