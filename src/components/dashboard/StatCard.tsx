import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  subtext?: string;
  colorTheme?: 'indigo' | 'emerald' | 'amber' | 'blue';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  change,
  subtext,
  colorTheme = 'indigo',
  onClick
}) => {
  const colorMap = {
    indigo: {
      bg: 'bg-primary-50 dark:bg-primary-950/50',
      iconBg: 'bg-primary-100 dark:bg-primary-900/80 text-primary-600 dark:text-primary-300',
      badge: 'text-primary-700 dark:text-primary-400 bg-primary-100/80 dark:bg-primary-900/50',
    },
    emerald: {
      bg: 'bg-emerald-50/70 dark:bg-emerald-950/40',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/80 text-emerald-600 dark:text-emerald-300',
      badge: 'text-emerald-700 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-900/50',
    },
    amber: {
      bg: 'bg-amber-50/70 dark:bg-amber-950/40',
      iconBg: 'bg-amber-100 dark:bg-amber-900/80 text-amber-600 dark:text-amber-300',
      badge: 'text-amber-700 dark:text-amber-400 bg-amber-100/80 dark:bg-amber-900/50',
    },
    blue: {
      bg: 'bg-sky-50/70 dark:bg-sky-950/40',
      iconBg: 'bg-sky-100 dark:bg-sky-900/80 text-sky-600 dark:text-sky-300',
      badge: 'text-sky-700 dark:text-sky-400 bg-sky-100/80 dark:bg-sky-900/50',
    }
  };

  const currentTheme = colorMap[colorTheme];

  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-2xl bg-white dark:bg-academic-900 border border-academic-200/80 dark:border-academic-800 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between ${
        onClick ? 'cursor-pointer hover:border-primary-400 dark:hover:border-primary-600' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-academic-500 dark:text-academic-400">
            {title}
          </p>
          <h3 className="text-3xl font-extrabold text-academic-900 dark:text-white mt-1.5 font-sans tracking-tight">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-xl ${currentTheme.iconBg}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between pt-3 border-t border-academic-100 dark:border-academic-800/80">
        <span className="text-[12px] text-academic-500 dark:text-academic-400">
          {subtext || 'Grounded in knowledge base'}
        </span>
        {change && (
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${currentTheme.badge}`}>
            {change}
          </span>
        )}
      </div>
    </div>
  );
};
