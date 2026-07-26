'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { Modal } from '@/components/ui/Modal';
import {
  Smartphone,
  Download,
  PackageCheck,
  ExternalLink,
  Sparkles,
  Layers,
  Info,
} from 'lucide-react';

export function PwaInstallBanner() {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(() => {
    if (typeof window !== 'undefined') {
      return (
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true
      );
    }
    return false;
  });
  const [showApkGuide, setShowApkGuide] = useState(false);

  useEffect(() => {
    // Check if install prompt is cached
    const checkPrompt = () => {
      if ((window as any).deferredPwaPrompt) {
        setCanInstall(true);
      }
    };

    checkPrompt();
    window.addEventListener('beforeinstallprompt', checkPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', checkPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    const promptEvent = (window as any).deferredPwaPrompt;
    if (!promptEvent) {
      setShowApkGuide(true);
      return;
    }

    promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setCanInstall(false);
    }
    (window as any).deferredPwaPrompt = null;
  };

  return (
    <>
      <GlassCard className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-purple-500/30">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30 shrink-0">
            <Smartphone className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>Modul PWA & Aplikasi Mobile APK</span>
              <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                {isInstalled ? 'Terpasang' : 'PWA Ready'}
              </span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Install langsung di HP/PC atau ubah menjadi file .APK Android
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!isInstalled && (
            <GlassButton
              size="sm"
              variant="primary"
              onClick={handleInstallClick}
              className="shadow-md shadow-purple-500/20"
            >
              <Download className="h-4 w-4 mr-1.5" />
              <span>{canInstall ? 'Install App' : 'Panduan APK'}</span>
            </GlassButton>
          )}

          <GlassButton
            size="sm"
            variant="secondary"
            onClick={() => setShowApkGuide(true)}
          >
            <PackageCheck className="h-4 w-4 mr-1.5" />
            <span>Zip to APK / PWABuilder</span>
          </GlassButton>
        </div>
      </GlassCard>

      {/* APK Conversion & PWA Guide Modal */}
      <Modal
        isOpen={showApkGuide}
        onClose={() => setShowApkGuide(false)}
        title="Konversi PWA ke APK Android"
        description="Petunjuk mengubah aplikasi Tabungan Dev menjadi file installer .APK"
      >
        <div className="space-y-4 pt-1">
          {/* Methods */}
          <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400">
              <Sparkles className="h-4 w-4" />
              <span>Metode 1: PWABuilder (Sangat Mudah & Resmi)</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              1. Buka <strong>pwabuilder.com</strong> di browser Android atau PC.<br />
              2. Masukkan URL aplikasi ini.<br />
              3. Klik tombol <strong>&quot;Package for Android&quot;</strong> & download file APK / TWA.<br />
              4. Install file .apk langsung di smartphone Android Anda.
            </p>
            <a
              href="https://www.pwabuilder.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline pt-1"
            >
              <span>Kunjungi PWABuilder.com</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <Layers className="h-4 w-4" />
              <span>Metode 2: Convert Web2APK / Zip to APK</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Anda juga bisa menggunakan konverter Zip/Web to APK online seperti <strong>Web2APK</strong> atau <strong>WebIntoApp</strong>:<br />
              • URL Aplikasi: <code>{typeof window !== 'undefined' ? window.location.origin : 'https://applet-url'}</code><br />
              • App Name: <code>Tabungan Dev</code><br />
              • Package Name: <code>com.tabungandev.pwa</code>
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-200/50 dark:bg-slate-800/50 border border-slate-300/40 dark:border-slate-700/40 flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
            <Info className="h-4 w-4 text-purple-500 shrink-0 mt-0.5" />
            <span>
              Aplikasi ini sudah dilengkapi <code>manifest.json</code>, <code>sw.js</code>, ikon SVG/PNG 192px & 512px, serta mode offline penuh.
            </span>
          </div>

          <div className="flex justify-end pt-2">
            <GlassButton variant="primary" onClick={() => setShowApkGuide(false)}>
              Mengerti & Tutup
            </GlassButton>
          </div>
        </div>
      </Modal>
    </>
  );
}
