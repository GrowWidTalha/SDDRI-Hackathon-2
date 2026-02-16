/* Dashboard page - Grid-based task management with glassmorphism UI.

[Task]: T017-T020, T072
[From]: specs/005-ux-improvement/tasks.md
[Updated]: specs/012-ui-redesign/tasks.md - T-017, T-018, T-020, T-021

This page:
- Displays tasks in a responsive grid layout
- Uses server-side data fetching for initial load
- Features glassmorphism design with Deep Rich Dark theme
- Square board-style task cards with hover actions
- Grid customization controls
- Floating dock navigation
*/
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TaskGrid } from '@/components/dashboard/TaskGrid';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { GridControls } from '@/components/dashboard/GridControls';
import { FloatingDock } from '@/components/design-system';
import { taskApi } from '@/lib/task-api';
import { getTaskUrgency } from '@/lib/utils';
import type { Task } from '@/types/task';

const ITEMS_PER_PAGE = 50;

type GridColumns = 1 | 2 | 3 | 4;

export default function DashboardPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState<GridColumns>(3);

  // Fetch tasks on mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        const response = await taskApi.listTasks({
          limit: ITEMS_PER_PAGE,
          offset: 0,
        });

        if (response?.tasks) {
          // Add computed urgency to each task
          const tasksWithUrgency = response.tasks.map((task: Task) => ({
            ...task,
            urgency: getTaskUrgency(task.due_date),
          })) as Task[];
          setTasks(tasksWithUrgency);
        }
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  const handleTaskToggleComplete = async (taskId: string) => {
    // Toggle complete locally for optimistic update
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );

    // Then call API
    try {
      const updated = await fetch(`/api/tasks/${taskId}/toggle`, {
        method: 'POST',
      });
      // Update with server response
    } catch (error) {
      // Revert on error
      setTasks(prev =>
        prev.map(task =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      );
    }
  };

  const handleTaskEdit = (task: Task) => {
    // Open edit dialog or navigate to edit page
    router.push(`/tasks/${task.id}/edit`);
  };

  const handleTaskDelete = async (taskId: string) => {
    // Optimistically remove from list
    setTasks(prev => prev.filter(task => task.id !== taskId));

    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      // Server returns success
      // Refresh the task list
      const response = await taskApi.listTasks({
        limit: ITEMS_PER_PAGE,
        offset: 0,
      });
      if (response?.tasks) {
        setTasks(response.tasks.map((task: Task) => ({
          ...task,
          urgency: getTaskUrgency(task.due_date),
        })) as Task[]);
      }
    } catch (error) {
      // Revert on error
      console.error('Failed to delete task:', error);
    }
  };

  const handleTaskClick = (task: Task) => {
    // Navigate to task detail
    router.push(`/tasks/${task.id}`);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <DashboardHeader />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Grid controls */}
        <div className="mb-6">
          <GridControls
            columns={columns}
            onColumnsChange={setColumns}
          />
        </div>

        {/* Task Grid */}
        <TaskGrid
          tasks={tasks}
          loading={loading}
          columns={columns}
          onTaskClick={handleTaskClick}
          onTaskEdit={handleTaskEdit}
          onTaskDelete={handleTaskDelete}
          onTaskToggleComplete={handleTaskToggleComplete}
          sortable={false}
        />
      </main>

      {/* Floating Dock Navigation */}
      <FloatingDock
        showOnScroll={true}
        includeThemeToggle={true}
      />
    </div>
  );
}
