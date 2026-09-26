import { NotificationItem, ReminderSetting } from '../types';

const NOTIFS_STORAGE_KEY = 'svu_notifications_v1';
const REMINDERS_STORAGE_KEY = 'svu_reminders_v1';
const PUSH_AUDIO_URL = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';

// Play friendly sound chime if user interacted
export function playNotificationSound() {
  try {
    const audio = new Audio(PUSH_AUDIO_URL);
    audio.volume = 0.5;
    audio.play().catch(() => {
      // Audio autoplay policy fallback
    });
  } catch {
    // Ignore audio error
  }
}

// Request native browser Push Notification permission
export async function requestPushPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied';
  }
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch {
    return 'denied';
  }
}

export function getPushPermissionStatus(): NotificationPermission {
  if (!('Notification' in window)) {
    return 'denied';
  }
  return Notification.permission;
}

// Send native Web Push Notification + in-app notification
export function sendPushNotification(
  title: string,
  message: string,
  options?: {
    type?: 'event' | 'reminder' | 'broadcast' | 'pass';
    eventId?: string;
    icon?: string;
  }
) {
  playNotificationSound();

  const type = options?.type || 'broadcast';

  // 1. In-App Notification Record
  const newNotif: NotificationItem = {
    id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title,
    message,
    time: 'Just now',
    type,
    eventId: options?.eventId,
    isRead: false,
    timestamp: Date.now()
  };

  saveNotification(newNotif);

  // 2. Native System Web Push Notification
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body: message,
        icon: options?.icon || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFLTI8ZLxHjxKng_HQ1qHLL9i8r3nalgRLlI-NM0GTjcg6qyb9MGMsHnMaJBFNDkvLmG1dXwFeluaJ3mLQz6vcudK82aMwS-ZIJjg3_xwAcT0uUa9VCsQKP7o5v33LdTuJq4EV5bKmhVfhFT4gq9ki93EV5nr2dlNqFFO85YcyWTkG6QktCEAagmVysiT4l8ywJyk4NFbLPcTmtx4szNu1Tp2K-ynl98MsrQIl7HUFqFwKun9fWXwnaZ_oEeeG9e0XPg',
        badge: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFLTI8ZLxHjxKng_HQ1qHLL9i8r3nalgRLlI-NM0GTjcg6qyb9MGMsHnMaJBFNDkvLmG1dXwFeluaJ3mLQz6vcudK82aMwS-ZIJjg3_xwAcT0uUa9VCsQKP7o5v33LdTuJq4EV5bKmhVfhFT4gq9ki93EV5nr2dlNqFFO85YcyWTkG6QktCEAagmVysiT4l8ywJyk4NFbLPcTmtx4szNu1Tp2K-ynl98MsrQIl7HUFqFwKun9fWXwnaZ_oEeeG9e0XPg',
        tag: `svu-${Date.now()}`
      });
    } catch {
      // Browser notification failed or unsupported in iframe
    }
  }

  // Broadcast to other tabs
  if ('BroadcastChannel' in window) {
    try {
      const channel = new BroadcastChannel('svu_notifications_channel');
      channel.postMessage({ type: 'NEW_NOTIFICATION', payload: newNotif });
      channel.close();
    } catch {
      // Ignore broadcast error
    }
  }

  return newNotif;
}

// Local Storage helpers
export function getSavedNotifications(): NotificationItem[] {
  try {
    const raw = localStorage.getItem(NOTIFS_STORAGE_KEY);
    if (!raw) {
      // Initial default welcome notifications
      const defaults: NotificationItem[] = [
        {
          id: 'def-1',
          title: "SVU 'Independence Day' Special 2026 is LIVE! 🎸",
          message: 'Rock Night & Band Faceoff is active now at Mukta Mancha amphitheatre. 1,420 students checked in.',
          time: '15m ago',
          type: 'event',
          eventId: 'ev-1',
          isRead: false,
          timestamp: Date.now() - 15 * 60 * 1000
        },
        {
          id: 'def-2',
          title: 'Pass Ready: HackSVU 2026 Registration Open 💻',
          message: 'Department of CSE & IT opened ₹50,000 prize pool registration. Attach your Student ID.',
          time: '2h ago',
          type: 'broadcast',
          eventId: 'ev-2',
          isRead: true,
          timestamp: Date.now() - 2 * 60 * 60 * 1000
        }
      ];
      localStorage.setItem(NOTIFS_STORAGE_KEY, JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveNotification(item: NotificationItem) {
  try {
    const list = getSavedNotifications();
    const updated = [item, ...list].slice(0, 30);
    localStorage.setItem(NOTIFS_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Storage quota
  }
}

export function markNotificationsAsRead(): NotificationItem[] {
  try {
    const list = getSavedNotifications().map((n) => ({ ...n, isRead: true }));
    localStorage.setItem(NOTIFS_STORAGE_KEY, JSON.stringify(list));
    return list;
  } catch {
    return [];
  }
}

export function clearAllNotifications(): NotificationItem[] {
  try {
    localStorage.removeItem(NOTIFS_STORAGE_KEY);
  } catch {
    // Ignore
  }
  return [];
}

// Reminders
export function getSavedReminders(): ReminderSetting[] {
  try {
    const raw = localStorage.getItem(REMINDERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function scheduleEventReminder(
  eventId: string,
  eventTitle: string,
  eventTime: string,
  venue: string,
  type: '15m' | '1h' | '1d' | 'immediate'
) {
  const labelMap = {
    '15m': '15 minutes before',
    '1h': '1 hour before',
    '1d': '1 day before',
    'immediate': 'Instant Notification Test'
  };

  const reminder: ReminderSetting = {
    eventId,
    eventTitle,
    eventTime,
    venue,
    type,
    label: labelMap[type],
    createdTime: Date.now()
  };

  const current = getSavedReminders().filter((r) => r.eventId !== eventId);
  current.push(reminder);
  localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(current));

  if (type === 'immediate') {
    // Fire immediate reminder push notification
    sendPushNotification(
      `🔔 Reminder: ${eventTitle}`,
      `Starting soon at ${venue} (${eventTime}). Bring your Student ID badge!`,
      { type: 'reminder', eventId }
    );
  } else {
    // Acknowledge reminder scheduled
    sendPushNotification(
      `⏰ Push Reminder Scheduled!`,
      `We will notify you ${labelMap[type]} for "${eventTitle}" at ${venue}.`,
      { type: 'reminder', eventId }
    );
  }

  return reminder;
}
