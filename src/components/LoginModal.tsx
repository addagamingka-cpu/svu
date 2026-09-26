import React, { useState, useEffect } from 'react';
import {
  X,
  BadgeCheck,
  Smartphone,
  MessageSquare,
  Send,
  Lock,
  ArrowRight,
  Info,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { StudentProfile } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: StudentProfile;
  onLoginSuccess: (profile: StudentProfile) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onLoginSuccess
}) => {
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [rollNo, setRollNo] = useState(currentProfile.rollNo || 'SVU/2023/BTECH/CS/042');
  const [phone, setPhone] = useState(currentProfile.phone || '9876543210');
  const [studentName, setStudentName] = useState(currentProfile.name || 'Ayush Jana');
  const [channel, setChannel] = useState<'whatsapp' | 'sms'>('whatsapp');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [countdown, setCountdown] = useState(45);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('2026');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'OTP' && countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  if (!isOpen) return null;

  const handleSendCode = () => {
    if (!rollNo.trim()) {
      setError('Please enter your University Roll No. or Student ID');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit registered mobile number');
      return;
    }

    setError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const code = String(Math.floor(1000 + Math.random() * 9000));
      setGeneratedCode(code);
      setStep('OTP');
      setCountdown(45);
    }, 600);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const updated = [...otp];
    updated[index] = val;
    setOtp(updated);

    if (val && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = () => {
    const entered = otp.join('');
    if (entered.length < 4) {
      setError('Please enter the 4-digit verification code');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Determine department from roll number
      let dept = 'Computer Science & Engineering';
      if (rollNo.toUpperCase().includes('IT')) dept = 'Information Technology';
      else if (rollNo.toUpperCase().includes('ECE')) dept = 'Electronics & Communication';
      else if (rollNo.toUpperCase().includes('BCA')) dept = 'Computer Applications';
      else if (rollNo.toUpperCase().includes('ME')) dept = 'Mechanical Engineering';

      const updatedProfile: StudentProfile = {
        isLoggedIn: true,
        phone: phone.replace(/\D/g, ''),
        rollNo: rollNo.trim().toUpperCase(),
        name: studentName.trim() || 'Ayush Jana',
        department: dept,
        batch: '2023 - 2027 (Undergraduate)',
        avatarUrl: currentProfile.avatarUrl || '',
        isVerified: true
      };

      onLoginSuccess(updatedProfile);
      onClose();
    }, 700);
  };

  const setPresetProfile = (name: string, roll: string, ph: string) => {
    setStudentName(name);
    setRollNo(roll);
    setPhone(ph);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#ecfdf6] w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-[#0d4a36]/20 flex flex-col max-h-[92vh]">
        {/* Top Visual Campus Showcase Header */}
        <div className="relative w-full h-44 bg-[#0d4a36] overflow-hidden shrink-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPD1pxcoDKqzAVvP2xntQnEdhAa4kunz85yHWhz2DPUx79FJmrTfA5XwSNseMK81XO24cRUG01CnwtdckwJ2FBE6kmw70cVPJt3LTCQYpFnEE_3zgwS3OF3kiwd-zt42XQLYsfz3Gw9h6GrCa6ECD_jwokiO5_jWD62CXKhCiGEPTpUgoukuJESWeDAxzj1ZN4joAtgx764ea7seVLUhV4uzqCEyUFFFJeewS7F623dnUqeLyvU9JR7sxBY5NSvfftEQ"
            alt="Swami Vivekananda University Campus"
            className="w-full h-full object-cover opacity-50 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#ecfdf6] via-[#0d4a36]/60 to-transparent" />

          {/* Top Crest & Badges */}
          <div className="absolute inset-x-0 top-0 p-3.5 flex items-center justify-between z-10">
            <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full shadow-sm">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFLTI8ZLxHjxKng_HQ1qHLL9i8r3nalgRLlI-NM0GTjcg6qyb9MGMsHnMaJBFNDkvLmG1dXwFeluaJ3mLQz6vcudK82aMwS-ZIJjg3_xwAcT0uUa9VCsQKP7o5v33LdTuJq4EV5bKmhVfhFT4gq9ki93EV5nr2dlNqFFO85YcyWTkG6QktCEAagmVysiT4l8ywJyk4NFbLPcTmtx4szNu1Tp2K-ynl98MsrQIl7HUFqFwKun9fWXwnaZ_oEeeG9e0XPg"
                alt="SVU Seal"
                className="w-5 h-5 object-contain"
              />
              <span className="text-[11px] font-bold text-[#003222] tracking-wider uppercase">
                SVU Portal
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#fea619]/25 border border-[#fea619]/40 text-[#855300] text-[10px] font-bold">
                FEST SEASON '26
              </span>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/80 text-[#003222] flex items-center justify-center hover:bg-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Hero Title */}
          <div className="absolute bottom-2.5 inset-x-0 px-4">
            <div className="flex items-center gap-1 text-[#fea619] text-xs font-semibold mb-0.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Collegiate Access</span>
            </div>
            <h2 className="text-xl font-extrabold text-[#0f1e1a] leading-tight">
              Welcome to SVU Campus Pulse
            </h2>
            <p className="text-xs text-[#404944] truncate">
              Connect with university events, fests, hackathons & clubs
            </p>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-4">
          {/* Quick Preset Selector for immediate smooth demo */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold text-[#404944] uppercase tracking-wider">
              Quick Student Demo Profiles:
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setPresetProfile('Ayush Jana', 'SVU/2023/BTECH/CS/042', '9876543210')
                }
                className="flex-1 py-1.5 px-2 rounded-lg bg-[#e0f2eb] border border-[#0d4a36]/20 text-[11px] font-bold text-[#003222] hover:bg-[#d5e6e0] transition-colors text-center"
              >
                Ayush (CSE '23)
              </button>
              <button
                type="button"
                onClick={() =>
                  setPresetProfile('Ananya Sharma', 'SVU/2023/BTECH/IT/118', '9812345678')
                }
                className="flex-1 py-1.5 px-2 rounded-lg bg-[#e0f2eb] border border-[#0d4a36]/20 text-[11px] font-bold text-[#003222] hover:bg-[#d5e6e0] transition-colors text-center"
              >
                Ananya (IT '23)
              </button>
            </div>
          </div>

          {error && (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {step === 'PHONE' ? (
            <div className="flex flex-col gap-3.5">
              {/* Full Student Name */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#0f1e1a]">Student Full Name</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Ayush Jana"
                  className="w-full bg-[#e6f8f1] border border-[#c0c9c2]/50 text-[#0f1e1a] text-sm px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-[#003222] transition-colors"
                />
              </div>

              {/* Academic ID / Roll No */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#0f1e1a]">
                    University Roll No. / Student ID
                  </label>
                  <span className="text-[10px] font-bold text-[#16503c] bg-[#e0f2eb] px-2 py-0.5 rounded-full flex items-center gap-1">
                    <BadgeCheck className="w-3 h-3 text-[#004b32]" />
                    SVU Registry
                  </span>
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-[#707974] text-xs font-mono font-bold">
                    ID
                  </span>
                  <input
                    type="text"
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    placeholder="e.g. SVU/2023/BTECH/CS/042"
                    className="w-full bg-[#e6f8f1] border border-[#c0c9c2]/50 text-[#0f1e1a] text-sm pl-9 pr-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-[#003222] transition-colors uppercase font-mono"
                  />
                </div>
                <p className="text-[11px] text-[#404944] flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-[#004b32] shrink-0" />
                  Attaches your verified student badge to event RSVPs & FastPass
                </p>
              </div>

              {/* Phone Number Field */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#0f1e1a]">
                  Registered Mobile Number
                </label>
                <div className="flex gap-2">
                  <div className="bg-[#e6f8f1] border border-[#c0c9c2]/50 px-3 py-2.5 rounded-xl flex items-center gap-1.5 shrink-0 select-none">
                    <span className="text-sm">🇮🇳</span>
                    <span className="text-xs font-bold text-[#0f1e1a]">+91</span>
                  </div>
                  <div className="relative flex-1 flex items-center">
                    <input
                      type="tel"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="98765 43210"
                      className="w-full bg-[#e6f8f1] border border-[#c0c9c2]/50 text-[#0f1e1a] text-sm px-3.5 py-2.5 rounded-xl outline-none focus:bg-white focus:border-[#003222] transition-colors font-mono"
                    />
                    <Smartphone className="w-4 h-4 text-[#707974] absolute right-3 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Authentication Route */}
              <div className="bg-[#e6f8f1]/80 p-2.5 rounded-xl border border-[#c0c9c2]/40 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#404944]">
                    Authentication Route
                  </span>
                  <span className="text-[10px] text-[#855300] font-bold flex items-center gap-0.5">
                    ⚡ Instant Sync
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setChannel('whatsapp')}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                      channel === 'whatsapp'
                        ? 'bg-white text-[#003222] shadow-sm border border-[#0d4a36]/20'
                        : 'bg-transparent text-[#404944]'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4 text-[#29c48b]" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setChannel('sms')}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                      channel === 'sms'
                        ? 'bg-white text-[#003222] shadow-sm border border-[#0d4a36]/20'
                        : 'bg-transparent text-[#404944]'
                    }`}
                  >
                    <Send className="w-4 h-4 text-[#855300]" />
                    <span>SMS OTP</span>
                  </button>
                </div>
              </div>

              {/* Send Button */}
              <button
                type="button"
                onClick={handleSendCode}
                disabled={isLoading}
                className="w-full bg-[#003222] hover:bg-[#0d4a36] text-white py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-all cursor-pointer"
              >
                {isLoading ? (
                  <span>Sending Code...</span>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Step 2: OTP Verification */
            <div className="flex flex-col gap-4">
              <div className="p-3 rounded-xl bg-[#e0f2eb] border border-[#003222]/20 flex flex-col gap-1">
                <span className="text-xs font-semibold text-[#003222]">
                  Verification code sent to +91 {phone}
                </span>
                <span className="text-[11px] text-[#404944]">
                  Demo Code for Instant Testing: <strong className="text-[#855300] font-mono">{generatedCode}</strong>
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#0f1e1a]">
                    Enter 4-Digit Security Code
                  </span>
                  <button
                    type="button"
                    onClick={() => setCountdown(45)}
                    disabled={countdown > 0}
                    className="text-xs text-[#855300] font-bold hover:underline disabled:opacity-50"
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
                  </button>
                </div>

                <div className="flex justify-between gap-3">
                  {[0, 1, 2, 3].map((idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      maxLength={1}
                      value={otp[idx]}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      className="w-14 h-14 text-center text-xl font-extrabold bg-[#e6f8f1] border-2 border-[#003222]/30 focus:border-[#003222] focus:bg-white rounded-xl text-[#003222] outline-none transition-all font-mono"
                    />
                  ))}
                </div>

                {/* Auto-fill button for fast testing */}
                <button
                  type="button"
                  onClick={() => {
                    const digits = generatedCode.split('');
                    setOtp(digits);
                  }}
                  className="text-xs text-[#004b32] font-semibold self-start hover:underline"
                >
                  ⚡ Auto-fill Demo Code ({generatedCode})
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('PHONE')}
                  className="py-3 px-4 rounded-xl bg-[#e0f2eb] text-[#003222] text-xs font-bold hover:bg-[#d5e6e0]"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleVerify}
                  disabled={isLoading}
                  className="flex-1 bg-[#003222] hover:bg-[#0d4a36] text-white py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-all cursor-pointer"
                >
                  {isLoading ? (
                    <span>Verifying...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#6ffbbe]" />
                      <span>Verify & Enter Campus</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Trust Footer */}
          <div className="pt-2 flex items-center justify-center gap-1.5 text-center text-[#404944] text-[11px]">
            <Lock className="w-3.5 h-3.5 text-[#003222]" />
            <span>Protected with University SSO & Roll Registry, Barrackpore</span>
          </div>
        </div>
      </div>
    </div>
  );
};
