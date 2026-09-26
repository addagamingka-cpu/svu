import React, { useState } from 'react';
import {
  X,
  Share2,
  Bookmark,
  Calendar,
  MapPin,
  Sparkles,
  Ticket,
  Clock,
  Download,
  Users,
  CheckCircle2,
  Bell,
  Check
} from 'lucide-react';
import { CampusEvent, EventPass, StudentProfile } from '../types';

interface EventDetailModalProps {
  event: CampusEvent | null;
  isOpen: boolean;
  onClose: () => void;
  pass: EventPass | undefined;
  student: StudentProfile;
  onClaimPass: (event: CampusEvent) => void;
  onSetReminder: (event: CampusEvent, type: '15m' | '1h' | '1d' | 'immediate') => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  isOpen,
  onClose,
  pass,
  student,
  onClaimPass,
  onSetReminder
}) => {
  const [activeTab, setActiveTab] = useState<'about' | 'lineup' | 'pass'>(
    pass ? 'pass' : 'about'
  );
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [reminderScheduled, setReminderScheduled] = useState(false);

  if (!isOpen || !event) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out ${event.title} at Swami Vivekananda University!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#ecfdf6] w-full max-w-lg h-full sm:h-auto sm:max-h-[92vh] sm:rounded-2xl overflow-hidden shadow-2xl border border-[#0d4a36]/20 flex flex-col">
        {/* Fixed Navigation Header */}
        <header className="h-14 px-4 bg-[#ecfdf6]/95 backdrop-blur-md border-b border-[#0d4a36]/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={onClose}
              aria-label="Back to feed"
              className="w-9 h-9 flex items-center justify-center rounded-full text-[#0f1e1a] hover:bg-[#e0f2eb] transition-colors -ml-1 shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-bold text-[#855300] uppercase truncate">
                SVU Campus Events
              </span>
              <h2 className="text-sm font-bold text-[#003222] truncate leading-tight">
                Event Details
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleShare}
              aria-label="Share"
              className="w-8 h-8 rounded-full bg-[#e0f2eb] flex items-center justify-center text-[#003222] hover:bg-[#d5e6e0] transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-[#10b981]" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setBookmarked(!bookmarked)}
              aria-label="Bookmark"
              className="w-8 h-8 rounded-full bg-[#e0f2eb] flex items-center justify-center text-[#003222] hover:bg-[#d5e6e0] transition-colors"
            >
              <Bookmark
                className={`w-4 h-4 ${bookmarked ? 'fill-[#003222]' : ''}`}
              />
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-24">
          {/* Hero Visual Card */}
          <div className="p-4 pb-2">
            <div className="relative w-full h-52 rounded-2xl overflow-hidden shadow-md bg-[#003222]">
              <img
                src={event.bannerUrl}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#003222]/90 via-[#003222]/30 to-transparent" />

              {/* Overlay Top Badges */}
              <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fea619] text-[#684000] text-[10px] font-extrabold uppercase shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#684000] animate-ping" />
                  {event.status === 'live' ? 'Live & Active Now' : 'Campus Event'}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-[#0d4a36]/80 text-[#80b99f] text-[10px] font-bold backdrop-blur-md flex items-center gap-1">
                  <Ticket className="w-3 h-3 text-[#fea619]" />
                  Free Student Pass
                </span>
              </div>

              {/* Overlay Bottom Labels */}
              <div className="absolute bottom-3 inset-x-3 text-white">
                <span className="text-[10px] font-bold text-[#ffddb8] uppercase tracking-wider">
                  Swami Vivekananda University
                </span>
                <p className="text-sm font-bold text-white truncate leading-tight">
                  {event.venue}
                </p>
              </div>
            </div>
          </div>

          {/* Event Title & Metadata */}
          <div className="px-4 py-2 flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#10b981]" />
              <span className="text-[11px] font-extrabold text-[#855300] uppercase tracking-wider">
                Official University Approved Event
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-[#003222] tracking-tight leading-tight">
              {event.title}
            </h1>

            <p className="text-xs text-[#404944] flex items-center gap-1.5">
              <span className="font-semibold">{event.organizer}</span>
              <span>• Reg: {event.organizerRegNo}</span>
            </p>

            {/* Logistics Grid */}
            <div className="mt-2 grid grid-cols-1 gap-2 bg-white p-3.5 rounded-2xl shadow-sm border border-[#0d4a36]/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#e0f2eb] flex items-center justify-center text-[#003222] shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-[#0f1e1a]">
                    {event.dateDisplay}
                  </span>
                  <span className="text-[11px] text-[#404944]">
                    {event.startTime} - {event.endTime}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#e0f2eb] flex items-center justify-center text-[#003222] shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-[#0f1e1a] truncate">
                    {event.venue}
                  </span>
                  <span className="text-[11px] text-[#404944] truncate">
                    {event.venueDetail}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Segmented Navigation Tabs */}
          <div className="px-4 mt-3">
            <div className="flex bg-[#dbece5] p-1 rounded-xl gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('about')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold text-center transition-all ${
                  activeTab === 'about'
                    ? 'bg-white text-[#003222] shadow-sm'
                    : 'text-[#404944] hover:text-[#003222]'
                }`}
              >
                About Event
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('lineup')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold text-center transition-all ${
                  activeTab === 'lineup'
                    ? 'bg-white text-[#003222] shadow-sm'
                    : 'text-[#404944] hover:text-[#003222]'
                }`}
              >
                Lineup ({event.schedule.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('pass')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'pass'
                    ? 'bg-white text-[#003222] shadow-sm'
                    : 'text-[#404944] hover:text-[#003222]'
                }`}
              >
                <span>My Pass</span>
                {pass && <span className="w-2 h-2 rounded-full bg-[#fea619]" />}
              </button>
            </div>
          </div>

          {/* TAB PANES */}
          <div className="px-4 mt-3">
            {/* 1. ABOUT TAB */}
            {activeTab === 'about' && (
              <div className="flex flex-col gap-3">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#0d4a36]/10 flex flex-col gap-2.5">
                  <h3 className="text-sm font-bold text-[#003222] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#fea619]" />
                    Grand Campus Overview
                  </h3>
                  <p className="text-xs text-[#404944] leading-relaxed">
                    {event.description}
                  </p>

                  {/* Key Attraction Pills */}
                  {event.keyAttractions && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {event.keyAttractions.map((attr, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-[#e0f2eb] text-[#003222] text-[11px] font-semibold flex items-center gap-1"
                        >
                          ✨ {attr}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Reminder Setting Helper Card */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#0d4a36]/10 flex items-center justify-between gap-3">
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-[#003222]">
                      Event Reminder
                    </span>
                    <span className="text-[11px] text-[#404944]">
                      Push notification alert 15 mins before gate opens
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onSetReminder(event, '15m');
                      setReminderScheduled(true);
                      setTimeout(() => setReminderScheduled(false), 2500);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      reminderScheduled
                        ? 'bg-[#10b981] text-white'
                        : 'bg-[#003222] text-white hover:bg-[#0d4a36]'
                    }`}
                  >
                    {reminderScheduled ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Scheduled!</span>
                      </>
                    ) : (
                      <>
                        <Bell className="w-3.5 h-3.5" />
                        <span>Remind Me</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* 2. LINEUP / SCHEDULE TAB */}
            {activeTab === 'lineup' && (
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#0d4a36]/10 flex flex-col gap-4">
                <div>
                  <span className="text-[10px] font-bold text-[#855300] uppercase tracking-wider">
                    Official Event Timeline
                  </span>
                  <h3 className="text-sm font-bold text-[#003222] mt-0.5">
                    Stage Timelines & Agendas
                  </h3>
                </div>

                <div className="relative pl-5 flex flex-col gap-5 border-l-2 border-[#e0f2eb]">
                  {event.schedule.map((item, index) => (
                    <div key={index} className="relative flex flex-col gap-0.5">
                      <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-[#fea619] border-2 border-white shadow-sm" />
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#855300] font-mono">
                          {item.time}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#e0f2eb] text-[#003222]">
                          {item.location}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[#0f1e1a] mt-0.5">
                        {item.title}
                      </span>
                      <span className="text-[11px] text-[#404944] leading-relaxed">
                        {item.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. MY PASS TAB */}
            {activeTab === 'pass' && (
              <div className="flex flex-col gap-4">
                {pass ? (
                  <div className="bg-white rounded-2xl shadow-lg border border-[#0d4a36]/15 overflow-hidden">
                    {/* FastPass Green Crest Header */}
                    <div className="bg-[#003222] p-4 text-white flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-[#ffddb8] uppercase tracking-wider">
                          SVU Student Admission
                        </span>
                        <h4 className="text-sm font-extrabold text-white">
                          {event.title} FastPass
                        </h4>
                      </div>
                      <Ticket className="w-6 h-6 text-[#fea619]" />
                    </div>

                    {/* Pass Details */}
                    <div className="p-4 flex flex-col gap-3.5">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[11px] text-[#404944]">
                            Pass Holder
                          </span>
                          <span className="text-sm font-bold text-[#003222]">
                            {pass.studentName}
                          </span>
                          <span className="text-xs text-[#707974] font-mono">
                            {pass.rollNo}
                          </span>
                          <span className="text-[11px] text-[#404944]">
                            {pass.phone}
                          </span>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-[#e0f2eb] text-[#003222] font-black text-sm flex items-center justify-center ring-2 ring-[#003222]/20">
                          {pass.studentName.slice(0, 2).toUpperCase()}
                        </div>
                      </div>

                      {/* Status Badges */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-1 rounded-full bg-[#e0f2eb] text-[#003222] text-[10px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-[#10b981]" />
                          Confirmed Seat
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-[#ffddb8] text-[#653e00] text-[10px] font-bold">
                          {pass.gate}
                        </span>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-dashed border-[#c0c9c2]/60 my-1" />

                      {/* Gate Scanner QR Code */}
                      <div className="flex flex-col items-center justify-center py-1 gap-2">
                        <div className="p-3 bg-[#ecfdf6] rounded-xl shadow-inner border border-[#0d4a36]/20">
                          {/* Geometric SVG QR Code */}
                          <svg
                            className="w-32 h-32 text-[#003222]"
                            viewBox="0 0 100 100"
                            fill="currentColor"
                          >
                            <path d="M0,0 h30 v30 h-30 z M6,6 v18 h18 v-18 z M10,10 h10 v10 h-10 z" />
                            <path d="M70,0 h30 v30 h-30 z M76,6 v18 h18 v-18 z M80,10 h10 v10 h-10 z" />
                            <path d="M0,70 h30 v30 h-30 z M6,76 v18 h18 v-18 z M10,80 h10 v10 h-10 z" />
                            <rect x="40" y="5" width="8" height="8" />
                            <rect x="52" y="5" width="8" height="8" />
                            <rect x="40" y="18" width="16" height="8" />
                            <rect x="15" y="40" width="10" height="10" />
                            <rect x="35" y="35" width="30" height="30" />
                            <rect fill="#ecfdf6" x="45" y="45" width="10" height="10" />
                            <rect x="75" y="40" width="12" height="6" />
                            <rect x="80" y="52" width="15" height="10" />
                            <rect x="40" y="75" width="12" height="18" />
                            <rect x="58" y="72" width="15" height="8" />
                            <rect x="78" y="78" width="14" height="14" />
                          </svg>
                        </div>
                        <span className="text-[10px] font-mono tracking-widest text-[#707974] uppercase font-bold">
                          {pass.ticketCode}
                        </span>
                        <span className="text-[9px] text-[#404944] uppercase tracking-wider">
                          PRESENT AT ENTRY GATE FOR FAST SCAN
                        </span>
                      </div>
                    </div>

                    {/* Pass Action Buttons */}
                    <div className="p-3 bg-[#e6f8f1] flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={handleDownload}
                        className="w-full py-2.5 rounded-xl bg-[#003222] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-all"
                      >
                        {downloaded ? (
                          <>
                            <Check className="w-4 h-4 text-[#6ffbbe]" />
                            <span>Pass Saved to Downloads!</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4" />
                            <span>Download Pass / Save to Device</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#0d4a36]/10 flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#e0f2eb] flex items-center justify-center text-[#003222]">
                      <Ticket className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                      <h4 className="text-sm font-bold text-[#003222]">
                        No Pass Claimed Yet
                      </h4>
                      <p className="text-xs text-[#404944] mt-1 max-w-xs">
                        Attach your verified student roll ID to generate your official FastPass badge.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onClaimPass(event)}
                      className="mt-1 px-5 py-2.5 rounded-xl bg-[#003222] text-white text-xs font-bold shadow-md hover:bg-[#0d4a36] active:scale-95 transition-all"
                    >
                      Claim Student FastPass Now
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sticky Persistent Bottom Action Bar */}
        <div className="fixed sm:static bottom-0 inset-x-0 p-3.5 bg-[#003222]/95 backdrop-blur-xl z-40 flex items-center justify-between gap-3 shadow-xl sm:rounded-b-2xl border-t border-[#80b99f]/20">
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold text-[#ffddb8] uppercase tracking-wider">
              {pass ? 'Pass Confirmed' : 'Registration Active'}
            </span>
            <span className="text-xs font-bold text-white truncate">
              {pass ? `Roll: ${pass.rollNo}` : '1-Tap Student Admission'}
            </span>
          </div>

          {pass ? (
            <button
              type="button"
              onClick={() => setActiveTab('pass')}
              className="px-4 py-2.5 rounded-xl bg-[#fea619] text-[#684000] text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-md active:scale-95 transition-all"
            >
              <Ticket className="w-4 h-4" />
              <span>Show QR Pass</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onClaimPass(event)}
              className="px-4 py-2.5 rounded-xl bg-[#fea619] text-[#684000] text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-md active:scale-95 transition-all hover:brightness-105"
            >
              <Ticket className="w-4 h-4" />
              <span>Claim Seat / Pass</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
