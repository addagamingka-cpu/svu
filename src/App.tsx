/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Search,
  SlidersHorizontal,
  Flame,
  PartyPopper,
  Zap,
  Sparkles,
  Theater,
  Trophy,
  GraduationCap,
  Calendar as CalendarIcon,
  Radio,
  Rocket,
  ChevronRight,
  Plus
} from 'lucide-react';
import { CampusEvent, EventPass, NotificationItem, StudentProfile } from './types';
import { INITIAL_EVENTS } from './data/mockEvents';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { EventCard } from './components/EventCard';
import { EventDetailModal } from './components/EventDetailModal';
import { PostEventView } from './components/PostEventView';
import { PassesView } from './components/PassesView';
import { ProfileView } from './components/ProfileView';
import { LoginModal } from './components/LoginModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import {
  fetchEvents,
  createNewEvent,
  registerForEvent,
  getSavedProfile,
  saveProfile,
  getSavedPasses
} from './services/eventService';
import {
  getSavedNotifications,
  markNotificationsAsRead,
  clearAllNotifications,
  scheduleEventReminder,
  sendPushNotification
} from './services/notificationService';

export default function App() {
  const [events, setEvents] = useState<CampusEvent[]>(INITIAL_EVENTS);
  const [currentTab, setCurrentTab] = useState<'events' | 'post-event' | 'my-passes' | 'profile'>('events');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [timelineMode, setTimelineMode] = useState<'all' | 'live' | 'upcoming'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals & Panels
  const [selectedEvent, setSelectedEvent] = useState<CampusEvent | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // User State
  const [student, setStudent] = useState<StudentProfile>(getSavedProfile());
  const [passes, setPasses] = useState<EventPass[]>(getSavedPasses());
  const [notifications, setNotifications] = useState<NotificationItem[]>(getSavedNotifications());

  // Real-time synchronization
  useEffect(() => {
    // 1. Initial fetch
    fetchEvents().then((loadedEvents) => {
      if (loadedEvents && loadedEvents.length > 0) {
        setEvents(loadedEvents);
      }
    });

    // 2. Server-Sent Events (SSE) connection
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource('/api/events/stream');

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'INITIAL_EVENTS') {
            setEvents(data.payload);
          } else if (data.type === 'EVENT_CREATED') {
            setEvents((prev) => {
              const exists = prev.some((e) => e.id === data.payload.id);
              if (exists) return prev;
              return [data.payload, ...prev];
            });
            // Update notifications
            setNotifications(getSavedNotifications());
          } else if (data.type === 'EVENT_RSVP_UPDATED') {
            setEvents((prev) =>
              prev.map((e) =>
                e.id === data.payload.id
                  ? { ...e, attendeeCount: data.payload.attendeeCount }
                  : e
              )
            );
          } else if (data.type === 'PUSH_NOTIFICATION') {
            setNotifications((prev) => [data.payload, ...prev]);
          }
        } catch {
          // SSE format error
        }
      };

      eventSource.onerror = () => {
        eventSource?.close();
      };
    } catch {
      // EventSource fallback
    }

    // 3. Multi-Tab BroadcastChannel
    let broadcastChannel: BroadcastChannel | null = null;
    let notifChannel: BroadcastChannel | null = null;

    if ('BroadcastChannel' in window) {
      try {
        broadcastChannel = new BroadcastChannel('svu_events_sync_channel');
        broadcastChannel.onmessage = (msg) => {
          if (msg.data?.type === 'EVENT_CREATED') {
            setEvents((prev) => {
              const exists = prev.some((e) => e.id === msg.data.payload.id);
              return exists ? prev : [msg.data.payload, ...prev];
            });
          } else if (msg.data?.type === 'EVENT_RSVP_UPDATED') {
            setEvents((prev) =>
              prev.map((e) =>
                e.id === msg.data.payload.id
                  ? { ...e, attendeeCount: msg.data.payload.attendeeCount }
                  : e
              )
            );
          }
        };

        notifChannel = new BroadcastChannel('svu_notifications_channel');
        notifChannel.onmessage = (msg) => {
          if (msg.data?.type === 'NEW_NOTIFICATION') {
            setNotifications((prev) => [msg.data.payload, ...prev]);
          }
        };
      } catch {
        // BroadcastChannel unavailable
      }
    }

    return () => {
      eventSource?.close();
      broadcastChannel?.close();
      notifChannel?.close();
    };
  }, []);

  // Sync notifications from storage periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications(getSavedNotifications());
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Filter Categories list
  const categoryPills = [
    { id: 'all', label: 'All Events', icon: Flame, emoji: '🔥' },
    { id: 'fest', label: 'College Fest', icon: PartyPopper, emoji: '🎉' },
    { id: 'hackathon', label: 'Hackathons', icon: Zap, emoji: '⚡' },
    { id: 'freshers', label: 'Freshers 2026', icon: Sparkles, emoji: '🌟' },
    { id: 'cultural', label: 'Cultural & Drama', icon: Theater, emoji: '🎭' },
    { id: 'sports', label: 'Sports', icon: Trophy, emoji: '⚽' },
    { id: 'workshop', label: 'Workshops', icon: GraduationCap, emoji: '🤖' }
  ];

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      // Category filter
      if (selectedCategory !== 'all' && ev.category !== selectedCategory) {
        return false;
      }
      // Timeline mode
      if (timelineMode === 'live' && ev.status !== 'live') {
        return false;
      }
      if (timelineMode === 'upcoming' && ev.status === 'live') {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          ev.title.toLowerCase().includes(q) ||
          ev.venue.toLowerCase().includes(q) ||
          ev.description.toLowerCase().includes(q) ||
          ev.organizer.toLowerCase().includes(q) ||
          ev.categoryLabel.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [events, selectedCategory, timelineMode, searchQuery]);

  // Live Highlight Event
  const liveHighlightEvent = useMemo(() => {
    return events.find((e) => e.status === 'live') || events[0];
  }, [events]);

  // Upcoming Events list
  const upcomingEvents = useMemo(() => {
    return filteredEvents.filter((e) => e.id !== liveHighlightEvent?.id || timelineMode === 'live');
  }, [filteredEvents, liveHighlightEvent, timelineMode]);

  // Pass lookup
  const getPassForEvent = useCallback(
    (eventId: string) => passes.find((p) => p.eventId === eventId),
    [passes]
  );

  // Handlers
  const handleSelectEvent = (event: CampusEvent) => {
    setSelectedEvent(event);
    setIsDetailOpen(true);
  };

  const handleSelectEventById = (eventId: string) => {
    const found = events.find((e) => e.id === eventId);
    if (found) {
      handleSelectEvent(found);
    }
  };

  const handleClaimPass = async (event: CampusEvent) => {
    if (!student.isLoggedIn) {
      setIsLoginOpen(true);
      return;
    }
    const newPass = await registerForEvent(event, student);
    setPasses((prev) => [newPass, ...prev.filter((p) => p.eventId !== event.id)]);
    setEvents((prev) =>
      prev.map((e) =>
        e.id === event.id ? { ...e, attendeeCount: e.attendeeCount + 1 } : e
      )
    );
    // Keep detail open and switch to pass tab
    setSelectedEvent(event);
    setIsDetailOpen(true);
  };

  const handleSetReminder = (
    event: CampusEvent,
    type: '15m' | '1h' | '1d' | 'immediate'
  ) => {
    scheduleEventReminder(event.id, event.title, event.startTime, event.venue, type);
    setNotifications(getSavedNotifications());
  };

  const handleCreateEvent = async (eventData: Partial<CampusEvent>) => {
    const created = await createNewEvent({
      ...eventData,
      organizer: student.name + ' & Student Council',
      organizerRegNo: student.rollNo
    });
    setEvents((prev) => [created, ...prev]);
    setNotifications(getSavedNotifications());
  };

  const handleLoginSuccess = (updated: StudentProfile) => {
    setStudent(updated);
    saveProfile(updated);
    sendPushNotification(
      `Welcome to SVU Campus Pulse, ${updated.name}! 🎓`,
      `Verified Roll ID ${updated.rollNo} attached. Your event fastpasses are active.`,
      { type: 'pass' }
    );
    setNotifications(getSavedNotifications());
  };

  const handleLogout = () => {
    const guest: StudentProfile = {
      isLoggedIn: false,
      phone: '',
      rollNo: '',
      name: 'Student Guest',
      department: 'Swami Vivekananda University',
      batch: '2026',
      avatarUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAlyPd408KMj4U8ribICXzDMAeL4KLLSZhMFtEgj-LvYWQ1YDCa6v2qnRE_cYENomYefuxfBbHA4uIVLQSw_qXRVTnKcMilI6ieIkJCvduXVPOmgMoD6hbQHsOOSa6faSSy4NmsMU_G2uFca4SU7d6nR1Azk8W1wSWefjcOG_RadSwWvkW7Ws8HMj6xWN0bM2YAypBSKCQ7cVU5BlqZVQMtwOKhE4xSp-M24XQq8VYIvL9ye-Jtjhfi',
      isVerified: false
    };
    setStudent(guest);
    saveProfile(guest);
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-[#ecfdf6] text-[#0f1e1a] flex flex-col font-sans selection:bg-[#99d3b8] selection:text-[#003222]">
      {/* Top Application Bar */}
      <Header
        currentTab={currentTab}
        student={student}
        unreadCount={unreadNotificationsCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenProfile={() => setCurrentTab('profile')}
        onOpenLogin={() => setIsLoginOpen(true)}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 pt-16">
        {currentTab === 'events' && (
          <div className="w-full max-w-md mx-auto flex flex-col pb-28">
            {/* Sticky Search & Filter Bar */}
            <div className="sticky top-16 z-30 bg-[#ecfdf6]/90 backdrop-blur-md px-4 py-2.5 flex flex-col gap-2.5 border-b border-[#0d4a36]/5">
              {/* Search Input Box */}
              <div className="relative w-full">
                <Search className="w-4 h-4 text-[#707974] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search fests, hackathons, freshers, workshops..."
                  className="w-full h-11 pl-10 pr-10 rounded-xl bg-[#dbece5] text-xs text-[#0f1e1a] placeholder:text-[#404944]/70 outline-none focus:bg-[#d5e6e0] transition-colors"
                />
                <button
                  type="button"
                  aria-label="Filter"
                  onClick={() => {
                    if (searchQuery) setSearchQuery('');
                  }}
                  className="w-7 h-7 absolute right-2.5 top-1/2 -translate-y-1/2 text-[#707974] hover:text-[#003222] flex items-center justify-center"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>

              {/* Horizontal Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar">
                {categoryPills.map((pill) => {
                  const isSelected = selectedCategory === pill.id;
                  return (
                    <button
                      key={pill.id}
                      onClick={() => setSelectedCategory(pill.id)}
                      className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 flex items-center gap-1 ${
                        isSelected
                          ? 'bg-[#003222] text-white shadow-sm'
                          : 'bg-[#dbece5] text-[#404944] hover:bg-[#d5e6e0]'
                      }`}
                    >
                      <span>{pill.emoji}</span>
                      <span>{pill.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Segmented Live / Upcoming Toggle */}
              <div className="bg-[#dbece5] p-1 rounded-xl flex items-center justify-between gap-1 shadow-inner">
                <button
                  onClick={() => setTimelineMode(timelineMode === 'live' ? 'all' : 'live')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    timelineMode === 'live'
                      ? 'bg-white text-[#003222] shadow-sm'
                      : 'text-[#404944] hover:text-[#003222]'
                  }`}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#fea619] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#fea619]" />
                  </span>
                  <span>Happening Now (Live)</span>
                </button>

                <button
                  onClick={() => setTimelineMode(timelineMode === 'upcoming' ? 'all' : 'upcoming')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    timelineMode === 'upcoming'
                      ? 'bg-white text-[#003222] shadow-sm'
                      : 'text-[#404944] hover:text-[#003222]'
                  }`}
                >
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span>Upcoming Events</span>
                </button>
              </div>
            </div>

            {/* Event Cards Feed */}
            <div className="px-4 flex flex-col gap-4 mt-3">
              {/* SECTION 1: Happening on Campus Today (Live Spotlight) */}
              {(timelineMode === 'all' || timelineMode === 'live') &&
                liveHighlightEvent &&
                !searchQuery &&
                selectedCategory === 'all' && (
                  <section className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#fea619] animate-pulse" />
                        <h2 className="text-base font-extrabold text-[#003222]">
                          Happening on Campus Today
                        </h2>
                      </div>
                      <span className="text-[10px] font-extrabold text-[#855300] bg-[#ffddb8]/50 px-2 py-0.5 rounded-full uppercase">
                        {liveHighlightEvent.statusBadge || 'Day 2 Active'}
                      </span>
                    </div>

                    <EventCard
                      event={liveHighlightEvent}
                      isHeroLive={true}
                      hasPass={Boolean(getPassForEvent(liveHighlightEvent.id))}
                      student={student}
                      onSelectEvent={handleSelectEvent}
                      onOpenPass={handleSelectEvent}
                      onSetReminder={handleSetReminder}
                      onRSVP={handleClaimPass}
                    />
                  </section>
                )}

              {/* SECTION 2: Upcoming Major Highlights / Filtered Feed */}
              <section className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-extrabold text-[#003222]">
                      {searchQuery
                        ? `Search Results (${filteredEvents.length})`
                        : timelineMode === 'live'
                        ? 'Active Campus Events'
                        : 'Upcoming Major Highlights'}
                    </h2>
                    <p className="text-[11px] text-[#404944]">
                      Confirmed technical symposiums, welcomes & meets
                    </p>
                  </div>
                  {filteredEvents.length > 3 && (
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setTimelineMode('all');
                      }}
                      className="text-[#855300] text-xs font-bold flex items-center gap-0.5 hover:underline"
                    >
                      <span>See all</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Cards List */}
                {upcomingEvents.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 border border-[#0d4a36]/10 text-center flex flex-col items-center gap-2">
                    <CalendarIcon className="w-8 h-8 text-[#707974]" />
                    <p className="text-xs font-bold text-[#0f1e1a]">No matching events found</p>
                    <p className="text-[11px] text-[#404944]">
                      Try changing your search keywords or category filters.
                    </p>
                  </div>
                ) : (
                  upcomingEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      isHeroLive={event.status === 'live'}
                      hasPass={Boolean(getPassForEvent(event.id))}
                      student={student}
                      onSelectEvent={handleSelectEvent}
                      onOpenPass={handleSelectEvent}
                      onSetReminder={handleSetReminder}
                      onRSVP={handleClaimPass}
                    />
                  ))
                )}
              </section>

              {/* Campus Host CTA Banner */}
              <div
                onClick={() => setCurrentTab('post-event')}
                className="rounded-2xl p-4 bg-gradient-to-r from-[#003222] via-[#0d4a36] to-[#003220] text-white flex items-center justify-between gap-3 shadow-md cursor-pointer hover:shadow-lg active:scale-[0.99] transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[#fea619] text-[#684000] flex items-center justify-center shrink-0 shadow-sm">
                    <Rocket className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-black leading-tight truncate">
                      Organizing an event?
                    </span>
                    <span className="text-[11px] text-[#80b99f] truncate">
                      Tap Post Event below to publish to all students
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Post Event"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {currentTab === 'post-event' && (
          <PostEventView
            student={student}
            onEventCreated={handleCreateEvent}
            onNavigateHome={() => setCurrentTab('events')}
          />
        )}

        {currentTab === 'my-passes' && (
          <PassesView
            passes={passes}
            student={student}
            onExploreEvents={() => setCurrentTab('events')}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileView
            student={student}
            passes={passes}
            onUpdateProfile={(updated) => {
              setStudent(updated);
              saveProfile(updated);
            }}
            onOpenLogin={() => setIsLoginOpen(true)}
            onLogout={handleLogout}
            onExploreEvents={() => setCurrentTab('events')}
          />
        )}
      </main>

      {/* Floating Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onChangeTab={(tab: string) => setCurrentTab(tab as any)}
        passCount={passes.length}
      />

      {/* Event Details & FastPass Modal */}
      <EventDetailModal
        event={selectedEvent}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        pass={selectedEvent ? getPassForEvent(selectedEvent.id) : undefined}
        student={student}
        onClaimPass={handleClaimPass}
        onSetReminder={handleSetReminder}
      />

      {/* Student Phone / Roll ID Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        currentProfile={student}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Notification Center & Push Reminders Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() => {
          const updated = markNotificationsAsRead();
          setNotifications(updated);
        }}
        onClearAll={() => {
          clearAllNotifications();
          setNotifications([]);
        }}
        onSelectEventById={handleSelectEventById}
      />
    </div>
  );
}
