/**
 * GridControls Component
 * [From]: specs/012-ui-redesign/tasks.md - T-021
 *
 * Controls for customizing the task grid layout:
 * - Column count selector
 * - Card size toggle
 * - Preferences persisted to localStorage
 */

'use client';

import { Grid3x3, Columns } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/design-system';
import { useEffect, useState } from 'react';

export type GridColumns = 1 | 2 | 3 | 4;
export type GridSize = 'compact' | 'comfortable' | 'spacious';

const STORAGE_KEY = 'task-grid-preferences';

interface GridPreferences {
  columns: GridColumns;
  size: GridSize;
}

const DEFAULT_PREFERENCES: GridPreferences = {
  columns: 3,
  size: 'comfortable',
};

export interface GridControlsProps {
  columns: GridColumns;
  onColumnsChange: (columns: GridColumns) => void;
  className?: string;
}

export function GridControls({ columns, onColumnsChange, className }: GridControlsProps) {
  const [size, setSize] = useState<GridSize>('comfortable');

  // Load preferences from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const prefs: GridPreferences = JSON.parse(stored);
        setSize(prefs.size);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const handleColumnsChange = (newColumns: GridColumns) => {
    onColumnsChange(newColumns);
    savePreferences({ columns: newColumns, size });
  };

  const handleSizeChange = (newSize: GridSize) => {
    setSize(newSize);
    savePreferences({ columns, size: newSize });
  };

  return (
    <GlassCard
      blur="sm"
      border
      className={cn(
        'flex items-center gap-4 px-4 py-2 rounded-full',
        'self-start',
        className
      )}
    >
      {/* Column selector */}
      <div className="flex items-center gap-2">
        <Columns className="h-4 w-4 text-muted-foreground" />
        <div className="flex items-center bg-background/50 rounded-full border border-glass-border">
          {[1, 2, 3, 4].map((col) => (
            <button
              key={col}
              onClick={() => handleColumnsChange(col as GridColumns)}
              className={cn(
                'w-8 h-8 rounded-full',
                'flex items-center justify-center',
                'text-sm font-medium transition-all duration-200',
                columns === col
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted/50',
                'hover:scale-105'
              )}
              aria-label={`Show ${col} columns`}
              aria-pressed={columns === col}
            >
              {col}
            </button>
          ))}
        </div>
      </div>

      {/* Size toggle */}
      <div className="hidden sm:flex items-center gap-2">
        <Grid3x3 className="h-4 w-4 text-muted-foreground" />
        <div className="flex items-center bg-background/50 rounded-full border border-glass-border">
          {(['compact', 'comfortable', 'spacious'] as const).map((sizeOption) => (
            <button
              key={sizeOption}
              onClick={() => handleSizeChange(sizeOption)}
              className={cn(
                'px-3 py-1 rounded-full',
                'text-xs font-medium transition-all duration-200',
                size === sizeOption
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted/50',
                'capitalize',
                'hover:scale-105'
              )}
              aria-label={sizeOption}
              aria-pressed={size === sizeOption}
            >
              {sizeOption === 'compact' && 'Compact'}
              {sizeOption === 'comfortable' && 'Normal'}
              {sizeOption === 'spacious' && 'Spacious'}
            </button>
          ))}
        </div>
      </div>

      {/* Reset button */}
      <button
        onClick={() => {
          onColumnsChange(DEFAULT_PREFERENCES.columns);
          setSize(DEFAULT_PREFERENCES.size);
          savePreferences(DEFAULT_PREFERENCES);
        }}
        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        Reset
      </button>
    </GlassCard>
  );
}

function savePreferences(preferences: GridPreferences) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch {
    // Ignore localStorage errors
  }
}
