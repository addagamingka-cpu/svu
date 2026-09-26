import React, { useState } from 'react';
import {
  Ticket,
  Calendar,
  MapPin,
  QrCode,
  Download,
  Share2,
  CheckCircle2,
  Check
} from 'lucide-react';
import { EventPass, StudentProfile } from '../types';

interface PassesViewProps {
  passes: EventPass[];
  student: StudentProfile;
  onExploreEvents: () => void;
}

export const PassesView: React.FC<PassesViewProps> = ({
  passes,
  student,
  onExploreEvents
}) => {
  const [downloadedPassId, setDownloadedPassId] = useState<string | null>(null);
  const [copiedPassId, setCopiedPassId] = useState<string | null>(null);

  const handleDownload = (passId: string) => {
    setDownloadedPassId(passId);
    setTimeout(() => setDownloadedPassId(null), 2500);
  };

  const handleShare = (pass: EventPass) => {
    if (navigator.share) {
      navigator.share({
        title: `Pass: ${pass.eventTitle}`,
        text: `I got my SVU FastPass for ${pass.eventTitle}! Gate: ${pass.gate}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(`SVU Pass: ${pass.eventTitle} | Code: ${pass.ticketCode} | Roll: ${pass.rollNo}`);
      setCopiedPassId(pass.id);
      setTimeout(() => setCopiedPassId(null), 2000);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 pb-28 flex flex-col gap-4">
      {/* View Header */}
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-[#855300] uppercase tracking-wider">
          Student Digital Tickets
        </span>
        <h1 className="text-2xl font-black text-[#003222] tracking-tight">
          My Event FastPasses
        </h1>
        <p className="text-xs text-[#404944] mt-0.5">
          Official RFID & QR passes verified for {student.name} ({student.rollNo})
        </p>
      </div>

      {passes.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 border border-[#0d4a36]/10 shadow-sm flex flex-col items-center text-center gap-3 mt-4">
          <div className="w-14 h-14 rounded-2xl bg-[#e0f2eb] flex items-center justify-center text-[#003222]">
            <Ticket className="w-8 h-8" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-base font-bold text-[#003222]">
              No Passes Claimed Yet
            </h3>
            <p className="text-xs text-[#404944] mt-1 max-w-xs leading-relaxed">
              Explore ongoing and upcoming campus fests, hackathons, and symposiums to claim your free student fastpass ticket!
            </p>
          </div>
          <button
            onClick={onExploreEvents}
            className="mt-2 px-5 py-2.5 rounded-xl bg-[#003222] text-white text-xs font-bold shadow-md hover:bg-[#0d4a36] active:scale-95 transition-all"
          >
            Browse College Events
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {passes.map((pass) => (
            <div
              key={pass.id}
              className="bg-white rounded-2xl shadow-md border border-[#0d4a36]/15 overflow-hidden transition-all hover:shadow-lg"
            >
              {/* Crest Top Bar */}
              <div className="bg-[#003222] p-3.5 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFLTI8ZLxHjxKng_HQ1qHLL9i8r3nalgRLlI-NM0GTjcg6qyb9MGMsHnMaJBFNDkvLmG1dXwFeluaJ3mLQz6vcudK82aMwS-ZIJjg3_xwAcT0uUa9VCsQKP7o5v33LdTuJq4EV5bKmhVfhFT4gq9ki93EV5nr2dlNqFFO85YcyWTkG6QktCEAagmVysiT4l8ywJyk4NFbLPcTmtx4szNu1Tp2K-ynl98MsrQIl7HUFqFwKun9fWXwnaZ_oEeeG9e0XPg"
                    alt="SVU Crest"
                    className="w-5 h-5 object-contain"
                  />
                  <div>
                    <span className="text-[9px] font-bold text-[#ffddb8] uppercase tracking-wider block">
                      SVU Verified Admission
                    </span>
                    <h3 className="text-xs font-black text-white truncate max-w-[200px]">
                      {pass.eventTitle}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <span className="px-2 py-0.5 rounded-full bg-[#fea619] text-[#684000] text-[9px] font-bold uppercase">
                    FastPass
                  </span>
                </div>
              </div>

              {/* Ticket Body */}
              <div className="p-4 flex flex-col gap-3">
                {/* Event info */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[#003222] font-semibold truncate">
                    <Calendar className="w-3.5 h-3.5 text-[#fea619] shrink-0" />
                    <span>{pass.eventDate}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#404944] text-[11px] truncate">
                    <MapPin className="w-3 h-3 text-[#855300] shrink-0" />
                    <span className="truncate">{pass.venue.split('(')[0]}</span>
                  </div>
                </div>

                {/* Student Roll and Name */}
                <div className="p-2.5 rounded-xl bg-[#e6f8f1] border border-[#0d4a36]/10 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#404944] uppercase font-semibold">
                      Student Roll ID
                    </span>
                    <span className="text-xs font-mono font-bold text-[#003222]">
                      {pass.rollNo}
                    </span>
                    <span className="text-[11px] text-[#0f1e1a] font-semibold">
                      {pass.studentName}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-[#404944] uppercase font-semibold">
                      Assigned Entry
                    </span>
                    <span className="text-xs font-bold text-[#855300]">
                      {pass.gate}
                    </span>
                  </div>
                </div>

                {/* Perforated Divider */}
                <div className="relative py-1 flex items-center justify-center">
                  <div className="w-full border-t border-dashed border-[#c0c9c2]" />
                  <div className="absolute -left-6 w-4 h-4 rounded-full bg-[#ecfdf6]" />
                  <div className="absolute -right-6 w-4 h-4 rounded-full bg-[#ecfdf6]" />
                </div>

                {/* Gate Scanner QR Code */}
                <div className="flex flex-col items-center justify-center gap-1.5 py-1">
                  <div className="p-3 bg-white rounded-xl shadow-inner border border-[#0d4a36]/15 flex items-center justify-center">
                    <svg
                      className="w-28 h-28 text-[#003222]"
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
                  <span className="text-[11px] font-mono tracking-wider text-[#003222] font-black">
                    {pass.ticketCode}
                  </span>
                  <span className="text-[9px] text-[#707974] uppercase tracking-wider font-semibold">
                    SCAN AT UNIVERSITY ENTRY GATE
                  </span>
                </div>

                {/* Pass Actions */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleDownload(pass.id)}
                    className="py-2.5 px-3 rounded-xl bg-[#003222] text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#0d4a36] transition-colors"
                  >
                    {downloadedPassId === pass.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#6ffbbe]" />
                        <span>Saved!</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>Save Pass</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleShare(pass)}
                    className="py-2.5 px-3 rounded-xl bg-[#e0f2eb] text-[#003222] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#d5e6e0] transition-colors"
                  >
                    {copiedPassId === pass.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#10b981]" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share Ticket</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
