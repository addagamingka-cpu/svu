import React, { useState } from 'react';
import {
  ShieldCheck,
  Megaphone,
  PartyPopper,
  Code,
  GraduationCap,
  Trophy,
  Theater,
  Image as ImageIcon,
  Calendar,
  Clock,
  MapPin,
  Users,
  Rocket,
  Bookmark,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { CampusEvent, StudentProfile } from '../types';
import { CAMPUS_VENUES, PRESET_BANNERS } from '../data/mockEvents';

interface PostEventViewProps {
  student: StudentProfile;
  onEventCreated: (event: Partial<CampusEvent>) => void;
  onNavigateHome: () => void;
}

export const PostEventView: React.FC<PostEventViewProps> = ({
  student,
  onEventCreated,
  onNavigateHome
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'fest' | 'hackathon' | 'freshers' | 'cultural' | 'sports' | 'workshop'>('fest');
  const [selectedBanner, setSelectedBanner] = useState(PRESET_BANNERS[0].url);
  const [customBannerUrl, setCustomBannerUrl] = useState('');
  const [mode, setMode] = useState<'scheduled' | 'now'>('scheduled');
  const [eventDate, setEventDate] = useState('2026-10-18');
  const [startTime, setStartTime] = useState('11:00');
  const [endTime, setEndTime] = useState('18:00');
  const [venue, setVenue] = useState(CAMPUS_VENUES[0].name);
  const [requireIdCheck, setRequireIdCheck] = useState(true);
  const [isFree, setIsFree] = useState(true);
  const [capacity, setCapacity] = useState(500);
  const [description, setDescription] = useState('');
  const [prizes, setPrizes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: '', sub: '' });

  const categories = [
    { id: 'fest', label: 'College Fest', emoji: '🎉', icon: PartyPopper },
    { id: 'freshers', label: 'Freshers Party', emoji: '🌟', icon: GraduationCap },
    { id: 'hackathon', label: 'Hackathon / Coding', emoji: '⚡', icon: Code },
    { id: 'workshop', label: 'Workshop / Seminar', emoji: '🤖', icon: GraduationCap },
    { id: 'sports', label: 'Sports', emoji: '⚽', icon: Trophy },
    { id: 'cultural', label: 'Cultural & Drama', emoji: '🎭', icon: Theater }
  ];

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);

    const bannerToUse = customBannerUrl.trim() || selectedBanner;
    const catObj = categories.find((c) => c.id === category);

    const newEventData: Partial<CampusEvent> = {
      title: title.trim(),
      subtitle: mode === 'now' ? 'Happening Live on Campus' : `Organized by ${student.department}`,
      description: description.trim() || `Official ${catObj?.label} organized by Swami Vivekananda University students and student councils. Open to all registered students.`,
      category,
      categoryLabel: catObj?.label || 'College Fest',
      categoryEmoji: catObj?.emoji || '🎉',
      status: mode === 'now' ? 'live' : 'upcoming',
      statusBadge: mode === 'now' ? 'Live Now' : `${eventDate}`,
      date: mode === 'now' ? new Date().toISOString().split('T')[0] : eventDate,
      dateDisplay: mode === 'now' ? 'Happening Now (Live)' : `${eventDate} • ${startTime}`,
      startTime,
      endTime,
      venue,
      venueDetail: 'Barrackpore Campus, SVU Knowledge City',
      organizer: student.name + ' & Student Committee',
      organizerRegNo: student.rollNo,
      organizerRole: 'Verified Organizer',
      bannerUrl: bannerToUse,
      capacity,
      attendeeCount: 1,
      prizes: prizes.trim() || undefined,
      perks: [
        requireIdCheck ? 'Student ID Required' : 'Open Entry',
        isFree ? 'Free for SVU Students' : 'Ticketed Entry',
        'Official Certificates & Badges'
      ],
      isStudentIdRequired: requireIdCheck,
      isFree,
      tags: [catObj?.label || 'Event', 'SVU 2026', 'Campus Life'],
      schedule: [
        { time: startTime, title: 'Inauguration & Welcome', location: venue, description: 'Student arrival, roll badge scanning and seating' },
        { time: endTime, title: 'Closing & Distribution', location: venue, description: 'Conferences, performances and recognitions' }
      ],
      keyAttractions: ['Campus Gathering', 'Live Stage', 'Student Pass Entry', 'Verified Badges']
    };

    setTimeout(() => {
      onEventCreated(newEventData);
      setIsSubmitting(false);
      setToastMessage({
        title: 'Event Broadcasted! 🚀',
        sub: `"${title}" is now live on Campus Pulse feeds`
      });
      setShowToast(true);

      setTimeout(() => {
        onNavigateHome();
      }, 1500);
    }, 600);
  };

  const handleDraft = () => {
    setToastMessage({
      title: 'Saved as Draft 📁',
      sub: 'You can resume publishing any time from your student profile'
    });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 pb-28 flex flex-col gap-4">
      {/* Organizer Verification Card */}
      <div className="bg-[#e6f8f1] rounded-2xl p-4 shadow-sm border border-[#0d4a36]/15 flex items-start gap-3.5 relative overflow-hidden">
        <div className="w-10 h-10 rounded-full bg-[#003222] flex items-center justify-center shrink-0 text-white shadow-sm">
          <ShieldCheck className="w-5 h-5 text-[#6ffbbe]" />
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-[#fea619] text-[#684000] font-black">
              Verified Organizer
            </span>
            <span className="text-[10px] text-[#003222] font-bold">
              {student.department.split('&')[0]}
            </span>
          </div>
          <p className="text-sm font-black text-[#0f1e1a] truncate mt-0.5">
            {student.name.toUpperCase()}
          </p>
          <p className="text-[11px] text-[#404944] font-mono truncate">
            REG NO — {student.rollNo}
          </p>
        </div>
        <div className="w-2.5 h-2.5 rounded-full bg-[#fea619] shrink-0 mt-1 animate-pulse" />
      </div>

      {/* Intro Headline */}
      <div className="flex flex-col">
        <h1 className="text-2xl font-black text-[#003222] tracking-tight">
          Create & Broadcast Event
        </h1>
        <p className="text-xs text-[#404944] mt-0.5">
          Publish directly to active SVU student portal feeds and get instant registrations.
        </p>
      </div>

      {/* Main Form */}
      <form onSubmit={handlePublish} className="flex flex-col gap-4">
        {/* SECTION 1: Event Identity */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-[#0d4a36]/10 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#003222]" />
              <span className="text-xs font-bold text-[#003222] uppercase tracking-wider">
                1. Event Identity
              </span>
            </div>
            <span className="text-[11px] text-[#404944]">Step 1 of 5</span>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#0f1e1a]">Event Title *</label>
            <div className="bg-[#e6f8f1] rounded-xl px-3 py-2.5 flex items-center gap-2 border border-[#c0c9c2]/40 focus-within:border-[#003222] focus-within:bg-white transition-colors">
              <Megaphone className="w-4 h-4 text-[#707974] shrink-0" />
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Inter-Department Cricket Tournament 2026"
                className="w-full bg-transparent text-xs text-[#0f1e1a] placeholder:text-[#707974] outline-none font-medium"
              />
            </div>
          </div>

          {/* Event Category Pills */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#0f1e1a]">Event Category</label>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id as any)}
                    className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-[#003222] text-white shadow-sm'
                        : 'bg-[#e0f2eb] text-[#0f1e1a] hover:bg-[#d5e6e0]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#0f1e1a]">Event Description & Highlights</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Highlight schedules, performances, eligibility, and what makes this event unmissable..."
              className="w-full bg-[#e6f8f1] border border-[#c0c9c2]/40 text-[#0f1e1a] text-xs p-3 rounded-xl outline-none focus:bg-white focus:border-[#003222] transition-colors resize-none"
            />
          </div>
        </section>

        {/* SECTION 2: Visual Banner */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-[#0d4a36]/10 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#fea619]" />
              <span className="text-xs font-bold text-[#003222] uppercase tracking-wider">
                2. Visual Banner
              </span>
            </div>
            <span className="text-[10px] text-[#404944] font-semibold">16:9 Landscape</span>
          </div>

          <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-[#003222] shadow-sm">
            <img
              src={customBannerUrl.trim() || selectedBanner}
              alt="Event banner preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#003222]/80 via-transparent to-transparent flex flex-col justify-end p-3">
              <span className="text-[10px] text-[#ffddb8] uppercase font-bold tracking-wider">
                Preview Snapshot
              </span>
              <span className="text-xs font-bold text-white truncate">
                {title || 'Your Event Title Will Appear Here'}
              </span>
            </div>
          </div>

          {/* Preset Landmark Picker */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-[#0f1e1a]">
              Select Campus Landmark Visual:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_BANNERS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedBanner(preset.url);
                    setCustomBannerUrl('');
                  }}
                  className={`relative p-1.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                    selectedBanner === preset.url && !customBannerUrl
                      ? 'border-[#003222] bg-[#e0f2eb]'
                      : 'border-[#c0c9c2]/40 bg-white hover:bg-[#e6f8f1]'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.name}
                    className="w-9 h-9 rounded-lg object-cover shrink-0"
                  />
                  <span className="text-[11px] font-semibold text-[#0f1e1a] truncate">
                    {preset.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Or custom URL */}
          <div className="flex items-center gap-2">
            <input
              type="url"
              value={customBannerUrl}
              onChange={(e) => setCustomBannerUrl(e.target.value)}
              placeholder="Or paste custom image URL..."
              className="flex-1 bg-[#e6f8f1] border border-[#c0c9c2]/40 text-xs px-3 py-2 rounded-xl outline-none focus:bg-white"
            />
            <span className="text-xs text-[#707974] flex items-center gap-1 shrink-0">
              <ImageIcon className="w-3.5 h-3.5" />
            </span>
          </div>
        </section>

        {/* SECTION 3: Schedule & Mode */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-[#0d4a36]/10 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#003222]" />
              <span className="text-xs font-bold text-[#003222] uppercase tracking-wider">
                3. Schedule & Mode
              </span>
            </div>
            <span className="text-[11px] text-[#404944]">Timeline</span>
          </div>

          {/* Segmented Mode Control */}
          <div className="grid grid-cols-2 p-1 bg-[#e0f2eb] rounded-xl gap-1">
            <button
              type="button"
              onClick={() => setMode('scheduled')}
              className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                mode === 'scheduled'
                  ? 'bg-white text-[#003222] shadow-sm'
                  : 'text-[#404944]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule for Future</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('now')}
              className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                mode === 'now'
                  ? 'bg-white text-[#ba1a1a] shadow-sm'
                  : 'text-[#404944]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-ping" />
              <span>Happening Now (Live)</span>
            </button>
          </div>

          {mode === 'now' ? (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>
                <strong>Flash Live Broadcast:</strong> This event will instantly display prominently in campus feed hero cards with real-time live attendance counters.
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#0f1e1a]">Date of Event</label>
                <div className="bg-[#e6f8f1] rounded-xl px-3 py-2.5 flex items-center gap-2 border border-[#c0c9c2]/40">
                  <Calendar className="w-4 h-4 text-[#707974]" />
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-transparent text-xs text-[#0f1e1a] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[#0f1e1a]">Start Time</label>
                  <div className="bg-[#e6f8f1] rounded-xl px-3 py-2 flex items-center gap-1.5 border border-[#c0c9c2]/40">
                    <Clock className="w-3.5 h-3.5 text-[#707974]" />
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full bg-transparent text-xs text-[#0f1e1a] outline-none"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[#0f1e1a]">End Time</label>
                  <div className="bg-[#e6f8f1] rounded-xl px-3 py-2 flex items-center gap-1.5 border border-[#c0c9c2]/40">
                    <Clock className="w-3.5 h-3.5 text-[#707974]" />
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full bg-transparent text-xs text-[#0f1e1a] outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* SECTION 4: Campus Venue */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-[#0d4a36]/10 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#003222]" />
              <span className="text-xs font-bold text-[#003222] uppercase tracking-wider">
                4. Campus Venue
              </span>
            </div>
            <span className="text-[11px] text-[#404944]">Barrackpore</span>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[#0f1e1a]">Select Campus Location *</label>
            <div className="bg-[#e6f8f1] rounded-xl px-3 py-2.5 flex items-center gap-2 border border-[#c0c9c2]/40">
              <MapPin className="w-4 h-4 text-[#855300] shrink-0" />
              <select
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full bg-transparent text-xs text-[#0f1e1a] outline-none cursor-pointer"
              >
                {CAMPUS_VENUES.map((v) => (
                  <option key={v.id} value={v.name}>
                    {v.name} ({v.area})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2.5 bg-[#e0f2eb] rounded-xl">
            <MapPin className="w-4 h-4 text-[#003222] shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-bold text-[#003222]">
                Map Direction Pinning
              </span>
              <span className="text-[10px] text-[#404944] truncate">
                Attached with SVU Interactive Campus Wayfinder
              </span>
            </div>
          </div>
        </section>

        {/* SECTION 5: Entry & Access Rules */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-[#0d4a36]/10 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#003222]" />
              <span className="text-xs font-bold text-[#003222] uppercase tracking-wider">
                5. Entry & Access Rules
              </span>
            </div>
            <span className="text-[11px] text-[#404944]">Security</span>
          </div>

          {/* Toggle: Require Student ID */}
          <div className="flex items-center justify-between gap-2 py-1">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#0f1e1a]">
                Require Student ID Check-in
              </span>
              <span className="text-[11px] text-[#404944]">
                Scan University RFID / digital QR badge at the gate
              </span>
            </div>
            <button
              type="button"
              onClick={() => setRequireIdCheck(!requireIdCheck)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                requireIdCheck ? 'bg-[#003222]' : 'bg-[#c0c9c2]'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  requireIdCheck ? 'left-5.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Toggle: Free for SVU Students */}
          <div className="flex items-center justify-between gap-2 py-1">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#0f1e1a]">
                Free for SVU Students
              </span>
              <span className="text-[11px] text-[#404944]">
                Zero fee for all current undergraduate & postgraduate batches
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsFree(!isFree)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                isFree ? 'bg-[#003222]' : 'bg-[#c0c9c2]'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  isFree ? 'left-5.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Capacity Slider */}
          <div className="flex flex-col gap-1 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#0f1e1a]">
                Capacity & Seat Limit
              </label>
              <span className="text-xs font-extrabold text-[#855300]">
                {capacity} Seats
              </span>
            </div>
            <input
              type="range"
              min={50}
              max={2500}
              step={50}
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="w-full accent-[#003222] cursor-pointer h-2 bg-[#e0f2eb] rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-[#707974]">
              <span>50 (Classroom)</span>
              <span>500 (Auditorium)</span>
              <span>2500+ (Amphitheatre)</span>
            </div>
          </div>

          {/* Prize Pool Optional */}
          <div className="flex flex-col gap-1 pt-1">
            <label className="text-xs font-bold text-[#0f1e1a]">Prizes / Perks (Optional)</label>
            <input
              type="text"
              value={prizes}
              onChange={(e) => setPrizes(e.target.value)}
              placeholder="e.g. ₹50,000 Cash Prize or Trophies"
              className="w-full bg-[#e6f8f1] border border-[#c0c9c2]/40 text-xs px-3 py-2 rounded-xl outline-none"
            />
          </div>
        </section>

        {/* Broadcast Advisory Banner */}
        <div className="bg-[#dbece5] rounded-2xl p-3.5 flex items-start gap-2.5">
          <Rocket className="w-5 h-5 text-[#855300] shrink-0 mt-0.5" />
          <p className="text-[11px] text-[#404944] leading-relaxed">
            <strong className="text-[#0f1e1a] font-bold">Campus Reach Advisory:</strong> Once published, instant real-time events and push notification alerts will dispatch immediately to all enrolled student portals across campus.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl bg-[#003222] hover:bg-[#0d4a36] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <span>Publishing Event...</span>
            ) : (
              <>
                <Rocket className="w-4 h-4 text-[#6ffbbe]" />
                <span>Publish Event to Campus Feed</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDraft}
            className="w-full py-3 px-4 rounded-xl bg-[#e0f2eb] hover:bg-[#d5e6e0] text-[#003222] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Save as Draft</span>
          </button>
        </div>
      </form>

      {/* Confirmation Toast */}
      {showToast && (
        <div className="fixed bottom-20 inset-x-4 max-w-sm mx-auto z-50 animate-in slide-in-from-bottom duration-300">
          <div className="bg-[#003222] text-white rounded-2xl p-3.5 shadow-2xl flex items-center gap-3 border border-[#80b99f]/30">
            <div className="w-8 h-8 rounded-full bg-[#fea619] text-[#684000] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold text-white">
                {toastMessage.title}
              </span>
              <span className="text-[11px] text-[#80b99f] truncate">
                {toastMessage.sub}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
