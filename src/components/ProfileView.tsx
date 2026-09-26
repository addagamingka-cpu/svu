import React, { useState, useRef } from 'react';
import {
  ShieldCheck,
  Smartphone,
  School,
  Calendar,
  Ticket,
  Bell,
  LogOut,
  Sparkles,
  ExternalLink,
  HelpCircle,
  CheckCircle2,
  Check,
  Camera,
  Upload,
  Trash2,
  User,
  Image as ImageIcon,
  Edit2
} from 'lucide-react';
import { StudentProfile, EventPass } from '../types';
import { requestPushPermission, getPushPermissionStatus } from '../services/notificationService';

interface ProfileViewProps {
  student: StudentProfile;
  passes: EventPass[];
  onUpdateProfile: (updated: StudentProfile) => void;
  onOpenLogin: () => void;
  onLogout: () => void;
  onExploreEvents: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  student,
  passes,
  onUpdateProfile,
  onOpenLogin,
  onLogout,
  onExploreEvents
}) => {
  const [pushStatus, setPushStatus] = useState<NotificationPermission>(getPushPermissionStatus());
  const [copiedRoll, setCopiedRoll] = useState(false);
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [photoSavedToast, setPhotoSavedToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Avatar presets suitable for college student IDs
  const avatarPresets = [
    { label: 'Blue Gradient', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80' },
    { label: 'Campus Scholar', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80' },
    { label: 'Tech Lead', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80' },
    { label: 'Cultural Artist', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80' }
  ];

  const handleCopyRoll = () => {
    navigator.clipboard?.writeText(student.rollNo);
    setCopiedRoll(true);
    setTimeout(() => setCopiedRoll(false), 2000);
  };

  const handleTogglePush = async () => {
    const res = await requestPushPermission();
    setPushStatus(res);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          applyNewAvatar(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const applyNewAvatar = (url: string) => {
    const updated: StudentProfile = {
      ...student,
      avatarUrl: url
    };
    onUpdateProfile(updated);
    setIsEditingPhoto(false);
    setPhotoUrlInput('');
    setPhotoSavedToast(true);
    setTimeout(() => setPhotoSavedToast(false), 2500);
  };

  const handleRemovePhoto = () => {
    const updated: StudentProfile = {
      ...student,
      avatarUrl: ''
    };
    onUpdateProfile(updated);
    setIsEditingPhoto(false);
    setPhotoUrlInput('');
    setPhotoSavedToast(true);
    setTimeout(() => setPhotoSavedToast(false), 2500);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 pb-28 flex flex-col gap-4">
      {/* View Title */}
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-[#855300] uppercase tracking-wider">
          Student Portal
        </span>
        <h1 className="text-2xl font-black text-[#003222] tracking-tight">
          Collegiate Identity
        </h1>
        <p className="text-xs text-[#404944] mt-0.5">
          Verified academic credentials for event admission & authorizations
        </p>
      </div>

      {/* Official SVU Student Digital Smart ID Card */}
      <div className="relative w-full rounded-2xl p-5 bg-gradient-to-br from-[#003222] via-[#0d4a36] to-[#002115] text-white shadow-xl overflow-hidden border border-[#80b99f]/30">
        {/* Decorative background watermark */}
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFLTI8ZLxHjxKng_HQ1qHLL9i8r3nalgRLlI-NM0GTjcg6qyb9MGMsHnMaJBFNDkvLmG1dXwFeluaJ3mLQz6vcudK82aMwS-ZIJjg3_xwAcT0uUa9VCsQKP7o5v33LdTuJq4EV5bKmhVfhFT4gq9ki93EV5nr2dlNqFFO85YcyWTkG6QktCEAagmVysiT4l8ywJyk4NFbLPcTmtx4szNu1Tp2K-ynl98MsrQIl7HUFqFwKun9fWXwnaZ_oEeeG9e0XPg"
            alt="SVU Crest"
            className="w-48 h-48"
          />
        </div>

        {/* Top Header with SVU Crest */}
        <div className="flex items-center justify-between relative z-10 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFLTI8ZLxHjxKng_HQ1qHLL9i8r3nalgRLlI-NM0GTjcg6qyb9MGMsHnMaJBFNDkvLmG1dXwFeluaJ3mLQz6vcudK82aMwS-ZIJjg3_xwAcT0uUa9VCsQKP7o5v33LdTuJq4EV5bKmhVfhFT4gq9ki93EV5nr2dlNqFFO85YcyWTkG6QktCEAagmVysiT4l8ywJyk4NFbLPcTmtx4szNu1Tp2K-ynl98MsrQIl7HUFqFwKun9fWXwnaZ_oEeeG9e0XPg"
              alt="SVU Seal"
              className="w-7 h-7 object-contain"
            />
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-[#ffddb8] uppercase tracking-widest leading-none">
                Swami Vivekananda University
              </span>
              <span className="text-[11px] font-extrabold text-white tracking-wider">
                CAMPUS PULSE DIGITAL PASS
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5 text-[#6ffbbe]" />
            <span className="text-[9px] font-bold text-[#6ffbbe] uppercase">
              Verified
            </span>
          </div>
        </div>

        {/* Middle Student Info & Profile Pic */}
        <div className="flex items-center gap-3.5 py-4 relative z-10">
          {/* Avatar with Change Photo Trigger */}
          <div className="relative shrink-0 group">
            {student.avatarUrl ? (
              <img
                src={student.avatarUrl}
                alt={student.name}
                className="w-16 h-16 rounded-xl object-cover ring-2 ring-[#fea619] shadow-md bg-[#002115]"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-[#004b32] text-[#6ffbbe] font-black text-xl flex items-center justify-center ring-2 ring-[#fea619] shadow-md">
                {student.name.slice(0, 2).toUpperCase() || 'SV'}
              </div>
            )}

            {/* Quick edit photo icon overlay button */}
            <button
              onClick={() => setIsEditingPhoto(true)}
              aria-label="Change Profile Photo"
              title="Change Profile Photo"
              className="absolute -bottom-1 -right-1 bg-[#fea619] hover:bg-[#ffb95f] text-[#684000] p-1 rounded-full shadow-md active:scale-95 transition-all"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-base font-black text-white leading-tight truncate">
                {student.name}
              </span>
              <button
                onClick={() => setIsEditingPhoto(true)}
                className="text-[10px] text-[#fea619] font-bold hover:underline flex items-center gap-0.5 shrink-0"
              >
                <Edit2 className="w-2.5 h-2.5" />
                <span>Change Photo</span>
              </button>
            </div>

            <div className="flex items-center gap-1 text-[#ffb95f] text-xs font-mono font-bold mt-0.5">
              <span>{student.rollNo}</span>
              <button
                onClick={handleCopyRoll}
                className="text-[10px] underline ml-1 hover:text-white"
              >
                {copiedRoll ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <span className="text-[11px] text-[#b5efd3] truncate mt-0.5">
              {student.department}
            </span>
            <span className="text-[10px] text-white/70">
              {student.batch}
            </span>
          </div>
        </div>

        {/* Card Footer */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-[#b5efd3] relative z-10">
          <div className="flex items-center gap-1 text-[11px]">
            <Smartphone className="w-3.5 h-3.5 text-[#fea619]" />
            <span>+91 {student.phone}</span>
          </div>
          <span className="text-[10px] font-mono tracking-wider text-[#ffddb8]">
            SVU-SSO-ACTIVE
          </span>
        </div>
      </div>

      {/* CHANGE PROFILE PICTURE DRAWER / MODAL */}
      {isEditingPhoto && (
        <div className="bg-white rounded-2xl p-4 border-2 border-[#003222] shadow-xl flex flex-col gap-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-[#0d4a36]/10 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#e0f2eb] flex items-center justify-center text-[#003222]">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#003222]">
                  Customize Profile Picture
                </h3>
                <span className="text-[10px] text-[#404944]">
                  Upload from device, choose an avatar, or remove
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsEditingPhoto(false)}
              className="text-xs font-bold text-[#707974] hover:text-[#003222]"
            >
              Cancel
            </button>
          </div>

          {/* Action 1: Upload from Device */}
          <div className="flex flex-col gap-2">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 px-3 rounded-xl bg-[#003222] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-[#0d4a36] active:scale-95 transition-all"
            >
              <Upload className="w-4 h-4 text-[#6ffbbe]" />
              <span>Upload Photo from Device</span>
            </button>
          </div>

          {/* Action 2: Choose from Recommended Avatars */}
          <div className="flex flex-col gap-1.5 pt-1">
            <span className="text-[11px] font-bold text-[#404944]">
              Or Pick a Student Avatar:
            </span>
            <div className="grid grid-cols-4 gap-2">
              {avatarPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyNewAvatar(preset.url)}
                  className="flex flex-col items-center gap-1 group"
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-transparent group-hover:ring-[#003222] transition-all"
                  />
                  <span className="text-[9px] text-[#404944] font-medium truncate w-full text-center">
                    {preset.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Action 3: Enter Image URL */}
          <div className="flex flex-col gap-1 pt-1">
            <span className="text-[11px] font-bold text-[#404944]">
              Or paste an Image Link:
            </span>
            <div className="flex gap-2">
              <input
                type="url"
                value={photoUrlInput}
                onChange={(e) => setPhotoUrlInput(e.target.value)}
                placeholder="https://example.com/my-photo.jpg"
                className="flex-1 bg-[#e6f8f1] border border-[#c0c9c2]/50 text-xs px-3 py-2 rounded-xl outline-none focus:bg-white focus:border-[#003222]"
              />
              <button
                type="button"
                onClick={() => {
                  if (photoUrlInput.trim()) {
                    applyNewAvatar(photoUrlInput.trim());
                  }
                }}
                disabled={!photoUrlInput.trim()}
                className="px-3 py-2 bg-[#003222] text-white text-xs font-bold rounded-xl disabled:opacity-40 hover:bg-[#0d4a36]"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Action 4: Remove Photo */}
          {student.avatarUrl && (
            <div className="pt-1 border-t border-[#0d4a36]/10">
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="w-full py-2 px-3 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-600" />
                <span>Remove Profile Photo (Use Initials)</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Toast */}
      {photoSavedToast && (
        <div className="bg-[#003222] text-white p-3 rounded-xl shadow-lg flex items-center gap-2 animate-in slide-in-from-top text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-[#6ffbbe]" />
          <span>Profile photo updated successfully!</span>
        </div>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white p-3 rounded-2xl border border-[#0d4a36]/10 text-center shadow-sm">
          <span className="text-lg font-black text-[#003222]">{passes.length}</span>
          <span className="text-[10px] text-[#404944] block font-semibold">Active Passes</span>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-[#0d4a36]/10 text-center shadow-sm">
          <span className="text-lg font-black text-[#855300]">6</span>
          <span className="text-[10px] text-[#404944] block font-semibold">Campus Events</span>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-[#0d4a36]/10 text-center shadow-sm">
          <span className="text-lg font-black text-[#004b32]">100%</span>
          <span className="text-[10px] text-[#404944] block font-semibold">ID Verified</span>
        </div>
      </div>

      {/* Push Notification Controls Card */}
      <div className="bg-white rounded-2xl p-4 border border-[#0d4a36]/10 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#003222]" />
            <h3 className="text-xs font-bold text-[#0f1e1a]">
              Push Notification Reminders
            </h3>
          </div>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              pushStatus === 'granted'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {pushStatus === 'granted' ? 'Enabled' : 'Disabled'}
          </span>
        </div>

        <p className="text-[11px] text-[#404944] leading-relaxed">
          Receive real-time push reminders when event gates open, stage headliners go live, and new college fests are announced.
        </p>

        <button
          onClick={handleTogglePush}
          className="w-full py-2.5 px-3 rounded-xl bg-[#003222] text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#0d4a36] transition-colors"
        >
          <Bell className="w-3.5 h-3.5" />
          <span>{pushStatus === 'granted' ? 'Push Notifications Active ✓' : 'Enable Browser Push Notifications'}</span>
        </button>
      </div>

      {/* Switch ID / Sign in with Another Student ID */}
      <div className="flex flex-col gap-2 pt-1">
        <button
          onClick={onOpenLogin}
          className="w-full py-3 px-4 rounded-xl bg-[#e0f2eb] hover:bg-[#d5e6e0] text-[#003222] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
        >
          <School className="w-4 h-4" />
          <span>Switch Student Account / Re-authenticate</span>
        </button>

        <button
          onClick={onLogout}
          className="w-full py-2.5 px-4 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out of Campus Portal</span>
        </button>
      </div>

      {/* Campus IT Desk Help Section */}
      <div className="bg-[#e6f8f1] rounded-2xl p-3.5 border border-[#0d4a36]/10 flex flex-col items-center text-center gap-1">
        <p className="text-[11px] text-[#404944]">Need help with student credentials?</p>
        <span className="text-xs font-bold text-[#003222] flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5" />
          Contact SVU Campus IT Desk & Roll Registry
        </span>
        <span className="text-[10px] text-[#707974]">
          Office of Registrar • Vivekananda Knowledge City, Barrackpore
        </span>
      </div>
    </div>
  );
};
