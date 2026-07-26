'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';

interface BadgeProps {
  children?: React.ReactNode;
  type?: 'income' | 'expense' | 'neutral' | 'success' | 'purple';
  size?: 'sm' | 'md';
  className?: string;
  icon?: boolean;
}

export function Badge({
  children,
  type = 'neutral',
  size = 'md',
  className,
  icon = false,
}: BadgeProps) {
  const styles = {
    income:
      'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    expense:
      'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
    neutral:
      'bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30',
    success:
      'bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30',
    purple:
      'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-semibold rounded-full border backdrop-blur-md',
        sizes[size],
        styles[type],
        className
      )}
    >
      {icon && type === 'income' && <ArrowDownLeft className="h-3 w-3" />}
      {icon && type === 'expense' && <ArrowUpRight className="h-3 w-3" />}
      {children}
    </span>
  );
}
