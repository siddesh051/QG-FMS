import React from 'react';
import { QuadGenLogo } from './QuadGenLogo';
import { 
  Radio, 
  User, 
  Clock, 
  LogOut 
} from 'lucide-react';
import { UserAccount } from './pages/security/UserManagementPage';

interface HeaderProps {
  activeWan: string;
  uptime: string;
  currentUser: UserAccount | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeWan,
  uptime,
  currentUser,
  onLogout,
}) => {
  return (
    <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between select-none z-20 shrink-0">
      {/* Left: QuadGen Logo & EMS Portal branding */}
      <div className="flex items-center gap-3 sm:gap-4">
        <QuadGenLogo variant="header-compact" height={32} />
        
        <div className="h-5 w-px bg-slate-200 hidden sm:block" />

        <div className="flex items-center gap-2">
          <span className="text-sm font-bold tracking-tight text-slate-900">
            FluxGateway
          </span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-sky-50 text-[#0284c7] border border-sky-200">
            TR-2005
          </span>
        </div>
      </div>

      {/* Right: Operational Status Indicators & Admin Session */}
      <div className="flex items-center gap-3 sm:gap-4 text-xs text-slate-600">
        {/* Active WAN Uplink */}
        <div className="hidden md:flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
          <Radio className="w-3.5 h-3.5 text-[#0284c7]" />
          <span className="text-slate-400 font-medium">Uplink:</span>
          <span className="font-semibold text-[#1e3a8a]">{activeWan}</span>
        </div>

        {/* Live Running Uptime */}
        <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
          <Clock className="w-3.5 h-3.5 text-[#0284c7]" />
          <span className="text-slate-400 font-medium hidden sm:inline">Uptime:</span>
          <span className="font-mono font-bold text-slate-800 tracking-tight">{uptime}</span>
        </div>

        <div className="h-5 w-px bg-slate-200" />

        {/* Role-Based User Badge & Logout */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 pl-1 bg-slate-50 py-1 px-2.5 rounded-md border border-slate-200">
            <div 
              className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-2xs ${
                currentUser?.role === 'Operator'
                  ? 'bg-emerald-600'
                  : currentUser?.role === 'Read-Only Auditor'
                  ? 'bg-amber-600'
                  : 'bg-[#1e3a8a]'
              }`}
            >
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-mono font-semibold text-slate-800 text-xs leading-none">
                {currentUser ? currentUser.username : 'admin'}
              </span>
              <span 
                className={`text-[10px] font-semibold leading-tight ${
                  currentUser?.role === 'Operator'
                    ? 'text-emerald-700'
                    : currentUser?.role === 'Read-Only Auditor'
                    ? 'text-amber-700'
                    : 'text-[#0284c7]'
                }`}
              >
                {currentUser?.role || 'Administrator'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            title="Sign out of Gateway"
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded border border-transparent hover:border-red-200 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
