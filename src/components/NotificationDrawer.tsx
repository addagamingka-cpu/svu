import React, { useState } from 'react';
import {
  X,
  Bell,
  CheckCircle2,
  Calendar,
  Ticket,
  Megaphone,
  Trash2,
  Check,
  Volume2,
  VolumeX,
  Send
} from 'lucide-react';
import { NotificationItem } from '../types';
import {
  requestPushPermission,
  getPushPermissionStatus,
  sendPushNotification
} from '../services/notificationService';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onSelectEventById: (eventId: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onClearAll,
  onSelectEventById
}) => {
  const [permission, setPermission] = useState<NotificationPermission>(getPushPermissionStatus());
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [testSent, setTestSent] = useState(false);

  if (!isOpen) return null;

  const handleRequestPush = async () => {
    const res = await requestPushPermission();
    setPermission(res);
    if (res === 'granted') {
      sendPushNotification(
        '🔔 SVU Campus Pulse Push Alerts Active!',
        'You will receive instant alerts for new fests, hackathons, and event reminders.',
        { type: 'broadcast' }
      );
    }
  };

  const handleSendTestPush = () => {
    setTestSent(true);
    sendPushNotification(
      '🔥 SVU Campus Pulse Live Alert',
      'Band Faceoff is starting in 15 mins at Mukta Mancha! Bring your Student Roll ID.',
      { type: 'reminder' }
    );
    setTimeout(() => setTestSent(false), 2500);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'event':
        return <Megaphone className="w-4 h-4 text-[#fea619]" />;
      case 'pass':
        return <Ticket className="w-4 h-4 text-[#10b981]" />;
      case 'reminder':
        return <Calendar className="w-4 h-4 text-[#855300]" />;
      default:
        return <Bell className="w-4 h-4 text-[#003222]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#ecfdf6] h-full shadow-2xl flex flex-col border-l border-[#0d4a36]/20">
        {/* Header */}
        <div className="p-4 bg-white border-b border-[#0d4a36]/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#e0f2eb] flex items-center justify-center text-[#003222]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#003222]">
                Campus Pulse Alerts
              </h2>
              <span className="text-[10px] text-[#404944]">
                {notifications.filter((n) => !n.isRead).length} Unread Notifications
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute alert sounds' : 'Unmute alert sounds'}
              className="w-8 h-8 rounded-full text-[#404944] hover:bg-[#e0f2eb] flex items-center justify-center"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full text-[#0f1e1a] hover:bg-[#e0f2eb] flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Push Notification Permission Banner */}
        <div className="p-3 bg-[#e0f2eb] border-b border-[#0d4a36]/10 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#003222] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#10b981]" />
              Browser Push Notifications
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-[#404944] font-semibold">
              {permission.toUpperCase()}
            </span>
          </div>

          {permission !== 'granted' ? (
            <button
              onClick={handleRequestPush}
              className="w-full py-2 px-3 rounded-xl bg-[#003222] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm hover:bg-[#0d4a36] active:scale-95 transition-all"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Enable Push Notifications</span>
            </button>
          ) : (
            <button
              onClick={handleSendTestPush}
              className="w-full py-1.5 px-3 rounded-xl bg-white text-[#003222] border border-[#0d4a36]/20 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#d5e6e0] transition-colors"
            >
              <Send className="w-3 h-3 text-[#fea619]" />
              <span>{testSent ? 'Alert Dispatched!' : 'Send Test Push Reminder'}</span>
            </button>
          )}
        </div>

        {/* Notification Actions */}
        <div className="px-4 py-2 flex items-center justify-between text-xs border-b border-[#0d4a36]/5 bg-[#e6f8f1]">
          <button
            onClick={onMarkAllAsRead}
            className="text-[11px] font-bold text-[#004b32] hover:underline flex items-center gap-1"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
          <button
            onClick={onClearAll}
            className="text-[11px] font-bold text-[#ba1a1a] hover:underline flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear</span>
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5">
          {notifications.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-center p-4">
              <CheckCircle2 className="w-8 h-8 text-[#10b981] mb-2" />
              <p className="text-xs font-bold text-[#003222]">You are all caught up!</p>
              <p className="text-[11px] text-[#404944] mt-0.5">
                New college events and schedule reminders will pop up here in real-time.
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  if (notif.eventId) {
                    onSelectEventById(notif.eventId);
                    onClose();
                  }
                }}
                className={`p-3 rounded-xl transition-all border flex items-start gap-2.5 cursor-pointer ${
                  !notif.isRead
                    ? 'bg-white border-[#003222]/20 shadow-sm'
                    : 'bg-[#e6f8f1]/60 border-transparent hover:bg-white'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-[#e0f2eb] flex items-center justify-center shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-[#0f1e1a] truncate leading-tight">
                      {notif.title}
                    </span>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-[#fea619] shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-[#404944] leading-relaxed mt-0.5 line-clamp-2">
                    {notif.message}
                  </p>
                  <span className="text-[9px] text-[#707974] mt-1 font-medium">
                    {notif.time}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
