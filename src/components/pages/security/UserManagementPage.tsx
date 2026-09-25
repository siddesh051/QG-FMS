import React, { useState } from 'react';
import { 
  Users, 
  Key, 
  Shield, 
  Plus, 
  CheckCircle2, 
  Lock, 
  Unlock,
  Laptop, 
  Trash2, 
  Edit3, 
  X, 
  LogOut,
  Clock,
  Terminal,
  AlertCircle,
  RotateCcw,
  Check
} from 'lucide-react';
import { SubsystemKey, PermissionLevel, RolePermissions, DEFAULT_OPERATOR_PERMISSIONS } from '../../../types/router';

export interface UserAccount {
  id: string;
  username: string;
  fullName: string;
  role: 'Administrator' | 'Operator' | 'Read-Only Auditor';
  lastLogin: string;
  status: 'active' | 'suspended';
  authMethod: 'Password + Salt' | 'SSH Key + Password' | 'Hardware Token';
  password?: string;
  passwordHash?: string;
  sshKey?: string;
}

export interface ActiveSession {
  id: string;
  username: string;
  ipAddress: string;
  loginTime: string;
  idleDuration: string;
  protocol: 'HTTPS Web UI' | 'SSH Shell' | 'REST API';
  isCurrent: boolean;
}

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'usr-1',
    username: 'admin',
    fullName: 'System Administrator',
    role: 'Administrator',
    lastLogin: 'Active now (192.168.1.150)',
    status: 'active',
    authMethod: 'Password + Salt',
    password: 'admin123',
    passwordHash: 'admin123',
    sshKey: 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIExampleRootKeyFluxGateway',
  },
  {
    id: 'usr-2',
    username: 'operator',
    fullName: 'Field Operator',
    role: 'Operator',
    lastLogin: 'Never',
    status: 'active',
    authMethod: 'Password + Salt',
    password: 'admin123',
    passwordHash: 'admin123',
  },
];

export const INITIAL_SESSIONS: ActiveSession[] = [
  {
    id: 'sess-1',
    username: 'admin',
    ipAddress: '192.168.1.150',
    loginTime: '2026-09-18 08:30:12 UTC',
    idleDuration: '0s (active)',
    protocol: 'HTTPS Web UI',
    isCurrent: true,
  },
  {
    id: 'sess-2',
    username: 'operator',
    ipAddress: '192.168.1.188',
    loginTime: '2026-09-18 07:15:40 UTC',
    idleDuration: '4m 12s',
    protocol: 'SSH Shell',
    isCurrent: false,
  },
];

export interface SubsystemDefinition {
  key: SubsystemKey;
  name: string;
  description: string;
  adminDefault: string;
  auditorDefault: string;
}

export const SUBSYSTEM_DEFINITIONS: SubsystemDefinition[] = [
  {
    key: 'overview',
    name: 'Overview & Health Report',
    description: 'Live telemetry, channel matrix & printable health audit report',
    adminDefault: 'Read & Print',
    auditorDefault: 'Read-Only',
  },
  {
    key: 'wifi',
    name: 'Wi-Fi Connection',
    description: 'Station scan, join field SSID, passphrase configuration',
    adminDefault: 'Read / Write',
    auditorDefault: 'Read-Only',
  },
  {
    key: 'apn',
    name: 'Cellular APN Configuration',
    description: 'APN name, IP stack type, auto authentication handshake',
    adminDefault: 'Read / Write',
    auditorDefault: 'Read-Only',
  },
  {
    key: 'cellular',
    name: 'Cellular 5G Radio Mode',
    description: 'Select between 5G NR SA and LTE Cat 19 radio modes',
    adminDefault: 'Read / Write',
    auditorDefault: 'Read-Only',
  },
  {
    key: 'lan',
    name: 'LAN & DHCP Configuration',
    description: 'Subnet IP, netmask, DHCP lease pool range & DNS servers',
    adminDefault: 'Read / Write',
    auditorDefault: 'Read-Only',
  },
  {
    key: 'wanFailover',
    name: 'WAN Failover Routing',
    description: '5G, Ethernet, and Wi-Fi priority metrics and thresholds',
    adminDefault: 'Read / Write',
    auditorDefault: 'Read-Only',
  },
  {
    key: 'diagnostics',
    name: 'Diagnostics & Watchdogs',
    description: 'Ping tests, ICMP probes, traceroute, and AT modem queries',
    adminDefault: 'Execute / Write',
    auditorDefault: 'Read-Only Logs',
  },
  {
    key: 'protocols',
    name: 'Protocols (MQTT, Modbus, NTP)',
    description: 'Telemetry broker address, Modbus baud rate, NTP sync',
    adminDefault: 'Read / Write',
    auditorDefault: 'Read-Only',
  },
  {
    key: 'security',
    name: 'Security (Firewall & VPN)',
    description: 'iptables rules, NAT port forwards, IPsec/WireGuard tunnels',
    adminDefault: 'Read / Write',
    auditorDefault: 'Read-Only',
  },
  {
    key: 'firmware',
    name: 'Firmware Management',
    description: 'Upload binary images, flash storage, switch Bank A/B',
    adminDefault: 'Full Access',
    auditorDefault: 'Read-Only',
  },
  {
    key: 'factoryReset',
    name: 'Factory Reset & Wipe',
    description: 'Irreversible factory wipe or restore encrypted backups',
    adminDefault: 'Authorized',
    auditorDefault: 'Blocked',
  },
  {
    key: 'userMgmt',
    name: 'User Management & Permissions',
    description: 'Provision operators, change passwords, and delegate access rights',
    adminDefault: 'Full Control',
    auditorDefault: 'Hidden & Blocked',
  },
];

