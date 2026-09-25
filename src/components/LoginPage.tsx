import React, { useState } from 'react';
import { QuadGenLogo } from './QuadGenLogo';
import { Lock, User, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { UserAccount } from './pages/security/UserManagementPage';

interface LoginPageProps {
  onLoginSuccess: (user: UserAccount) => void;
  users?: UserAccount[];
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, users = [] }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedUser = username.trim().toLowerCase();

    if (!trimmedUser) {
      setErrorMsg('Please enter your username.');
      return;
    }

    // Match by username or full name / description (case-insensitive)
    const matchedUser = users.find(
      (u) =>
        u.username.toLowerCase() === trimmedUser ||
        (u.fullName && u.fullName.trim().toLowerCase() === trimmedUser)
    );

    if (!matchedUser && trimmedUser !== 'admin') {
      setErrorMsg(`Authentication failed: Account "${username.trim()}" not found on gateway.`);
      return;
    }

    if (!password.trim()) {
      setErrorMsg('Please enter your password.');
      return;
    }

    const validPassword = matchedUser?.password || matchedUser?.passwordHash || (trimmedUser === 'admin' ? 'admin123' : '');

    if (password !== validPassword && (trimmedUser !== 'admin' || (password !== 'admin' && password !== 'admin123'))) {
      setErrorMsg(`Authentication failed: Incorrect password for "${username.trim()}".`);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const authenticatedUser: UserAccount = matchedUser || {
        id: 'usr-admin',
        username: 'admin',
        fullName: 'System Administrator',
        role: 'Administrator',
        lastLogin: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'active',
        authMethod: 'Password + Salt',
      };
      onLoginSuccess(authenticatedUser);
    }, 450);
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-b from-[#f0f6fb] via-[#e5eef7] to-[#d7e5f3] flex flex-col justify-between select-none text-slate-800 font-sans">
      {/* Background Graphic Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft Ambient Ground Curves at Bottom */}
        <svg
          className="absolute bottom-0 left-0 w-full h-40 text-[#c8d9ec]/40"
          viewBox="0 0 1440 180"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M0,80 C320,130 780,40 1440,90 L1440,180 L0,180 Z" />
        </svg>
        <svg
          className="absolute bottom-0 left-0 w-full h-28 text-[#b9ceea]/30"
          viewBox="0 0 1440 140"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M0,70 C480,20 960,110 1440,60 L1440,140 L0,140 Z" />
        </svg>

        {/* Floating Cloud Doodle near center top */}
        <div className="absolute top-20 left-[48%] opacity-40">
          <svg width="58" height="32" viewBox="0 0 60 34" fill="none" stroke="#93c5fd" strokeWidth="1.3">
            <path d="M10 26 C5 26 2 22 2 17 C2 12 5 8 10 8 C12 3 16 1 22 1 C28 1 32 4 34 9 C37 7 40 7 43 9 C48 9 52 13 52 18 C56 18 58 21 58 24 C58 28 55 31 51 31 L10 31 C6 31 3 28 3 25" />
          </svg>
        </div>

        {/* Cross-Screen Gateway to Globe Data Stream (Subtle & Elegant, Left to Right) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none hidden md:block"
          viewBox="0 0 1440 800"
          preserveAspectRatio="none"
          fill="none"
        >
          <defs>
            <filter id="packetGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="streamGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
              <stop offset="40%" stopColor="#38bdf8" stopOpacity="0.45" />
              <stop offset="75%" stopColor="#60a5fa" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.75" />
            </linearGradient>
            <linearGradient id="streamGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.75" />
              <stop offset="50%" stopColor="#818cf8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.7" />
            </linearGradient>
          </defs>

          {/* Path 1: Upper Flow from Antenna 1 to Globe Top Vertex */}
          <path
            id="streamPath1"
            d="M 235,270 C 430,160 850,170 1200,285"
            stroke="url(#streamGrad1)"
            strokeWidth="1.4"
            strokeDasharray="4 5"
            opacity="0.5"
          />
          {/* Moving Blue Packet along Path 1 */}
          <g>
            <circle r="4" fill="#0284c7" filter="url(#packetGlow)">
              <animateMotion
                dur="6.2s"
                repeatCount="indefinite"
                path="M 235,270 C 430,160 850,170 1200,285"
              />
            </circle>
            <circle r="2" fill="#e0f2fe">
              <animateMotion
                dur="6.2s"
                repeatCount="indefinite"
                path="M 235,270 C 430,160 850,170 1200,285"
              />
            </circle>
          </g>

          {/* Path 2: Mid-Upper Flow from Gateway 5G LED to Globe Equator */}
          <path
            id="streamPath2"
            d="M 245,310 C 480,230 870,240 1190,345"
            stroke="url(#streamGrad2)"
            strokeWidth="1.3"
            strokeDasharray="5 5"
            opacity="0.45"
          />
          {/* Moving Blue Packet along Path 2 */}
          <g>
            <circle r="3.5" fill="#38bdf8" filter="url(#packetGlow)">
              <animateMotion
                dur="5.4s"
                repeatCount="indefinite"
                begin="1.8s"
                path="M 245,310 C 480,230 870,240 1190,345"
              />
            </circle>
            <circle r="1.8" fill="#ffffff">
              <animateMotion
                dur="5.4s"
                repeatCount="indefinite"
                begin="1.8s"
                path="M 245,310 C 480,230 870,240 1190,345"
              />
            </circle>
          </g>

          {/* Path 3: Mid-Lower Flow from High-Speed Telemetry Port to Globe Core Node */}
          <path
            id="streamPath3"
            d="M 240,355 C 470,430 880,420 1210,385"
            stroke="url(#streamGrad1)"
            strokeWidth="1.3"
            strokeDasharray="4 4"
            opacity="0.45"
          />
          {/* Moving Blue Packet along Path 3 */}
          <g>
            <circle r="4" fill="#0284c7" filter="url(#packetGlow)">
              <animateMotion
                dur="6.8s"
                repeatCount="indefinite"
                begin="0.9s"
                path="M 240,355 C 470,430 880,420 1210,385"
              />
            </circle>
            <circle r="2" fill="#bae6fd">
              <animateMotion
                dur="6.8s"
                repeatCount="indefinite"
                begin="0.9s"
                path="M 240,355 C 470,430 880,420 1210,385"
              />
            </circle>
          </g>

          {/* Path 4: Lower Flow from GbE Bus to Globe Southern Vertex */}
          <path
            id="streamPath4"
            d="M 225,395 C 450,510 890,490 1180,435"
            stroke="url(#streamGrad2)"
            strokeWidth="1.2"
            strokeDasharray="5 5"
            opacity="0.38"
          />
          {/* Moving Blue Packet along Path 4 */}
          <g>
            <circle r="3.5" fill="#38bdf8" filter="url(#packetGlow)">
              <animateMotion
                dur="5.9s"
                repeatCount="indefinite"
                begin="3.4s"
                path="M 225,395 C 450,510 890,490 1180,435"
              />
            </circle>
            <circle r="1.6" fill="#ffffff">
              <animateMotion
                dur="5.9s"
                repeatCount="indefinite"
                begin="3.4s"
                path="M 225,395 C 450,510 890,490 1180,435"
              />
            </circle>
          </g>
        </svg>

        {/* ============================================================ */}
        {/* LEFT WING: FLUXGATEWAY ROUTER + BLUE EMITTING DATA POINTS    */}
        {/* ============================================================ */}
        <div className="absolute left-4 lg:left-10 top-16 bottom-8 w-[380px] xl:w-[420px] hidden md:flex flex-col justify-center z-0">
          <div className="relative w-full h-[360px] flex items-center justify-center select-none">
            {/* Concentric Radar Waves emanating from gateway */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 400 360"
              fill="none"
            >
              <circle cx="160" cy="180" r="140" stroke="#93c5fd" strokeWidth="1" strokeDasharray="3 3" opacity="0.35" />
              <circle cx="160" cy="180" r="105" stroke="#93c5fd" strokeWidth="1.2" opacity="0.5" />
              <circle cx="160" cy="180" r="70" stroke="#93c5fd" strokeWidth="1" strokeDasharray="2 2" opacity="0.45" />

              {/* Connecting fan lines launching rightward toward globe */}
              <path d="M225 155 C275 145, 320 90, 380 75" stroke="#60a5fa" strokeWidth="1.2" opacity="0.7" />
              <circle cx="380" cy="75" r="3" fill="#3b82f6" />

              <path d="M225 165 C275 160, 320 120, 380 115" stroke="#60a5fa" strokeWidth="1.2" opacity="0.7" />
              <circle cx="380" cy="115" r="3" fill="#3b82f6" />

              <path d="M225 175 C280 175, 325 160, 380 155" stroke="#60a5fa" strokeWidth="1.2" opacity="0.7" />
              <circle cx="380" cy="155" r="3" fill="#3b82f6" />

              <path d="M225 185 C280 185, 325 200, 380 205" stroke="#60a5fa" strokeWidth="1.2" opacity="0.7" />
              <circle cx="380" cy="205" r="3" fill="#3b82f6" />

              <path d="M225 195 C275 205, 320 240, 380 250" stroke="#60a5fa" strokeWidth="1.2" opacity="0.7" />
              <circle cx="380" cy="250" r="3" fill="#3b82f6" />

              <path d="M225 205 C270 220, 315 280, 380 295" stroke="#60a5fa" strokeWidth="1.2" opacity="0.7" />
              <circle cx="380" cy="295" r="3" fill="#3b82f6" />
            </svg>

            {/* Industrial Router Chassis with Blue Points */}
            <div className="absolute left-[85px] top-[115px] w-[148px] h-[116px] bg-white/95 backdrop-blur-xs rounded-2xl border-2 border-blue-200/90 shadow-[0_12px_28px_rgba(15,23,42,0.08)] p-3 flex flex-col justify-between z-10">
              {/* Dual Antennas */}
              <div className="absolute -top-6 left-5 w-1.5 h-6 bg-slate-400 rounded-t">
                {/* Blue Point on Left Antenna Tip */}
                <span className="absolute -top-1.5 -left-1 w-3.5 h-3.5 rounded-full bg-sky-400/30 animate-ping" />
                <span className="absolute -top-1 -left-0.5 w-2.5 h-2.5 rounded-full bg-sky-500 shadow-sm flex items-center justify-center">
                  <span className="w-1 h-1 rounded-full bg-white" />
                </span>
              </div>

              <div className="absolute -top-6 right-5 w-1.5 h-6 bg-slate-400 rounded-t">
                {/* Blue Point on Right Antenna Tip */}
                <span className="absolute -top-1.5 -left-1 w-3.5 h-3.5 rounded-full bg-blue-400/30 animate-ping" style={{ animationDelay: '1s' }} />
                <span className="absolute -top-1 -left-0.5 w-2.5 h-2.5 rounded-full bg-blue-600 shadow-sm flex items-center justify-center">
                  <span className="w-1 h-1 rounded-full bg-white" />
                </span>
              </div>

              {/* Wi-Fi / 5G RF Pulse Arcs on Antenna */}
              <div className="absolute -top-8 right-3 text-sky-500">
                <svg width="18" height="12" viewBox="0 0 18 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 10 A8 8 0 0 1 16 10" />
                  <path d="M5 10 A4 4 0 0 1 13 10" />
                </svg>
              </div>

              {/* Status LEDs with Active Blue Emitting Points */}
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-xs" title="Power OK" />
                <span className="w-2 h-2 rounded-full bg-amber-500 shadow-xs" title="SYS Activity" />
                {/* 5G Blue Active Point */}
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500" title="5G Cellular"></span>
                </span>
                {/* WAN Blue Active Point */}
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" style={{ animationDelay: '0.8s' }}></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" title="Cloud WAN"></span>
                </span>
              </div>

              {/* Clean Router Body (no wordings / device name) */}
              <div className="flex flex-col items-center justify-center gap-1 py-1.5 opacity-40">
                <span className="w-10 h-0.5 bg-slate-400 rounded-full" />
                <span className="w-10 h-0.5 bg-slate-400 rounded-full" />
              </div>

              {/* 4 LAN Ethernet Ports with metallic pin accents & Active Blue Link indicator */}
              <div className="flex justify-between gap-1 pt-1">
                {[1, 2, 3, 4].map((p) => (
                  <div
                    key={p}
                    className="flex-1 h-5 bg-slate-100 border border-slate-200 rounded flex flex-col items-center justify-center relative"
                  >
                    <span className="w-2 h-0.5 bg-slate-400 rounded-xs" />
                    {/* Blue link point on Port 1 & 4 */}
                    {(p === 1 || p === 4) && (
                      <span className="w-1 h-1 rounded-full bg-sky-500 mt-0.5" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Typography Under Gateway matching style */}
          <div className="pl-6 select-none mt-1">
            <div className="text-4xl xl:text-5xl font-black tracking-tight text-[#94a3b8]/60 uppercase">
              FluxGateway
            </div>
            <div className="text-xs xl:text-sm font-semibold tracking-wide text-[#64748b]/90 mt-1">
              One gateway. Endless possibilities.
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT WING: 3D HOLOGRAPHIC 5G GLOBE + RECEPTIVE CONSTELLATION*/}
        {/* ============================================================ */}
        <div className="absolute right-4 lg:right-10 top-16 bottom-8 w-[380px] xl:w-[420px] hidden md:flex flex-col justify-center items-end z-0">
          {/* 3D Wireframe Globe with Constellation Mesh */}
          <div className="relative w-[340px] h-[340px] xl:w-[380px] xl:h-[380px] select-none">
            <svg
              className="w-full h-full"
              viewBox="0 0 400 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <radialGradient id="globeGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.09" />
                  <stop offset="70%" stopColor="#3b82f6" stopOpacity="0.03" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </radialGradient>
                <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Faint ambient glow sphere */}
              <circle cx="200" cy="200" r="160" fill="url(#globeGlow)" />

              {/* Outer boundary rings */}
              <circle
                cx="200"
                cy="200"
                r="160"
                stroke="#94a3b8"
                strokeWidth="1.2"
                strokeDasharray="2 3"
                opacity="0.6"
              />
              <circle
                cx="200"
                cy="200"
                r="156"
                stroke="#93c5fd"
                strokeWidth="1.5"
                opacity="0.8"
              />

              {/* Latitude Rings (Ellipses with perspective tilt) */}
              <ellipse cx="200" cy="200" rx="156" ry="36" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" opacity="0.45" />
              <ellipse cx="200" cy="140" rx="142" ry="32" stroke="#93c5fd" strokeWidth="1" opacity="0.6" />
              <ellipse cx="200" cy="260" rx="142" ry="32" stroke="#93c5fd" strokeWidth="1" opacity="0.6" />
              <ellipse cx="200" cy="90" rx="105" ry="24" stroke="#93c5fd" strokeWidth="0.8" opacity="0.5" />
              <ellipse cx="200" cy="310" rx="105" ry="24" stroke="#93c5fd" strokeWidth="0.8" opacity="0.5" />

              {/* Longitude Ellipses (Vertical circular arcs) */}
              <ellipse cx="200" cy="200" rx="42" ry="156" stroke="#93c5fd" strokeWidth="1" opacity="0.65" />
              <ellipse cx="200" cy="200" rx="90" ry="156" stroke="#93c5fd" strokeWidth="1" opacity="0.55" />
              <ellipse cx="200" cy="200" rx="130" ry="156" stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4" />
              <line x1="200" y1="44" x2="200" y2="356" stroke="#93c5fd" strokeWidth="1.2" opacity="0.7" />
              <line x1="44" y1="200" x2="356" y2="200" stroke="#93c5fd" strokeWidth="1.2" opacity="0.7" />

              {/* Constellation Network Mesh (Data Vertices receiving streams from left) */}
              <g stroke="#60a5fa" strokeWidth="1.2" opacity="0.85">
                <line x1="120" y1="180" x2="160" y2="140" />
                <line x1="160" y1="140" x2="210" y2="115" />
                <line x1="210" y1="115" x2="280" y2="140" />
                <line x1="160" y1="140" x2="190" y2="210" />
                <line x1="120" y1="180" x2="115" y2="240" />
                <line x1="115" y1="240" x2="190" y2="210" />
                <line x1="190" y1="210" x2="250" y2="230" />
                <line x1="280" y1="140" x2="250" y2="230" />
                <line x1="280" y1="140" x2="310" y2="190" />
                <line x1="210" y1="115" x2="250" y2="160" />
                <line x1="250" y1="160" x2="280" y2="140" />
                <line x1="190" y1="210" x2="220" y2="280" />
              </g>

              {/* Receptive Incoming Pulse Waves on Left Edge of Globe */}
              <circle cx="120" cy="180" r="9" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.5">
                <animate attributeName="r" values="6;12;6" dur="4s" repeatCount="indefinite" />
                <animate attributeName="stroke-opacity" values="0.6;0.1;0.6" dur="4s" repeatCount="indefinite" />
              </circle>
              <circle cx="115" cy="240" r="8" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.5">
                <animate attributeName="r" values="5;11;5" dur="3.6s" begin="1.2s" repeatCount="indefinite" />
                <animate attributeName="stroke-opacity" values="0.6;0.1;0.6" dur="3.6s" begin="1.2s" repeatCount="indefinite" />
              </circle>
              <circle cx="160" cy="140" r="8" stroke="#60a5fa" strokeWidth="1" strokeOpacity="0.5">
                <animate attributeName="r" values="6;11;6" dur="4.2s" begin="2s" repeatCount="indefinite" />
                <animate attributeName="stroke-opacity" values="0.6;0.1;0.6" dur="4.2s" begin="2s" repeatCount="indefinite" />
              </circle>

              {/* Network Vertices / Data Nodes */}
              <circle cx="120" cy="180" r="4.5" fill="#0284c7" filter="url(#nodeGlow)" />
              <circle cx="160" cy="140" r="5" fill="#38bdf8" filter="url(#nodeGlow)" />
              <circle cx="160" cy="140" r="2" fill="#ffffff" />
              <circle cx="210" cy="115" r="3.5" fill="#60a5fa" />
              <circle cx="280" cy="140" r="5.5" fill="#1e40af" filter="url(#nodeGlow)" />
              <circle cx="190" cy="210" r="6" fill="#2563eb" filter="url(#nodeGlow)" />
              <circle cx="190" cy="210" r="2" fill="#ffffff" />
              <circle cx="115" cy="240" r="4" fill="#38bdf8" filter="url(#nodeGlow)" />
              <circle cx="250" cy="230" r="5" fill="#38bdf8" filter="url(#nodeGlow)" />
              <circle cx="310" cy="190" r="3.5" fill="#60a5fa" />
              <circle cx="250" cy="160" r="3" fill="#93c5fd" />
            </svg>
          </div>

          {/* 5G Typography Under Globe */}
          <div className="pr-6 text-right select-none mt-1">
            <div className="text-5xl font-black tracking-tight text-[#94a3b8]/60 uppercase">
              5G
            </div>
            <div className="text-xs xl:text-sm font-semibold tracking-wide text-[#64748b]/90 mt-1">
              Connecting to a smarter tomorrow
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* CENTER SIGN IN CARD                                          */}
      {/* ============================================================ */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-4 relative z-10">
        <div className="w-full max-w-[460px] bg-white rounded-[26px] shadow-[0_20px_50px_rgba(15,23,42,0.1)] border border-slate-100 p-8 sm:p-10 transition-all">
          {/* Card Brand Header */}
          <div className="flex flex-col items-center justify-center mb-6">
            <QuadGenLogo variant="full" height={36} className="justify-center" />

            <h1 className="text-xl sm:text-[22px] font-bold text-[#1a365d] text-center tracking-tight mt-4">
              FluxGateway EMS Portal
            </h1>
            <p className="text-xs text-slate-500 text-center mt-1 font-medium">
              Gateway Sign In
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-start gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="admin or operator"
                  className="w-full pl-10 pr-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1a365d]/20 focus:border-[#1a365d] text-xs transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1a365d]/20 focus:border-[#1a365d] text-xs transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 py-3.5 px-4 bg-[#1a365d] hover:bg-[#152e50] active:bg-[#0f1f38] text-white rounded-xl font-semibold text-xs shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <span>Sign In to EMS Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Bottom spacer */}
      <div className="h-4" />
    </div>
  );
};
