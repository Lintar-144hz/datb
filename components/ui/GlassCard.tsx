'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  glow?: boolean;
}

export function GlassCard({
  children,
  className,
  interactive = false,
  glow = false,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'relative overflow-hidden rounded-2xl p-5 md:p-6',
        interactive ? 'glass-card-interactive cursor-pointer' : 'glass-card',
        glow && 'before:absolute before:-inset-px before:rounded-2xl before:bg-gradient-to-r before:from-purple-500/20 before:via-indigo-500/10 before:to-transparent before:opacity-75 before:pointer-events-none',
        className
      )}
      {...props}
    >
      {/* Specular highlight border overlay */}
      <div className="absolute inset-0 rounded-2xl border border-white/20 dark:border-white/10 pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
