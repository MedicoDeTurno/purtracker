import React, { useState, useMemo } from 'react';
import { Search, Plus, BookOpen, X } from 'lucide-react';
import { TopicSummary, Specialty } from '../types';
import { TopicCard } from './TopicCard';

interface TopicListProps {
  topicSummaries: TopicSummary[];
  onAddNextReview: (topicName: string, specialty: Specialty) => void;
  onOpenAIPearls: (summary: TopicSummary) => void;
  onDeleteAttempt: (attemptId: string) => void;
  onOpenAddModal: () => void;
}

type SortOption = 'urgency' | 'lowestScore' | 'highestScore' | 'highestDelta' | 'name' | 'reviews';

export const TopicList: React.FC<TopicListProps> = ({
  topicSummaries,
  onAddNextReview,
  onOpenAIPearls,
  onDeleteAttempt,
  onOpenAddModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('urgency');

  const specialtiesList: Specialty[] = [
    'Medicina Familiar y Comunitaria',
    'Medicina Interna',
    'Ginecotología',
    'Cirugía',
    'Pediatría',
    'Psiquiatría',
    'Medicina Legal',
    'Bioética',
  ];

  const reviewedCount = useMemo(
    () => topicSummaries.filter((t) => t.totalReviews > 0).length,
    [topicSummaries]
  );
  const unreviewedCount = useMemo(
    () => topicSummaries.filter((t) => t.totalReviews === 0).length,
    [topicSummaries]
  );
  const riskCount = useMemo(
    () => topicSummaries.filter((t) => t.totalReviews > 0 && t.latestPercentage < 75).length,
    [topicSummaries]
  );

  const filteredAndSorted = useMemo(() => {
    return topicSummaries
      .filter((item) => {
        // Search filter
        const matchSearch =
          item.topicName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.specialty.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchSearch) return false;

        // Specialty filter
        if (selectedSpecialty !== 'all' && item.specialty !== selectedSpecialty) {
          return false;
        }

        // Status filter
        if (statusFilter === 'reviewed') {
          return item.totalReviews > 0;
        }
        if (statusFilter === 'unreviewed') {
          return item.totalReviews === 0;
        }
        if (statusFilter === 'risk') {
          return item.totalReviews > 0 && item.latestPercentage < 75;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'lowestScore':
            return a.latestPercentage - b.latestPercentage;
          case 'highestScore':
            return b.latestPercentage - a.latestPercentage;
          case 'highestDelta':
            return b.deltaPercentage - a.deltaPercentage;
          case 'reviews':
            return b.totalReviews - a.totalReviews;
          case 'name':
            return a.topicName.localeCompare(b.topicName);
          case 'urgency':
          default:
            return b.urgencyScore - a.urgencyScore;
        }
      });
  }, [topicSummaries, searchQuery, selectedSpecialty, statusFilter, sortBy]);

  return (
    <div className="space-y-4">
      {/* Minimalist Controls Bar */}
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-3 transition-colors">
        {/* Top Row: Search + Selects */}
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Buscar tema (ej: ITU, Preeclampsia, Asma...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-750 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Specialty Filter Dropdown */}
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">Todas las materias ({specialtiesList.length})</option>
            {specialtiesList.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          >
            <option value="urgency">Prioridad de repaso</option>
            <option value="highestDelta">Mayor mejora (+%)</option>
            <option value="lowestScore">Menor puntaje</option>
            <option value="highestScore">Mayor puntaje</option>
            <option value="reviews">Más repasos</option>
            <option value="name">Nombre A-Z</option>
          </select>
        </div>

        {/* Bottom Row: Segmented Status Filter + Counter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/70">
          <div className="inline-flex p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium self-start">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                statusFilter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Todos ({topicSummaries.length})
            </button>
            <button
              onClick={() => setStatusFilter('reviewed')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                statusFilter === 'reviewed'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Con repasos ({reviewedCount})
            </button>
            <button
              onClick={() => setStatusFilter('unreviewed')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                statusFilter === 'unreviewed'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Pendientes ({unreviewedCount})
            </button>
            <button
              onClick={() => setStatusFilter('risk')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                statusFilter === 'risk'
                  ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              En riesgo ({riskCount})
            </button>
          </div>

          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            Mostrando {filteredAndSorted.length} de {topicSummaries.length} temas
          </span>
        </div>
      </div>

      {/* Topics Grid */}
      {filteredAndSorted.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredAndSorted.map((summary) => (
            <TopicCard
              key={summary.topicId}
              summary={summary}
              onAddNextReview={onAddNextReview}
              onOpenAIPearls={onOpenAIPearls}
              onDeleteAttempt={onDeleteAttempt}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-10 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 mx-auto flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              No hay temas que coincidan con la búsqueda
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Prueba cambiando los filtros o registra un nuevo repaso.
            </p>
          </div>
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Registrar repaso</span>
          </button>
        </div>
      )}
    </div>
  );
};
