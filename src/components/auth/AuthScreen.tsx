import React, { useState } from 'react';
import {
  BrainCircuit,
  ShieldCheck,
  GraduationCap,
  School,
  Microscope,
  ArrowRight,
  Lock,
  Mail,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  User,
  KeyRound,
  Info,
  Eye,
  EyeOff,
  HelpCircle,
  X
} from 'lucide-react';
import { UserRole, UserProfile, SampleAccountCredential } from '../../types';
import { sampleIndianAccounts } from '../../data/sampleData';
import { RAGService } from '../../services/ragService';

interface AuthScreenProps {
  onLogin: (user: UserProfile) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [identifier, setIdentifier] = useState('aarav_student');
  const [password, setPassword] = useState('Aarav#Student2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [roleFilter, setRoleFilter] = useState<'All' | UserRole>('All');
  const [selectedAccount, setSelectedAccount] = useState<SampleAccountCredential>(sampleIndianAccounts[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  const handleSelectAccount = (acc: SampleAccountCredential) => {
    setSelectedAccount(acc);
    setIdentifier(acc.username);
    setPassword(acc.passwordHint);
    setError(null);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setIsResetting(true);
    setForgotMsg(null);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrUsername: forgotEmail.trim() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to dispatch reset token');
      setForgotMsg(`✓ ${data.message} (Development token: ${data.reset_token})`);
    } catch (err: any) {
      setForgotMsg(`✕ ${err.message}`);
    } finally {
      setIsResetting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setError('Please provide an email/username and password.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await RAGService.login(identifier.trim(), password.trim());
      onLogin(res.user);
    } catch (err: any) {
      setError(err.message || 'Invalid login credentials. Please check your username and password.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'Student':
        return <GraduationCap className="h-4 w-4 text-blue-500" />;
      case 'Teacher':
        return <School className="h-4 w-4 text-emerald-500" />;
      case 'Researcher':
        return <Microscope className="h-4 w-4 text-purple-500" />;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'Student':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200 border-blue-200 dark:border-blue-800';
      case 'Teacher':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800';
      case 'Researcher':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200 border-purple-200 dark:border-purple-800';
    }
  };

  return (
    <div className="min-h-screen w-screen bg-academic-50 dark:bg-academic-950 flex flex-col justify-between select-none text-academic-900 dark:text-academic-50 transition-colors">
      {/* Top Banner */}
      <header className="px-8 py-5 border-b border-academic-200/80 dark:border-academic-800 bg-white/80 dark:bg-academic-900/80 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white shadow-md shadow-primary-500/20">
            <BrainCircuit className="h-6 w-6 text-primary-100" />
          </div>
          <div>
            <h1 className="font-bold text-sm leading-tight text-academic-900 dark:text-white">
              Intelligent Document Research Assistant
            </h1>
            <p className="text-[11px] font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide">
              AI-Powered Research & Learning Platform
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 font-medium">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Role-Based Access Control (RBAC) • Cryptographic Scrypt Hashing</span>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Sample Indian Development Accounts */}
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary-100 dark:bg-primary-950/80 text-primary-700 dark:text-primary-300 text-[11px] font-bold uppercase tracking-wider">
                  <Sparkles className="h-3 w-3" />
                  <span>Sample Indian Development Accounts</span>
                </div>
                {/* Role Filter Pills */}
                <div className="flex items-center gap-1 bg-academic-100 dark:bg-academic-800 p-0.5 rounded-lg border border-academic-200 dark:border-academic-700 text-[11px]">
                  {(['All', 'Student', 'Teacher', 'Researcher'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRoleFilter(r)}
                      className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                        roleFilter === r
                          ? 'bg-white dark:bg-academic-900 text-primary-600 dark:text-primary-400 shadow-2xs'
                          : 'text-academic-500 hover:text-academic-900 dark:hover:text-white'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-academic-900 dark:text-white">
                Select an Academic Persona
              </h2>
              <p className="text-xs text-academic-500 dark:text-academic-400">
                Click any account to automatically pre-fill login credentials and test role-specific dashboards, question papers, and permissions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sampleIndianAccounts
                .filter((acc) => roleFilter === 'All' || acc.role === roleFilter)
                .map((acc) => {
                const isSelected = selectedAccount.username === acc.username;

                return (
                  <div
                    key={acc.username}
                    onClick={() => handleSelectAccount(acc)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-primary-50/70 dark:bg-primary-950/50 border-primary-500 shadow-sm ring-2 ring-primary-500/20'
                        : 'bg-white dark:bg-academic-900 border-academic-200 dark:border-academic-800 hover:border-academic-300 dark:hover:border-academic-700 shadow-2xs'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="h-8 w-8 rounded-xl bg-academic-100 dark:bg-academic-800 font-bold text-xs flex items-center justify-center text-academic-800 dark:text-academic-200">
                            {acc.avatar}
                          </span>
                          <div>
                            <h4 className="text-xs font-bold text-academic-900 dark:text-white">
                              {acc.name}
                            </h4>
                            <span className="text-[10px] text-academic-400 font-mono">
                              @{acc.username}
                            </span>
                          </div>
                        </div>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${getRoleColor(acc.role)}`}>
                          {getRoleIcon(acc.role)}
                          <span>{acc.role}</span>
                        </span>
                      </div>

                      <div className="text-[11px] text-academic-500 dark:text-academic-400 space-y-0.5">
                        <p className="font-semibold text-academic-700 dark:text-academic-300 truncate">
                          {acc.institution}
                        </p>
                        <p className="text-[10px] text-academic-400 truncate">
                          {acc.department}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-academic-100 dark:border-academic-800/80 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-academic-400">Pass: {acc.passwordHint}</span>
                      <span className={`font-semibold ${isSelected ? 'text-primary-600 dark:text-primary-400' : 'text-academic-400'}`}>
                        {isSelected ? '✓ Selected' : 'Use Account'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3 rounded-xl bg-academic-100/70 dark:bg-academic-900/60 border border-academic-200/60 dark:border-academic-800 text-[11px] text-academic-600 dark:text-academic-400 flex items-center gap-2">
              <Info className="h-4 w-4 text-academic-400 shrink-0" />
              <span>
                Passwords are never stored in plaintext. The backend verifies authentications against salted scrypt hashes in <code className="font-mono text-primary-600">backend/data/users.json</code>.
              </span>
            </div>
          </div>

          {/* Right Column: Secure Login Form */}
          <div className="lg:col-span-5">
            <div className="p-7 rounded-3xl bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 shadow-xl space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-academic-900 dark:text-white flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary-600" />
                  <span>Secure Portal Sign In</span>
                </h3>
                <p className="text-xs text-academic-500 dark:text-academic-400">
                  Enter your university credentials or click any profile on the left.
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-xs text-red-800 dark:text-red-300 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-academic-500 block mb-1.5">
                    Academic Email or Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-academic-400" />
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. aarav_student or aarav.sharma@research.edu.in"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-academic-50 dark:bg-academic-800 border border-academic-200 dark:border-academic-700 text-xs sm:text-sm text-academic-900 dark:text-white placeholder-academic-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-academic-500">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotEmail(identifier.includes('@') ? identifier : '');
                        setForgotMsg(null);
                        setShowForgotModal(true);
                      }}
                      className="text-xs text-primary-600 dark:text-primary-400 hover:underline cursor-pointer font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-academic-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter secure password..."
                      required
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-academic-50 dark:bg-academic-800 border border-academic-200 dark:border-academic-700 text-xs sm:text-sm text-academic-900 dark:text-white placeholder-academic-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-academic-400 hover:text-academic-600 dark:hover:text-academic-200 cursor-pointer"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Option */}
                <div className="flex items-center justify-between text-xs text-academic-600 dark:text-academic-400">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-3.5 w-3.5 rounded border-academic-300 text-primary-600 focus:ring-primary-500/20"
                    />
                    <span>Remember this session on this workstation</span>
                  </label>
                </div>

                {/* Selected Account Info Box */}
                {selectedAccount && (
                  <div className="p-3 rounded-xl bg-academic-50 dark:bg-academic-800/50 border border-academic-200/60 dark:border-academic-700/60 text-xs space-y-1">
                    <div className="flex items-center justify-between text-academic-600 dark:text-academic-300">
                      <span>Target Role:</span>
                      <strong className="text-academic-900 dark:text-white">{selectedAccount.role}</strong>
                    </div>
                    <div className="flex items-center justify-between text-academic-600 dark:text-academic-300">
                      <span>Target Institution:</span>
                      <span className="font-medium truncate max-w-[200px] text-right">{selectedAccount.institution}</span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-primary-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>{isLoading ? 'Verifying Credentials...' : 'Sign In to Workspace'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              <div className="pt-2 text-center text-[11px] text-academic-400">
                <span>Need test credentials? Choose any of the 6 pre-configured Indian accounts on the left.</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-4 border-t border-academic-200/80 dark:border-academic-800 text-center text-xs text-academic-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>© 2026 Intelligent Document Research Assistant • Powered by LangChain, Flask & ChromaDB</span>
        <span className="font-mono text-[10px]">Security: PBKDF2/Scrypt Hashing Active</span>
      </footer>

      {/* Forgot Password Recovery Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-academic-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-academic-900 border border-academic-200 dark:border-academic-800 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary-100 dark:bg-primary-950 text-primary-600 flex items-center justify-center">
                  <KeyRound className="h-4 w-4" />
                </div>
                <h3 className="font-bold text-sm text-academic-900 dark:text-white">
                  Academic Password Recovery
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="p-1 rounded-lg text-academic-400 hover:text-academic-700 dark:hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-academic-500">
              Enter your registered Indian university email or username to request secure reset instructions.
            </p>

            {forgotMsg && (
              <div className={`p-3 rounded-xl text-xs ${forgotMsg.startsWith('✓') ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' : 'bg-red-50 text-red-800 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-800'}`}>
                {forgotMsg}
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-academic-400 block mb-1">
                  University Email or Username
                </label>
                <input
                  type="text"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="e.g. rahul_prof or rahul.verma@faculty.edu.in"
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-academic-50 dark:bg-academic-800 border border-academic-200 dark:border-academic-700 text-xs text-academic-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-academic-600 dark:text-academic-400 hover:bg-academic-100 dark:hover:bg-academic-800 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isResetting}
                  className="px-4 py-1.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isResetting ? 'Dispatching...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
