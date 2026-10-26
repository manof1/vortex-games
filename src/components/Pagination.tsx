import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange
}) => {
  if (totalPages <= 1) return null;

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  // Calculate up to 3 pages before and 3 pages after current page
  const windowSize = 3;
  const startPage = Math.max(1, currentPage - windowSize);
  const endPage = Math.min(totalPages, currentPage + windowSize);

  const pageNumbers: number[] = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const handleSelectPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  return (
    <div className="mt-8 mb-12 flex flex-col items-center gap-4 animate-fadeIn">
      {/* Informações de contagem da página */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 flex-wrap justify-center">
        <span>Exibindo jogos</span>
        <strong className="text-slate-800 dark:text-cyan-400 font-mono px-2 py-0.5 rounded-lg bg-slate-200/80 dark:bg-slate-900 border border-slate-300 dark:border-slate-800">
          {startIndex} - {endIndex}
        </strong>
        <span>de</span>
        <strong className="text-slate-800 dark:text-white font-mono px-2 py-0.5 rounded-lg bg-slate-200/80 dark:bg-slate-900 border border-slate-300 dark:border-slate-800">
          {totalItems}
        </strong>
        <span>jogos no total</span>
        <span className="hidden sm:inline text-slate-400 dark:text-slate-600">•</span>
        <span className="text-slate-600 dark:text-slate-300">
          Página <strong className="text-cyan-600 dark:text-cyan-400">{currentPage}</strong> de <strong>{totalPages}</strong>
        </span>
      </div>

      {/* Controles de Navegação de Página */}
      <nav 
        className="flex items-center gap-1 sm:gap-1.5 p-1.5 sm:p-2 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-950/10 dark:shadow-slate-950/30 flex-wrap justify-center"
        aria-label="Navegação de páginas do catálogo"
      >
        {/* Botão Primeiro (<<) */}
        <button
          type="button"
          onClick={() => handleSelectPage(1)}
          disabled={currentPage === 1}
          className="px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-cyan-500"
          title="Ir para a Primeira Página"
        >
          <ChevronsLeft className="w-4 h-4" />
          <span className="hidden sm:inline text-[11px]">Primeiro</span>
        </button>

        {/* Botão Para Trás / Anterior (<) */}
        <button
          type="button"
          onClick={() => handleSelectPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-cyan-500"
          title="Página Anterior (Para trás)"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden md:inline text-[11px]">Anterior</span>
        </button>

        {/* Indicador de primeira página se estiver muito adiante */}
        {startPage > 1 && (
          <>
            <button
              type="button"
              onClick={() => handleSelectPage(1)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              1
            </button>
            {startPage > 2 && (
              <span className="px-1 text-slate-400 text-xs font-bold select-none">...</span>
            )}
          </>
        )}

        {/* Botões Numéricos: 3 para trás + Atual + 3 para frente */}
        {pageNumbers.map(pageNum => {
          const isCurrent = pageNum === currentPage;
          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => handleSelectPage(pageNum)}
              aria-current={isCurrent ? 'page' : undefined}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center ${
                isCurrent
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-lg shadow-cyan-500/25 ring-2 ring-cyan-400/80 scale-105'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-cyan-500'
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Indicador de última página se estiver muito antes */}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="px-1 text-slate-400 text-xs font-bold select-none">...</span>
            )}
            <button
              type="button"
              onClick={() => handleSelectPage(totalPages)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Botão Para Frente / Próxima (>) */}
        <button
          type="button"
          onClick={() => handleSelectPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-cyan-500"
          title="Próxima Página (Para frente)"
        >
          <span className="hidden md:inline text-[11px]">Próxima</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Botão Último (>>) */}
        <button
          type="button"
          onClick={() => handleSelectPage(totalPages)}
          disabled={currentPage === totalPages}
          className="px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-cyan-500"
          title="Ir para a Última Página"
        >
          <span className="hidden sm:inline text-[11px]">Último</span>
          <ChevronsRight className="w-4 h-4" />
        </button>
      </nav>
    </div>
  );
};
