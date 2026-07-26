'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AuroraBackground } from '@/components/ui/AuroraBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassInput } from '@/components/ui/GlassInput';
import { GlassButton } from '@/components/ui/GlassButton';
import { useAuth } from '@/hooks/useAuth';
import { Wallet, User, ArrowRight, ShieldCheck, Sparkles, KeyRound } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMsg('Masukkan username terlebih dahulu');
      return;
    }

    try {
      setErrorMsg('');
      await login(username.trim());
      router.push('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal masuk');
    }
  };

  const handleDemoLogin = (demoName: string) => {
    setUsername(demoName);
  };

  return (
    <AuroraBackground>
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          <GlassCard glow className="p-6 sm:p-8 space-y-6 relative border-purple-500/30">
            {/* Header Brand */}
            <div className="text-center space-y-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-purple-600 text-white shadow-xl shadow-purple-500/30 mx-auto mb-2">
                <Wallet className="h-7 w-7" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                Tabungan Dev
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Aplikasi Finansial & Tabungan Liquid Glass
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <GlassInput
                label="Username / Nama Panggilan"
                placeholder="Contoh: dev_santoso"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                icon={<User className="h-4 w-4" />}
                error={errorMsg}
                autoFocus
              />

              <GlassButton
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full shadow-xl shadow-purple-500/25"
              >
                <span>Masuk Aplikasi</span>
                <ArrowRight className="h-4 w-4 ml-1.5 stroke-[2.5]" />
              </GlassButton>
            </form>

            {/* Quick Demo Accounts */}
            <div className="space-y-2 pt-2 border-t border-slate-200/50 dark:border-slate-800">
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 text-center">
                Atau coba dengan username cepat:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {['frontend_pro', 'fullstack_dev', 'lintar_dev'].map((demo) => (
                  <button
                    key={demo}
                    type="button"
                    onClick={() => handleDemoLogin(demo)}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white/40 dark:bg-slate-800/40 hover:bg-purple-500/20 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 transition-colors"
                  >
                    @{demo}
                  </button>
                ))}
              </div>
            </div>

            {/* Info Badge */}
            <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
              <ShieldCheck className="h-5 w-5 text-purple-600 dark:text-purple-400 shrink-0" />
              <span>
                Tanpa password! Jika username belum ada, akun baru akan dibuat otomatis.
              </span>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </AuroraBackground>
  );
}
