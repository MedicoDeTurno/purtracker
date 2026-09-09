import React from 'react';
import { User } from 'firebase/auth';
import {
  Plus,
  FileSpreadsheet,
  Stethoscope,
  LogOut,
  HelpCircle,
} from 'lucide-react';
import { logoutGoogle } from '../lib/firebase';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  user: User | null;
  overallAverage: number;
  totalQuestions: number;
  onOpenAddModal: () => void;
  onOpenSheetsModal: () => void;
  onOpenPriorities: () => void;
  onOpenTutorial: () => void;
  sheetsUrl?: string;
  hasSheetsSync: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  overallAverage,
  totalQuestions,
  onOpenAddModal,
  onOpenSheetsModal,
  onOpenTutorial,
  hasSheetsSync,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-slate-900 dark:text-white tracking-tight text-base">
                PUR Tracker
              </span>
              <span className="hidden sm:inline-block text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Residencias Médicas
              </span>
            </div>
          </div>

          {/* Quick Stats Pill (Desktop) */}
          {totalQuestions > 0 && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100/80 dark:bg-slate-800/80 text-xs text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {overallAverage.toFixed(1)}%
              </span>
              <span className="text-slate-400 dark:text-slate-500">·</span>
              <span>{totalQuestions} preguntas</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Google Sheets */}
            <button
              onClick={onOpenSheetsModal}
              title={hasSheetsSync ? 'Sincronizado con Google Sheets' : 'Sincronizar con Google Sheets'}
              className={`p-2 rounded-lg text-xs font-medium transition-colors relative ${
                hasSheetsSync
                  ? 'text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              {hasSheetsSync && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
            </button>

            {/* Guía */}
            <button
              onClick={onOpenTutorial}
              title="Guía de uso"
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Registrar Repaso */}
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-medium rounded-lg shadow-2xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Registrar</span>
            </button>

            {/* User */}
            {user && (
              <div className="flex items-center gap-1.5 pl-1.5 border-l border-slate-200 dark:border-slate-800">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Usuario'}
                    className="w-7 h-7 rounded-full border border-slate-200 dark:border-slate-700"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-xs">
                    {user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
                <button
                  onClick={() => logoutGoogle()}
                  title="Cerrar sesión"
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};


