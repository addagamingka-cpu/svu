import { CampusEvent, EventPass, StudentProfile } from '../types';
import { INITIAL_EVENTS } from '../data/mockEvents';
import { sendPushNotification } from './notificationService';

const PASSES_STORAGE_KEY = 'svu_student_passes_v1';
const PROFILE_STORAGE_KEY = 'svu_student_profile_v1';
const LOCAL_EVENTS_STORAGE_KEY = 'svu_local_events_cache_v1';

// Default Student Profile matching collegiate access
export const DEFAULT_PROFILE: StudentProfile = {
  isLoggedIn: true,
  phone: '9876543210',
  rollNo: 'SVU/2023/BTECH/CS/042',
  name: 'Ayush Jana',
  department: 'Computer Science & Engineering',
  batch: '2023 - 2027 (3rd Year)',
  avatarUrl: '',
  isVerified: true
};

// Profile persistence
export function getSavedProfile(): StudentProfile {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: StudentProfile) {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // Ignore
  }
}

// Local Events Cache
export function getLocalCachedEvents(): CampusEvent[] {
  try {
    const raw = localStorage.getItem(LOCAL_EVENTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_EVENTS;
  } catch {
    return INITIAL_EVENTS;
  }
}

export function saveLocalCachedEvents(events: CampusEvent[]) {
  try {
    localStorage.setItem(LOCAL_EVENTS_STORAGE_KEY, JSON.stringify(events));
  } catch {
    // Ignore
  }
}

// Passes persistence
export function getSavedPasses(): EventPass[] {
  try {
    const raw = localStorage.getItem(PASSES_STORAGE_KEY);
    if (!raw) {
      // Provide initial fast pass for the live event
      const initialPass: EventPass = {
        id: 'pass-svu-live-01',
        eventId: 'ev-1',
        eventTitle: "SVU 'INDEPENDENCE DAY' SPECIAL 2026",
        eventDate: 'Today, Sep 26, 2026',
        eventTime: '06:00 PM onwards',
        venue: 'Mukta Mancha Amphitheatre',
        studentName: DEFAULT_PROFILE.name,
        rollNo: DEFAULT_PROFILE.rollNo,
        phone: '+91 ' + DEFAULT_PROFILE.phone,
        ticketCode: 'SVU-PASS-2026-ROCK99',
        gate: 'Gate 1 (North Arch)',
        seatType: 'Student FastPass / All-Access',
        issuedAt: Date.now() - 3600000
      };
      localStorage.setItem(PASSES_STORAGE_KEY, JSON.stringify([initialPass]));
      return [initialPass];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function savePass(pass: EventPass) {
  try {
    const passes = getSavedPasses().filter((p) => p.eventId !== pass.eventId);
    passes.unshift(pass);
    localStorage.setItem(PASSES_STORAGE_KEY, JSON.stringify(passes));
  } catch {
    // Ignore
  }
}

// REST & Real-time Integration
export async function fetchEvents(): Promise<CampusEvent[]> {
  try {
    const res = await fetch('/api/events');
    if (res.ok) {
      const data = await res.json();
      if (data.events && Array.isArray(data.events)) {
        saveLocalCachedEvents(data.events);
        return data.events;
      }
    }
  } catch {
    // Backend offline / Vite dev fallback
  }
  return getLocalCachedEvents();
}

export async function createNewEvent(eventData: Partial<CampusEvent>): Promise<CampusEvent> {
  const newEvent: CampusEvent = {
    id: `ev-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title: eventData.title || 'Untitled Event',
    subtitle: eventData.subtitle || 'Organized by SVU Students',
    description: eventData.description || 'Join us for this exciting campus event at Swami Vivekananda University.',
    category: eventData.category || 'fest',
    categoryLabel: eventData.categoryLabel || 'Campus Event',
    categoryEmoji: eventData.categoryEmoji || '🎉',
    status: eventData.status || 'upcoming',
    statusBadge: eventData.status === 'live' ? 'Live Now' : eventData.dateDisplay || 'Upcoming',
    date: eventData.date || new Date().toISOString().split('T')[0],
    dateDisplay: eventData.dateDisplay || eventData.date || 'Upcoming',
    startTime: eventData.startTime || '10:00',
    endTime: eventData.endTime || '17:00',
    venue: eventData.venue || 'SVU Central Lawn ("We Love SVU")',
    venueDetail: eventData.venueDetail || 'Barrackpore Campus',
    organizer: eventData.organizer || 'SVU Student Council',
    organizerRegNo: eventData.organizerRegNo || '006-121-2023-305',
    organizerRole: eventData.organizerRole || 'Verified Organizer',
    bannerUrl: eventData.bannerUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdglItc7ZXe0ePV9hX27MPYEgXDSD9ziGOLdRuNwJ-m6XhxYvNewLv4_e_InjnE9g6e9hkNZVcFYrwFSKU5kbWAglSglB-Drvnsv0AJr1dZ3SuU0JKf5E_Q6qXpMVVGwrO-VmIr7LOGZ2_P5fcux_-umlTDMkqv6l3PBxuoYqCop7GL5GS1JIHVRPJGbYhNvBRjJWK3zWIKMrYKBCHIvkesR1nSByn9CFBIlR1knIEnRf6ieyBiMchDcaVv8CFqlzFzogIZUA9-TBw3w',
    attendeeCount: 1,
    capacity: eventData.capacity || 500,
    prizes: eventData.prizes,
    perks: eventData.perks || ['Free for SVU Students', 'Student ID Required'],
    isStudentIdRequired: eventData.isStudentIdRequired ?? true,
    isFree: eventData.isFree ?? true,
    tags: eventData.tags || [eventData.categoryLabel || 'Event', 'SVU 2026'],
    schedule: eventData.schedule || [
      { time: '10:00 AM', title: 'Opening & Welcome', location: eventData.venue || 'Main Stage', description: 'Student arrival and seating' },
      { time: '01:00 PM', title: 'Main Program & Showcases', location: eventData.venue || 'Main Stage', description: 'Presentations and competitions' }
    ],
    keyAttractions: eventData.keyAttractions || ['Campus Gathering', 'Live Stage', 'Student Pass Entry'],
    createdAt: Date.now()
  };

  // 1. Try sending to Express server
  try {
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEvent)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.event) {
        // Return server-assigned event
        return data.event;
      }
    }
  } catch {
    // Fallback to local storage update
  }

  // 2. Local cache fallback & BroadcastChannel
  const current = getLocalCachedEvents();
  const updated = [newEvent, ...current];
  saveLocalCachedEvents(updated);

  // Broadcast to other tabs
  if ('BroadcastChannel' in window) {
    try {
      const channel = new BroadcastChannel('svu_events_sync_channel');
      channel.postMessage({ type: 'EVENT_CREATED', payload: newEvent });
      channel.close();
    } catch {
      // Ignore
    }
  }

  // Send push notification to all users
  sendPushNotification(
    `🚀 New Event Posted: ${newEvent.title}`,
    `${newEvent.dateDisplay} at ${newEvent.venue}. Claim your Student FastPass now!`,
    { type: 'event', eventId: newEvent.id, icon: newEvent.bannerUrl }
  );

  return newEvent;
}

export async function registerForEvent(
  event: CampusEvent,
  student: StudentProfile
): Promise<EventPass> {
  // Call server RSVP endpoint
  try {
    await fetch(`/api/events/${event.id}/rsvp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rollNo: student.rollNo, phone: student.phone })
    });
  } catch {
    // Continue
  }

  // Create Digital Pass
  const ticketCode = `SVU-PASS-${Math.floor(1000 + Math.random() * 9000)}-${event.category.toUpperCase()}`;
  const newPass: EventPass = {
    id: `pass-${Date.now()}-${event.id}`,
    eventId: event.id,
    eventTitle: event.title,
    eventDate: event.dateDisplay,
    eventTime: `${event.startTime} - ${event.endTime}`,
    venue: event.venue,
    studentName: student.name,
    rollNo: student.rollNo,
    phone: '+91 ' + student.phone,
    ticketCode,
    gate: event.venue.includes('Mukta Mancha') ? 'Gate 1 (North Arch)' : 'Gate 3 (Main Quad)',
    seatType: 'Verified Student Pass',
    issuedAt: Date.now()
  };

  savePass(newPass);

  // Send Push Notification
  sendPushNotification(
    `🎟️ Pass Confirmed: ${event.title}`,
    `Seat secured for ${student.name} (${student.rollNo}). Scan QR at ${newPass.gate}.`,
    { type: 'pass', eventId: event.id }
  );

  // Broadcast pass creation
  if ('BroadcastChannel' in window) {
    try {
      const channel = new BroadcastChannel('svu_events_sync_channel');
      channel.postMessage({ type: 'EVENT_RSVP_UPDATED', payload: { id: event.id, attendeeCount: event.attendeeCount + 1 } });
      channel.close();
    } catch {
      // Ignore
    }
  }

  return newPass;
}
