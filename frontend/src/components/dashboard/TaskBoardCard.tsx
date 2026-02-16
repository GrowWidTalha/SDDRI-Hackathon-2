/**
 * TaskBoardCard Component
 * [From]: specs/012-ui-redesign/tasks.md - T-017
 *
 * Square board-style task card with 1:1 aspect ratio, glassmorphism styling,
 * hover-revealed quick actions, urgency border, and priority badge.
 */

'use client';

import { useState } from 'react';
import { Check, Clock, Calendar, Tag, Trash2, Edit2 } from 'lucide-react';
import type { Task } from '@/types/task';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/design-system';
import { PriorityBadge } from '@/components/tasks/PriorityBadge';
import { DueDateBadge } from '@/components/tasks/DueDateBadge';
import { RecurrenceBadge } from '@/components/tasks/RecurrenceBadge';
import { TagBadgeGroup } from '@/components/tasks/TagBadge';
import { formatRelativeDate } from '@/lib/utils';

export interface TaskBoardCardProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onClick?: (task: Task) => void;
}

export function TaskBoardCard({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  onClick,
}: TaskBoardCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const urgencyBorderColor = {
    overdue: 'border-l-urgency-overdue',
    'due-today': 'border-l-urgency-due-today',
    'due-soon': 'border-l-urgency-due-soon',
    'due-later': 'border-l-urgency-due-later',
    none: '',
  }[task.urgency || 'none'];

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleComplete(task.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(task);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(task.id);
  };

  const handleCardClick = () => {
    onClick?.(task);
  };

  return (
    <GlassCard
      blur="md"
      border
      hover={!!onClick}
      shadow="sm"
      className={cn(
        // Square aspect ratio container
        'relative aspect-square',
        'p-5',
        'group cursor-pointer',
        // Urgency border accent (left side)
        'border-l-4',
        urgencyBorderColor,
        // Completed state
        task.completed && 'opacity-60',
        // Transition
        'transition-all duration-250 ease-out'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Checkbox - top left */}
      <button
        onClick={handleCheckboxClick}
        className={cn(
          'absolute top-4 left-4 z-10',
          'flex-shrink-0 w-6 h-6 rounded-md',
          'border-2 flex items-center justify-center',
          'transition-all duration-200',
          'bg-background/50 backdrop-blur-sm',
          task.completed
            ? 'bg-primary border-primary text-primary-foreground'
            : 'border-muted-foreground/40 hover:border-primary hover:bg-primary/10',
          'hover:scale-110'
        )}
        aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {task.completed && <Check className="w-4 h-4" strokeWidth={3} />}
      </button>

      {/* Quick actions - top right, visible on hover */}
      <div
        className={cn(
          'absolute top-4 right-4 z-10',
          'flex items-center gap-1',
          'opacity-0 group-hover:opacity-100',
          'transition-opacity duration-200'
        )}
      >
        <button
          onClick={handleEdit}
          className="p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Edit task"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={handleDelete}
          className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
          aria-label="Delete task"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Card Content */}
      <div className="flex flex-col h-full">
        {/* Title - with truncation */}
        <h3
          className={cn(
            'text-base font-semibold text-foreground leading-snug',
            'line-clamp-3',
            'transition-colors duration-200',
            task.completed && 'line-through text-muted-foreground',
            'mb-2'
          )}
        >
          {task.title}
        </h3>

        {/* Description - if exists, with truncation */}
        {task.description && (
          <p
            className={cn(
              'text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-1',
              'transition-colors duration-200',
              task.completed && 'line-through text-muted-foreground/60'
            )}
          >
            {task.description}
          </p>
        )}

        {/* Spacer to push meta to bottom */}
        <div className="flex-1" />

        {/* Meta info badges */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3">
          <PriorityBadge priority={task.priority} />
          <DueDateBadge
            dueDate={task.due_date}
            urgency={task.urgency}
            task={task}
          />
          <RecurrenceBadge recurrence={task.recurrence} />
          {task.tags && task.tags.length > 0 && (
            <TagBadgeGroup tags={task.tags} maxShown={2} />
          )}
          <div className="flex items-center gap-1 text-xs text-muted-foreground/70 ml-auto">
            <Calendar className="h-3 w-3" />
            {formatRelativeDate(task.created_at)}
          </div>
        </div>
      </div>

      {/* Priority badge overlay - bottom right */}
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="glass px-2 py-1 rounded-full text-xs font-medium text-primary">
          {task.priority}
        </div>
      </div>
    </GlassCard>
  );
}

/**
 * TaskBoardCardSkeleton - Loading state
 */
export function TaskBoardCardSkeleton() {
  return (
    <div className="aspect-square p-5 border border-glass-border rounded-xl bg-card/30 animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="w-6 h-6 rounded-md bg-muted/50" />
        <div className="w-20 h-6 rounded-full bg-muted/50" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-muted/50 rounded w-3/4" />
        <div className="h-3 bg-muted/30 rounded w-1/2" />
      </div>
      <div className="space-y-2 mt-auto">
        <div className="h-6 w-16 rounded-full bg-muted/30" />
        <div className="h-6 w-24 rounded-full bg-muted/30" />
      </div>
    </div>
  );
}
