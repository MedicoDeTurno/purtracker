import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor, ChevronDown } from 'lucide-react';
import { Theme, useTheme } from '../lib/theme';

export const ThemeToggle: React.FC = () => {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const options: { value: Theme; label: string; icon: React.ReactNode }[] = [
    {
      value: 'light',
      label: 'Claro',
      icon: <Sun className="w-4 h-4 text-amber-500" />,
    },
    {
      value: 'dark',
      label: 'Oscuro',
      icon: <Moon className="w-4 h-4 text-indigo-400" />,
    },
    {
      value: 'system',
      label: 'Sistema',
      icon: <Monitor className="w-4 h-4 text-slate-400" />,
    },
  ];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
        {/* Quick 1-click toggle button */}
        <button
          type="button"
          onClick={toggleTheme}
          title={`Modo actual: ${theme === 'system' ? 'Sistema (' + resolvedTheme + ')' : theme === 'dark' ? 'Oscuro' : 'Claro'}. Clic para alternar.`}
          aria-label="Cambiar tema claro u oscuro"
          className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-l-lg hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors flex items-center gap-1.5 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
        >
          {resolvedTheme === 'dark' ? (
            <Moon className="w-4 h-4 text-indigo-400" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500" />
          )}
          <span className="text-xs font-semibold hidden xl:inline">
            {theme === 'system' ? 'Auto' : theme === 'dark' ? 'Noche' : 'Día'}
          </span>
        </button>

        {/* Dropdown chevron to select Light, Dark, or System */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          title="Opciones de tema"
          aria-expanded={isOpen}
          aria-haspopup="true"
          className="p-1.5 pr-2 pl-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-r-lg hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors border-l border-slate-200 dark:border-slate-800 focus:outline-hidden"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Menu dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-36 origin-top-right rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg ring-1 ring-black/5 dark:ring-white/10 z-50 py-1 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
            Tema de interfaz
          </div>
          {options.map((opt) => {
            const isSelected = theme === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => {
                  setTheme(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  {opt.icon}
                  <span>{opt.label}</span>
                </div>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
