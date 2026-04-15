'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Icon from '@/components/icons/Icon';

type Tab = 'profilo' | 'sicurezza';

const INPUT_CLASS = 'w-full p-3 bg-white text-gray-900 border border-gray-300 rounded-xl outline-none focus:border-[var(--brand-title)] text-sm';

const SettingsPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('profilo');

  // Profilo
  const [name, setName] = useState('');
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password
  const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' });
  const [pwdMsg, setPwdMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSavingPwd, setIsSavingPwd] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login');
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    fetch('/api/admin/profile')
      .then(r => r.json())
      .then(d => setName(d.name ?? ''));
  }, [status]);

  const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileMsg(null);
    const res = await fetch('/api/admin/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    setProfileMsg(res.ok
      ? { type: 'success', text: 'Profilo aggiornato!' }
      : { type: 'error', text: data.error }
    );
    setIsSavingProfile(false);
  };

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pwd.next !== pwd.confirm) {
      setPwdMsg({ type: 'error', text: 'Le nuove password non coincidono' });
      return;
    }
    setIsSavingPwd(true);
    setPwdMsg(null);
    const res = await fetch('/api/admin/password', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: pwd.current, newPassword: pwd.next }),
    });
    const data = await res.json();
    if (res.ok) {
      setPwdMsg({ type: 'success', text: 'Password aggiornata!' });
      setPwd({ current: '', next: '', confirm: '' });
    } else {
      setPwdMsg({ type: 'error', text: data.error });
    }
    setIsSavingPwd(false);
  };

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-[var(--brand-title)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'profilo', label: 'Profilo', icon: 'user' },
    { id: 'sicurezza', label: 'Sicurezza', icon: 'shield' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="p-2 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
            <Icon name="chevronLeft" size={20} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Impostazioni</h1>
            <p className="text-sm text-gray-500">{session?.user?.email}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-gray-200 rounded-2xl p-1 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setProfileMsg(null); setPwdMsg(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all
                ${activeTab === tab.id
                  ? 'bg-[var(--brand-title)] text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              <Icon name={tab.icon as any} size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab: Profilo */}
        {activeTab === 'profilo' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-1">Informazioni Profilo</h2>
            <p className="text-sm text-gray-500 mb-6">Il nome che appare nella dashboard admin.</p>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nome visualizzato</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className={INPUT_CLASS}
                  placeholder="Es. Arianna Ciervo"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email</label>
                <input
                  type="email"
                  value={session?.user?.email ?? ''}
                  disabled
                  className={`${INPUT_CLASS} opacity-60 cursor-not-allowed`}
                />
                <p className="text-xs text-gray-400 mt-1">L&apos;email non è modificabile</p>
              </div>
              {profileMsg && (
                <p className={`text-sm ${profileMsg.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                  {profileMsg.text}
                </p>
              )}
              <button
                type="submit"
                disabled={isSavingProfile}
                className={`px-6 py-2.5 rounded-xl font-bold text-white text-sm transition-all
                  ${isSavingProfile ? 'bg-gray-300 cursor-not-allowed' : 'bg-[var(--brand-title)] hover:shadow-md'}`}
              >
                {isSavingProfile ? 'Salvataggio...' : 'Salva modifiche'}
              </button>
            </form>
          </div>
        )}

        {/* Tab: Sicurezza */}
        {activeTab === 'sicurezza' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-1">Cambia Password</h2>
            <p className="text-sm text-gray-500 mb-6">Usa una password di almeno 8 caratteri.</p>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Password attuale</label>
                <input
                  type="password"
                  value={pwd.current}
                  onChange={e => setPwd(d => ({ ...d, current: e.target.value }))}
                  required
                  className={INPUT_CLASS}
                  placeholder="Inserisci la password attuale"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nuova password</label>
                <input
                  type="password"
                  value={pwd.next}
                  onChange={e => setPwd(d => ({ ...d, next: e.target.value }))}
                  required
                  minLength={8}
                  className={INPUT_CLASS}
                  placeholder="Inserisci la nuova password"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Conferma nuova password</label>
                <input
                  type="password"
                  value={pwd.confirm}
                  onChange={e => setPwd(d => ({ ...d, confirm: e.target.value }))}
                  required
                  className={INPUT_CLASS}
                  placeholder="Ripeti la nuova password"
                />
              </div>
              {pwdMsg && (
                <p className={`text-sm ${pwdMsg.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                  {pwdMsg.text}
                </p>
              )}
              <button
                type="submit"
                disabled={isSavingPwd}
                className={`px-6 py-2.5 rounded-xl font-bold text-white text-sm transition-all
                  ${isSavingPwd ? 'bg-gray-300 cursor-not-allowed' : 'bg-[var(--brand-title)] hover:shadow-md'}`}
              >
                {isSavingPwd ? 'Aggiornamento...' : 'Aggiorna password'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(SettingsPage), { ssr: false });
