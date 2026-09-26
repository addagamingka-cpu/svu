import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  Users,
  Trophy,
  Share2,
  Ticket,
  Bell,
  Check,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { CampusEvent, StudentProfile } from '../types';

interface EventCardProps {
  event: CampusEvent;
  isHeroLive?: boolean;
  hasPass: boolean;
  student: StudentProfile;
  onSelectEvent: (event: CampusEvent) => void;
  onOpenPass: (event: CampusEvent) => void;
  onSetReminder: (event: CampusEvent, type: '15m' | '1h' | '1d' | 'immediate') => void;
  onRSVP: (event: CampusEvent) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  isHeroLive = false,
  hasPass,
  onSelectEvent,
  onOpenPass,
  onSetReminder,
  onRSVP
}) => {
  const [showReminderMenu, setShowReminderMenu] = useState(false);
  const [reminderSaved, setReminderSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `${event.title} - ${event.dateDisplay} at ${event.venue}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(`${event.title} | ${event.dateDisplay} @ ${event.venue}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleScheduleReminder = (
    e: React.MouseEvent,
    type: '15m' | '1h' | '1d' | 'immediate'
  ) => {
    e.stopPropagation();
    onSetReminder(event, type);
    setShowReminderMenu(false);
    setReminderSaved(true);
    setTimeout(() => setReminderSaved(false), 3000);
  };

  // 1. LIVE HERO SPOTLIGHT CARD (Mukta Mancha / Independence Day style)
  if (isHeroLive || event.status === 'live') {
    return (
      <div
        onClick={() => onSelectEvent(event)}
        className="relative w-full rounded-2xl overflow-hidden shadow-lg bg-[#24332f] text-white cursor-pointer group transition-all duration-300 hover:shadow-xl border border-[#0d4a36]/30"
      >
        {/* Fest Visual Backdrop */}
        <div className="relative w-full h-64 overflow-hidden flex flex-col justify-between p-4">
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Gradient Scrims */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/30" />

          {/* Top Status Badges */}
          <div className="relative z-10 flex items-center justify-between w-full">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ba1a1a] text-white text-[11px] font-extrabold uppercase shadow-md tracking-wider">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              Live Now
            </span>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#ffddb8] text-[11px] font-semibold border border-white/10">
              <Users className="w-3.5 h-3.5 text-[#fea619]" />
              <span>{event.attendeeCount.toLocaleString()} Students Inside</span>
            </div>
          </div>

          {/* Bottom Card Headings */}
          <div className="relative z-10 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-[#ffb95f] text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{event.organizer}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-md">
              {event.title}
            </h3>
            {event.subtitle && (
              <p className="text-xs font-semibold text-[#6ffbbe]">
                {event.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Card Footer Bar */}
        <div className="p-4 bg-[#0d4a36] flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2 text-[#80b99f] text-xs">
            <div className="flex items-center gap-1.5 truncate">
              <Calendar className="w-4 h-4 text-[#fea619] shrink-0" />
              <span className="font-semibold text-white truncate">{event.dateDisplay}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-4 h-4 text-[#fea619] shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2 pt-0.5">
            {hasPass ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenPass(event);
                }}
                className="flex-1 h-11 rounded-xl bg-[#fea619] text-[#684000] font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all"
              >
                <Ticket className="w-4 h-4" />
                <span>View FastPass & Gate QR</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRSVP(event);
                }}
                className="flex-1 h-11 rounded-xl bg-[#fea619] text-[#684000] font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all hover:brightness-105"
              >
                <Ticket className="w-4 h-4" />
                <span>Get Pass / View Live Schedule</span>
              </button>
            )}

            {/* Reminder Dropdown Button */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowReminderMenu(!showReminderMenu);
                }}
                title="Push Notification Reminder"
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                  reminderSaved
                    ? 'bg-[#10b981] text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {reminderSaved ? <Check className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
              </button>

              {showReminderMenu && (
                <div className="absolute right-0 bottom-13 w-56 bg-white text-[#0f1e1a] rounded-xl shadow-2xl border border-[#c0c9c2]/50 p-2 z-30 flex flex-col gap-1 text-xs">
                  <span className="font-bold text-[11px] text-[#404944] px-2 py-1">
                    Push Notification Reminders:
                  </span>
                  <button
                    onClick={(e) => handleScheduleReminder(e, 'immediate')}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#e0f2eb] font-semibold text-[#003222] flex items-center justify-between"
                  >
                    <span>⚡ Test Push Alert Now</span>
                  </button>
                  <button
                    onClick={(e) => handleScheduleReminder(e, '15m')}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#e0f2eb] font-medium"
                  >
                    15 mins before
                  </button>
                  <button
                    onClick={(e) => handleScheduleReminder(e, '1h')}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#e0f2eb] font-medium"
                  >
                    1 hour before
                  </button>
                </div>
              )}
            </div>

            {/* Share Button */}
            <button
              type="button"
              onClick={handleShare}
              title="Share event"
              className="w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center shrink-0 active:scale-95 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-[#6ffbbe]" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. STANDARD / UPCOMING MAJOR HIGHLIGHT CARD
  return (
    <div
      onClick={() => onSelectEvent(event)}
      className="rounded-2xl bg-white p-4 shadow-sm border border-[#0d4a36]/10 flex flex-col gap-3 cursor-pointer hover:shadow-md transition-all group"
    >
      {/* Visual Image Banner */}
      <div className="relative w-full h-36 rounded-xl overflow-hidden flex flex-col justify-between p-3 bg-[#0d4a36]">
        <img
          src={event.bannerUrl}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#003222]/85 via-[#003222]/20 to-transparent" />

        {/* Top Badges */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded-full bg-[#fea619] text-[#684000] text-[10px] font-extrabold uppercase shadow-sm">
            {event.statusBadge || `${event.categoryEmoji} ${event.categoryLabel}`}
          </span>

          <div className="flex items-center gap-1.5">
            {/* Reminder Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowReminderMenu(!showReminderMenu);
              }}
              className="w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm text-[#003222] flex items-center justify-center hover:bg-white transition-colors"
            >
              {reminderSaved ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Bell className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm text-[#003222] flex items-center justify-center hover:bg-white transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom Banner Labels */}
        <div className="relative z-10 flex items-center gap-2 text-white text-xs">
          <span className="px-2 py-0.5 rounded bg-white/90 text-[#003222] text-[10px] font-bold">
            {event.dateDisplay}
          </span>
          <span className="truncate flex items-center gap-1 text-[11px] drop-shadow">
            <MapPin className="w-3 h-3 text-[#fea619]" />
            {event.venue.split('(')[0]}
          </span>
        </div>

        {/* Floating Reminder Menu */}
        {showReminderMenu && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute top-10 right-3 w-52 bg-white text-[#0f1e1a] rounded-xl shadow-2xl border border-[#c0c9c2]/50 p-2 z-30 flex flex-col gap-1 text-xs"
          >
            <span className="font-bold text-[10px] text-[#404944] px-2 py-1">
              Push Notification Reminder:
            </span>
            <button
              onClick={(e) => handleScheduleReminder(e, 'immediate')}
              className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-[#e0f2eb] font-semibold text-[#003222]"
            >
              ⚡ Instant Push Test
            </button>
            <button
              onClick={(e) => handleScheduleReminder(e, '15m')}
              className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-[#e0f2eb]"
            >
              15 minutes before
            </button>
            <button
              onClick={(e) => handleScheduleReminder(e, '1h')}
              className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-[#e0f2eb]"
            >
              1 hour before
            </button>
          </div>
        )}
      </div>

      {/* Info & Badges */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-0.5 rounded-full bg-[#e0f2eb] text-[#003222] text-[10px] font-semibold">
            {event.organizer}
          </span>
          {event.prizes && (
            <span className="text-[#855300] text-[10px] font-bold flex items-center gap-0.5">
              <Trophy className="w-3 h-3 text-[#fea619]" />
              {event.prizes}
            </span>
          )}
        </div>

        <h3 className="text-base font-bold text-[#0f1e1a] group-hover:text-[#003222] transition-colors leading-snug">
          {event.title}
        </h3>

        <p className="text-xs text-[#404944] line-clamp-2 leading-relaxed">
          {event.description}
        </p>
      </div>

      {/* Perks Pills */}
      {event.perks && event.perks.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {event.perks.slice(0, 2).map((perk, i) => (
            <span
              key={i}
              className="px-2.5 py-0.5 rounded-md bg-[#e6f8f1] text-[#003222] text-[10px] font-medium border border-[#0d4a36]/10"
            >
              {perk}
            </span>
          ))}
          {event.perks.length > 2 && (
            <span className="px-2 py-0.5 rounded-md bg-[#e0f2eb] text-[#404944] text-[10px]">
              +{event.perks.length - 2} more
            </span>
          )}
        </div>
      )}

      {/* Card Action Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-[#0d4a36]/10">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1.5">
            <div className="w-5 h-5 rounded-full bg-[#003222] text-white text-[9px] font-bold flex items-center justify-center">
              AJ
            </div>
            <div className="w-5 h-5 rounded-full bg-[#fea619] text-[#684000] text-[9px] font-bold flex items-center justify-center">
              AS
            </div>
            <div className="w-5 h-5 rounded-full bg-[#d5e6e0] text-[#003222] text-[9px] font-bold flex items-center justify-center">
              +{event.attendeeCount}
            </div>
          </div>
          <span className="text-[11px] text-[#404944]">
            {event.attendeeCount} registered
          </span>
        </div>

        {hasPass ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenPass(event);
            }}
            className="h-8 px-3 rounded-lg bg-[#e0f2eb] text-[#003222] font-bold text-xs flex items-center gap-1 hover:bg-[#d5e6e0] transition-colors"
          >
            <Ticket className="w-3.5 h-3.5 text-[#004b32]" />
            <span>Pass Claimed</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRSVP(event);
            }}
            className="h-9 px-3.5 rounded-xl bg-[#003222] text-white font-bold text-xs flex items-center gap-1 shadow-sm active:scale-95 transition-all hover:bg-[#0d4a36]"
          >
            <span>RSVP / Register ID</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
