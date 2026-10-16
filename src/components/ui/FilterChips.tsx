import React from 'react';

export interface FilterChipOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterChipsProps {
  options: FilterChipOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  className?: string;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  options,
  selectedId,
  onSelect,
  className = '',
}) => {
  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      {options.map((opt) => {
        const isSelected = selectedId === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onSelect(opt.id)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-fast flex items-center gap-1.5 ${
              isSelected
                ? 'bg-accent-primary-bg text-accent-primary border border-accent-primary/40 shadow-sm'
                : 'bg-bg-surface border border-border-token text-text-muted hover:text-text-primary hover:border-border-token'
            }`}
          >
            <span>{opt.label}</span>
            {opt.count !== undefined && (
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-accent-primary/20 text-accent-primary' : 'bg-border-token/40 text-text-muted'
                }`}
              >
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
