'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { GlassCard } from '@/components/ui/GlassCard';
import { Sun, Moon, Laptop, Palette } from 'lucide-react';

export function ThemeToggleSection() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { label: 'Terang (Light)', value: 'light', icon: Sun },
    { label: 'Gelap (Dark)', value: 'dark', icon: Moon },
    { label: 'Sistem', value: 'system', icon: Laptop },
  ];

  return (
    <GlassCard className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
          <Palette className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Tampilan & Mode Tema
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Apple Liquid Glass siap di kedua mode
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {themes.map((t) => {
          const Icon = t.icon;
          const isActive = theme === t.value;

          return (
            <button
              key={t.value}
              onClick={() => setTheme(t.value)}
              className={`p-3.5 rounded-2xl flex flex-col items-center gap-2 border transition-all ${
                isActive
                  ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-500/25'
                  : 'bg-white/40 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-bold">{t.label}</span>
            </button>
          );
        })}
      </div>
    </GlassCard>
  );
}