export interface UserManagementPageProps {
  users?: UserAccount[];
  onUpdateUsers?: (users: UserAccount[]) => void;
  currentUser?: UserAccount | null;
  operatorPermissions?: RolePermissions;
  onUpdateOperatorPermission?: (subsystem: SubsystemKey, level: PermissionLevel) => void;
  onSetAllOperatorPermissions?: (level: PermissionLevel) => void;
}

export const UserManagementPage: React.FC<UserManagementPageProps> = ({
  users: propUsers,
  onUpdateUsers,
  currentUser = null,
  operatorPermissions: propPermissions,
  onUpdateOperatorPermission,
  onSetAllOperatorPermissions,
}) => {
  const [localUsers, setLocalUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const users = propUsers || localUsers;

  const setUsers = (updated: UserAccount[]) => {
    if (onUpdateUsers) {
      onUpdateUsers(updated);
    } else {
      setLocalUsers(updated);
    }
  };

  const [localPermissions, setLocalPermissions] = useState<RolePermissions>(DEFAULT_OPERATOR_PERMISSIONS);
  const operatorPermissions = propPermissions || localPermissions;

  const isAdmin = !currentUser || currentUser.role === 'Administrator';

  const [sessions, setSessions] = useState<ActiveSession[]>(INITIAL_SESSIONS);
  const [notification, setNotification] = useState<string | null>(null);

  // New user form state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newRole, setNewRole] = useState<'Administrator' | 'Operator' | 'Read-Only Auditor'>('Operator');
  const [newPassword, setNewPassword] = useState('');
  const [newSshKey, setNewSshKey] = useState('');

  // Password reset modal
  const [resettingUser, setResettingUser] = useState<string | null>(null);
  const [newResetPassword, setNewResetPassword] = useState('');

  // Inline Quick Password Reset state
  const [quickTargetUser, setQuickTargetUser] = useState<string>('admin');
  const [quickNewPassword, setQuickNewPassword] = useState<string>('');
  const [quickConfirmPassword, setQuickConfirmPassword] = useState<string>('');
  const [quickResetError, setQuickResetError] = useState<string | null>(null);

  const handleQuickResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setQuickResetError(null);
    if (!quickNewPassword.trim()) {
      setQuickResetError('Please enter a new password.');
      return;
    }
    if (quickNewPassword.length < 6) {
      setQuickResetError('Password must be at least 6 characters long.');
      return;
    }
    if (quickNewPassword !== quickConfirmPassword) {
      setQuickResetError('Password confirmation does not match.');
      return;
    }
    const updated = users.map((u) => {
      if (u.username.toLowerCase() === quickTargetUser.toLowerCase()) {
        return {
          ...u,
          password: quickNewPassword,
        };
      }
      return u;
    });
    setUsers(updated);
    setQuickNewPassword('');
    setQuickConfirmPassword('');
    setNotification(`Password for account "${quickTargetUser}" has been updated successfully.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleTogglePermission = (subsystem: SubsystemKey) => {
    const current = operatorPermissions[subsystem];
    const next: PermissionLevel = current === 'read-write' ? 'read-only' : 'read-write';
    
    if (onUpdateOperatorPermission) {
      onUpdateOperatorPermission(subsystem, next);
    } else {
      setLocalPermissions((prev) => ({ ...prev, [subsystem]: next }));
    }

    const subDef = SUBSYSTEM_DEFINITIONS.find((s) => s.key === subsystem);
    const subName = subDef ? subDef.name : subsystem;

    setNotification(
      next === 'read-write'
        ? `Permission Granted: Field Operator now has Read / Write access to ${subName}.`
        : `Permission Restricted: Field Operator access to ${subName} changed to Read-Only.`
    );
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSetAll = (level: PermissionLevel) => {
    if (onSetAllOperatorPermissions) {
      onSetAllOperatorPermissions(level);
    } else {
      const all: RolePermissions = {
        overview: level,
        wifi: level,
        apn: level,
        cellular: level,
        lan: level,
        wanFailover: level,
        diagnostics: level,
        protocols: level,
        security: level,
        firmware: level,
        factoryReset: level,
        userMgmt: level,
      };
      setLocalPermissions(all);
    }

    setNotification(
      level === 'read-write'
        ? 'All subsystems granted Read / Write access for Field Operators.'
        : 'All subsystems restricted to strict Read-Only access for Field Operators.'
    );
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newPassword.trim()) return;

    if (users.some((u) => u.username.toLowerCase() === newUsername.trim().toLowerCase())) {
      setNotification(`Error: Username "${newUsername}" already exists.`);
      return;
    }

    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      username: newUsername.trim(),
      fullName: newFullName.trim() || newUsername.trim(),
      role: newRole,
      lastLogin: 'Never (Pending initial authentication)',
      status: 'active',
      authMethod: newSshKey.trim() ? 'SSH Key + Password' : 'Password + Salt',
      password: newPassword.trim(),
      passwordHash: newPassword.trim(),
      sshKey: newSshKey.trim() || undefined,
    };

    setUsers([...users, newUser]);
    setShowCreateModal(false);
    setNewUsername('');
    setNewFullName('');
    setNewPassword('');
    setNewSshKey('');

    setNotification(`User "${newUser.username}" provisioned successfully with role "${newUser.role}".`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleDeleteUser = (id: string, username: string) => {
    if (username === 'admin') {
      setNotification('Error: The primary "admin" account cannot be deleted.');
      setTimeout(() => setNotification(null), 4000);
      return;
    }

    const updated = users.filter((u) => u.id !== id);
    setUsers(updated);
    setNotification(`User account "${username}" has been removed.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenResetPassword = (username: string) => {
    setResettingUser(username);
    setNewResetPassword('');
  };

  const handleSaveResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resettingUser || !newResetPassword.trim()) return;

    const updated = users.map((u) => {
      if (u.username === resettingUser) {
        return {
          ...u,
          password: newResetPassword.trim(),
          passwordHash: newResetPassword.trim(),
        };
      }
      return u;
    });

    setUsers(updated);
    const target = resettingUser;
    setResettingUser(null);
    setNotification(`Password for "${target}" updated successfully.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleTerminateSession = (sessId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessId));
    setNotification('Session revoked and operator logged out.');
    setTimeout(() => setNotification(null), 4000);
  };

  if (!isAdmin) {
    return (
      <div className="bg-white rounded-xl border border-red-200 p-8 shadow-xs text-center max-w-xl mx-auto my-12">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
          <Shield className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-slate-900 mb-1">Access Denied: Administrator Only</h2>
        <p className="text-xs text-slate-600 mb-2">
          User & Password Management is restricted to Administrators only.
        </p>
        <p className="text-xs text-slate-500">
          Your account is assigned the <strong>{currentUser?.role || 'Restricted'}</strong> role.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Page Header */}
      <div className="bg-[#1a365d] rounded-xl px-5 py-4 text-white shadow-xs">
        <div className="flex items-center gap-1.5 text-xs text-sky-200/90 font-mono mb-1">
          <span className="text-sky-300 font-semibold">System & Maintenance</span>
          <span className="text-sky-400/50">/</span>
          <span className="text-white font-semibold">User & Password Management</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-sky-300" />
              User Accounts & Password Reset
            </h1>
            <p className="text-xs text-sky-100/85 mt-1">
              Reset gateway passwords, provision new administrators or field operators, and manage RBAC access controls.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto backdrop-blur-xs"
            >
              <Plus className="w-4 h-4 text-sky-200" />
              <span>Provision User</span>
            </button>
          )}
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 text-blue-800 border border-blue-200 rounded-md text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Quick Action: Reset Password */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 max-w-xl">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
            <Key className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-slate-900">Reset User Password</h2>
            <p className="text-[11px] text-slate-500">Update login credentials for existing local accounts</p>
          </div>
        </div>

        <form onSubmit={handleQuickResetPassword} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target User Account
            </label>
            <select
              value={quickTargetUser}
              onChange={(e) => setQuickTargetUser(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              {users.map((u) => (
                <option key={u.id} value={u.username}>
                  {u.username} ({u.fullName} — {u.role})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={quickNewPassword}
                onChange={(e) => setQuickNewPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={quickConfirmPassword}
                onChange={(e) => setQuickConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {quickResetError && (
            <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{quickResetError}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#1a365d] hover:bg-[#152c4d] text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <Key className="w-3.5 h-3.5" />
            <span>Update Password for {quickTargetUser}</span>
          </button>
        </form>
      </div>

      {/* User Accounts Roster Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-bold text-sm text-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span>Provisioned Local Accounts ({users.length})</span>
          </div>
          <span className="text-xs text-slate-500 font-normal">
            Local Credential Store: <strong className="font-mono text-slate-800">/etc/shadow (Argon2id)</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <th className="py-2.5 px-4">Username</th>
                <th className="py-2.5 px-4">Full Name / Description</th>
                <th className="py-2.5 px-4">Role Privileges</th>
                <th className="py-2.5 px-4">Authentication</th>
                <th className="py-2.5 px-4">Last Login</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[11px]">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-mono font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    {u.username}
                  </td>
                  <td className="py-2.5 px-4 text-slate-700 font-medium">
                    {u.fullName}
                  </td>
                  <td className="py-2.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === 'Administrator'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : u.role === 'Operator'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-slate-600 font-mono text-[10px]">
                    {u.authMethod}
                  </td>
                  <td className="py-2.5 px-4 text-slate-500 font-mono text-[10px]">
                    {u.lastLogin}
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {isAdmin && (
                        <button
                          onClick={() => handleOpenResetPassword(u.username)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1"
                          title="Change password"
                        >
                          <Key className="w-3 h-3 text-slate-500" />
                          <span>Password</span>
                        </button>
                      )}

                      {isAdmin && u.username !== 'admin' && (
                        <button
                          onClick={() => handleDeleteUser(u.id, u.username)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                          title="Delete user"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role-Based Access Control (RBAC) Permission Matrix with Dynamic Admin Controls */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-600" />
              <h2 className="font-bold text-sm text-slate-900">
                Role-Based Access Control (RBAC) Permission Matrix
              </h2>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Administrators can toggle any subsystem between Read-Only and Read/Write for Field Operators.
            </p>
          </div>

          {isAdmin && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleSetAll('read-write')}
                className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
                title="Grant Field Operator full Read / Write access across all settings"
              >
                <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Grant Operator All (R/W)</span>
              </button>
              <button
                type="button"
                onClick={() => handleSetAll('read-only')}
                className="px-2.5 py-1 text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 rounded shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
                title="Restrict Field Operator to strict Read-Only mode across all settings"
              >
                <Lock className="w-3.5 h-3.5 text-rose-600" />
                <span>Restrict All (Read-Only)</span>
              </button>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <th className="py-2.5 px-4 w-2/5">Subsystem / Functional Area</th>
                <th className="py-2.5 px-4 text-blue-800 bg-blue-50/50">Administrator</th>
                <th className="py-2.5 px-4 text-emerald-800 bg-emerald-50/50">
                  Field Operator {isAdmin ? '(Click to Toggle)' : ''}
                </th>
                <th className="py-2.5 px-4 text-slate-700">Read-Only Auditor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[11px]">
              {SUBSYSTEM_DEFINITIONS.map((sub) => {
                const operatorLevel = operatorPermissions[sub.key] || 'read-only';
                const isRW = operatorLevel === 'read-write';

                return (
                  <tr key={sub.key} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-4 font-semibold text-slate-900">
                      {sub.name}
                      <span className="block text-[10px] text-slate-400 font-normal">
                        {sub.description}
                      </span>
                    </td>

                    {/* Administrator Role Column */}
                    <td className="py-2.5 px-4 font-semibold text-blue-700 bg-blue-50/20">
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold inline-flex items-center gap-1">
                        <Check className="w-3 h-3 text-blue-600" />
                        {sub.adminDefault}
                      </span>
                    </td>

                    {/* Field Operator Role Column with Dynamic Admin Control */}
                    <td className="py-2.5 px-4 bg-emerald-50/20">
                      {isAdmin ? (
                        <button
                          type="button"
                          onClick={() => handleTogglePermission(sub.key)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer shadow-2xs border ${
                            isRW
                              ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border-emerald-300'
                              : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
                          }`}
                          title={`Click to change Field Operator permission to ${isRW ? 'Read-Only' : 'Read / Write'}`}
                        >
                          {isRW ? (
                            <>
                              <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Read / Write</span>
                              <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1 py-0.2 rounded font-mono">
                                Granted
                              </span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-3.5 h-3.5 text-amber-600" />
                              <span>Read-Only</span>
                              <span className="text-[10px] bg-amber-200/80 text-amber-900 px-1 py-0.2 rounded font-mono">
                                Restricted
                              </span>
                            </>
                          )}
                        </button>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${
                            isRW
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {isRW ? (
                            <>
                              <Unlock className="w-3 h-3 text-emerald-600" />
                              <span>Read / Write (Granted by Admin)</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-3 h-3 text-amber-600" />
                              <span>Read-Only (Protected)</span>
                            </>
                          )}
                        </span>
                      )}
                    </td>

                    {/* Read-Only Auditor Role Column */}
                    <td className="py-2.5 px-4 text-slate-600">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        {sub.auditorDefault}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Operator Sessions */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-bold text-sm text-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Laptop className="w-4 h-4 text-blue-600" />
            <span>Active Operator Sessions ({sessions.length})</span>
          </div>
          <span className="text-xs text-slate-500 font-normal">
            Idle Timeout: <strong className="font-mono text-slate-800">15 minutes</strong>
          </span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {sessions.map((sess) => (
            <div key={sess.id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 font-mono">{sess.username}</span>
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-[10px] border border-blue-200">
                    {sess.protocol}
                  </span>
                  {sess.isCurrent && (
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      Your Current Session
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                  <span>Source IP: {sess.ipAddress}</span>
                  <span>•</span>
                  <span>Logged In: {sess.loginTime}</span>
                  <span>•</span>
                  <span className="text-slate-700">{sess.idleDuration}</span>
                </div>
              </div>

              {!sess.isCurrent && (
                <button
                  onClick={() => handleTerminateSession(sess.id)}
                  className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Terminate</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Create User */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border border-slate-300 shadow-xl max-w-md w-full p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                Provision New Gateway User
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  required
                  placeholder="e.g. jsmith_tech"
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Full Name / Operator Description
                </label>
                <input
                  type="text"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="e.g. John Smith (Lead Electrical Engineer)"
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Role Privileges
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="Operator">Operator (Standard Plant Operations)</option>
                  <option value="Administrator">Administrator (Full Access)</option>
                  <option value="Read-Only Auditor">Read-Only Auditor (Monitoring Only)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Account Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Minimum 6 characters"
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Optional SSH Public Key (ed25519 or RSA-4096)
                </label>
                <textarea
                  value={newSshKey}
                  onChange={(e) => setNewSshKey(e.target.value)}
                  placeholder="ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAA..."
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-slate-900 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold shadow-xs cursor-pointer"
                >
                  Provision User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Reset Password */}
      {resettingUser && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border border-slate-300 shadow-xl max-w-sm w-full p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">
                Change Password for <span className="font-mono text-blue-700">{resettingUser}</span>
              </h3>
              <button
                onClick={() => setResettingUser(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveResetPassword} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newResetPassword}
                  onChange={(e) => setNewResetPassword(e.target.value)}
                  required
                  placeholder="Enter new password"
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setResettingUser(null)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold shadow-xs cursor-pointer"
                >
                  Save Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
