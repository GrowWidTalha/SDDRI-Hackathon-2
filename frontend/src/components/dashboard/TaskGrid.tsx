/**
 * TaskGrid Component
 * [From]: specs/012-ui-redesign/tasks.md - T-018
 *
 * Grid container for task board cards with responsive columns (1-4),
 * CSS Grid layout, gap spacing, empty state illustration, and
 * drag-and-drop preparation.
 */

'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';
import type { Task } from '@/types/task';
import { TaskBoardCard, TaskBoardCardSkeleton } from './TaskBoardCard';
import { Illustration } from '@/components/design-system';
import { cn } from '@/lib/utils';

export interface TaskGridProps {
  tasks: Task[];
  loading?: boolean;
  columns?: 1 | 2 | 3 | 4;
  onTaskClick?: (task: Task) => void;
  onTaskEdit?: (task: Task) => void;
  onTaskDelete?: (taskId: string) => void;
  onTaskToggleComplete?: (taskId: string) => void;
  onReorder?: (tasks: Task[]) => void;
  sortable?: boolean;
}

const DEFAULT_COLUMNS = 3;
const ITEMS_PER_ROW = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
} as const;

export function TaskGrid({
  tasks,
  loading = false,
  columns: columnsProp,
  onTaskClick,
  onTaskEdit,
  onTaskDelete,
  onTaskToggleComplete,
  onReorder,
  sortable = false,
}: TaskGridProps) {
  const router = useRouter();
  const [columns, setColumns] = useState(columnsProp ?? DEFAULT_COLUMNS);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  // Keyboard navigation handler
  const handleKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
    if (tasks.length === 0) return;

    let newIndex = index;

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        newIndex = Math.min(index + 1, tasks.length - 1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = Math.max(index - 1, 0);
        break;
      case 'ArrowDown':
        e.preventDefault();
        newIndex = Math.min(index + columns, tasks.length - 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        newIndex = Math.max(index - columns, 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex !== null && tasks[focusedIndex]) {
          handleClick(tasks[focusedIndex]);
        }
        return;
      case 'Escape':
        e.preventDefault();
        setFocusedIndex(null);
        return;
      default:
        return;
    }

    if (newIndex !== index) {
      setFocusedIndex(newIndex);
      // Focus the new card
      const cardElement = document.querySelector(`[data-task-index="${newIndex}"]`) as HTMLElement;
      cardElement?.focus();
    }
  }, [tasks, columns, focusedIndex]);

  const handleToggleComplete = (taskId: string) => {
    onTaskToggleComplete?.(taskId);
  };

  const handleEdit = (task: Task) => {
    onTaskEdit?.(task);
  };

  const handleDelete = (taskId: string) => {
    onTaskDelete?.(taskId);
  };

  const handleClick = (task: Task) => {
    if (onTaskClick) {
      onTaskClick(task);
    } else {
      // Default: navigate to task detail (if we had one)
      router.push(`/tasks/${task.id}`);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className={cn(
        'grid gap-4',
        ITEMS_PER_ROW[columns],
        'min-h-[400px]'
      )}>
        {Array.from({ length: 6 }).map((_, i) => (
          <TaskBoardCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Empty state
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 min-h-[400px]">
        <Illustration type="no-tasks" size="lg" />
        <h3 className="mt-6 text-xl font-semibold text-foreground">
          No tasks yet
        </h3>
        <p className="mt-2 text-muted-foreground">
          Create your first task to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6" role="grid" aria-label="Task grid">
      {/* Grid */}
      <div
        className={cn(
          'grid gap-4',
          ITEMS_PER_ROW[columns],
          // Animate grid items in
          'animate-grid-in'
        )}
      >
        {tasks.map((task, index) => (
          <div
            key={task.id}
            data-task-index={index}
            tabIndex={focusedIndex === index ? 0 : -1}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onFocus={() => setFocusedIndex(index)}
            role="gridcell"
          >
            <TaskBoardCard
              task={task}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onClick={handleClick}
            />
          </div>
        ))}
      </div>

      {/* Grid customization (if sortable) */}
      {sortable && (
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <span>Grid view: {columns} columns</span>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((col) => (
              <button
                key={col}
                onClick={() => setColumns(col as 1 | 2 | 3 | 4)}
                className={cn(
                  'w-8 h-8 rounded-md',
                  'flex items-center justify-center',
                  'transition-all duration-200',
                  columns === col
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 hover:bg-muted',
                  'font-medium'
                )}
                aria-label={`Show ${col} columns`}
              >
                {col}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Grid animation styles
 */
const gridStyles = `
  @keyframes gridIn {
    from {
      opacity: 0;
      transform: translateY(10px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .animate-grid-in > * {
    animation: gridIn 0.3s ease-out backwards;
  }

  /* Stagger animations */
  .animate-grid-in > *:nth-child(1) { animation-delay: 0ms; }
  .animate-grid-in > *:nth-child(2) { animation-delay: 50ms; }
  .animate-grid-in > *:nth-child(3) { animation-delay: 100ms; }
  .animate-grid-in > *:nth-child(4) { animation-delay: 150ms; }
  .animate-grid-in > *:nth-child(5) { animation-delay: 200ms; }
  .animate-grid-in > *:nth-child(6) { animation-delay: 250ms; }
  .animate-grid-in > *:nth-child(n+7) { animation-delay: 300ms; }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = gridStyles;
  document.head.appendChild(styleSheet);
}
