/**
 * TaskForm component (client component).
 *
 * [From]: specs/003-frontend-task-manager/
 * [Updated]: specs/012-ui-redesign/tasks.md - T-025
 *
 * Redesigned with multi-step card approach:
 * - Step 1: Title + description + tags
 * - Step 2: Due date + priority + reminder
 * - Step 3: Recurrence settings
 * - GlassCard styling with MultiStepForm wrapper
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { Task, TaskFormData, TaskPriority } from '@/types/task';
import { taskFormSchema } from '@/lib/schemas/forms';
import { taskApi } from '@/lib/task-api';
import { MultiStepForm, type FormStep } from '@/components/design-system';
import { cn } from '@/lib/utils';
import { DueDateField } from '@/components/tasks/DueDateField';
import { ReminderOffsetSelector } from '@/components/tasks/ReminderOffsetSelector';
import { RecurrencePicker } from '@/components/tasks/RecurrencePicker';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
  mode: 'create' | 'edit';
  onTaskCreated?: (newTask: Task) => void;
  onTaskUpdated?: (updatedTask: Task) => void;
}

// Helper function to create form steps
function createFormSteps(task?: Task): FormStep[] {
  return [
    {
      id: 'basic',
      title: 'Task Details',
      description: 'What do you need to accomplish?',
      fields: [
        {
          name: 'title',
          label: 'Title',
          type: 'text',
          placeholder: 'Enter task title',
          required: true,
          validation: (value: string) => {
            if (!value || value.trim().length < 1) {
              return 'Title is required';
            }
            if (value.length > 200) {
              return 'Title must be less than 200 characters';
            }
          },
        },
        {
          name: 'description',
          label: 'Description',
          type: 'textarea',
          placeholder: 'Add more details about this task (optional)',
        },
        {
          name: 'tags',
          label: 'Tags',
          type: 'text',
          placeholder: 'work, urgent, project (comma-separated)',
          validation: (value: string) => {
            if (value && value.length > 500) {
              return 'Tags too long';
            }
          },
        },
      ],
    },
    {
      id: 'scheduling',
      title: 'Schedule & Priority',
      description: 'When is this task due?',
      fields: [
        {
          name: 'priority',
          label: 'Priority',
          type: 'select',
          options: [
            { label: 'Low', value: 'LOW' },
            { label: 'Medium', value: 'MEDIUM' },
            { label: 'High', value: 'HIGH' },
          ],
        },
        // Due date is handled separately in custom rendering
        {
          name: 'due_date_placeholder',
          label: 'Due Date',
          type: 'text',
          placeholder: 'Selected in date picker',
        },
      ],
    },
    {
      id: 'advanced',
      title: 'Reminder & Recurrence',
      description: 'Set up reminders and recurring tasks',
      fields: [
        {
          name: 'reminder_offset_placeholder',
          label: 'Reminder',
          type: 'text',
          placeholder: 'Choose when to be reminded',
        },
        {
          name: 'recurrence_placeholder',
          label: 'Recurrence',
          type: 'text',
          placeholder: 'Repeat this task (optional)',
        },
      ],
    },
  ];
}

export function TaskForm({
  isOpen,
  onClose,
  task,
  mode,
  onTaskCreated,
  onTaskUpdated,
}: TaskFormProps) {
  const router = useRouter();
  const [initialData, setInitialData] = useState<Record<string, any>>({});
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    due_date: null,
    priority: 'MEDIUM' as TaskPriority,
    tags: [],
    reminder_offset: null,
    recurrence: null,
  });

  const formSteps = createFormSteps(task);

  // Initialize form data when opening or task changes
  useEffect(() => {
    if (isOpen && mode === 'create' && !task) {
      const newFormData: TaskFormData = {
        title: '',
        description: '',
        due_date: null,
        priority: 'MEDIUM',
        tags: [],
        reminder_offset: null,
        recurrence: null,
      };
      setFormData(newFormData);
      setInitialData({
        title: '',
        description: '',
        priority: 'MEDIUM',
        tags: '',
        due_date_placeholder: '',
        reminder_offset_placeholder: '',
        recurrence_placeholder: '',
      });
      setCurrentStepIndex(0);
    } else if (isOpen && task) {
      const newFormData: TaskFormData = {
        title: task.title,
        description: task.description || '',
        due_date: task.due_date || null,
        priority: task.priority as TaskPriority,
        tags: task.tags || [],
        reminder_offset: task.reminder_offset ?? null,
        recurrence: task.recurrence ?? null,
      };
      setFormData(newFormData);
      setInitialData({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        tags: task.tags?.join(', ') || '',
        due_date_placeholder: task.due_date ? new Date(task.due_date).toLocaleDateString() : '',
        reminder_offset_placeholder: task.reminder_offset ? `${task.reminder_offset} min before` : '',
        recurrence_placeholder: task.recurrence || '',
      });
      setCurrentStepIndex(0);
    }
  }, [isOpen, task, mode]);

  const handleSubmit = async (data: Record<string, any>) => {
    // Parse tags from comma-separated string
    const parsedTags = typeof data.tags === 'string'
      ? data.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0)
      : data.tags || [];

    const submitData: TaskFormData = {
      title: data.title,
      description: data.description || '',
      due_date: formData.due_date,
      priority: data.priority as TaskPriority,
      tags: parsedTags,
      reminder_offset: formData.reminder_offset,
      recurrence: formData.recurrence,
    };

    // Validate with Zod schema
    try {
      taskFormSchema.parse(submitData);
    } catch (err: any) {
      if (err?.errors) {
        const error = err.errors[0];
        toast.error(error?.message || 'Validation failed');
        throw new Error(error?.message || 'Validation failed');
      }
    }

    if (mode === 'create') {
      try {
        const newTask = await taskApi.createTask(submitData);
        toast.success('Task created successfully');
        onTaskCreated?.(newTask);
        handleClose();
        setTimeout(() => router.refresh(), 150);
      } catch (error: any) {
        toast.error(error?.message || 'Failed to create task');
        throw error;
      }
    } else {
      try {
        const updated = await taskApi.updateTask(task!.id, submitData);
        toast.success('Task updated successfully');
        onTaskUpdated?.(updated);
        handleClose();
        router.refresh();
      } catch (error: any) {
        toast.error(error?.message || 'Failed to update task');
        throw error;
      }
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      due_date: null,
      priority: 'MEDIUM',
      tags: [],
      reminder_offset: null,
      recurrence: null,
    });
    setInitialData({});
    setCurrentStepIndex(0);
    onClose();
  };

  // Custom field renderer for special fields
  const renderCustomField = (field: any, stepIndex: number) => {
    // Due date picker
    if (field.name === 'due_date_placeholder') {
      return (
        <div key={field.name} className="mb-4">
          <label className="block text-sm font-medium text-foreground mb-1.5">
            {field.label}
          </label>
          <DueDateField
            value={formData.due_date}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, due_date: value }))
            }
          />
        </div>
      );
    }

    // Reminder offset selector
    if (field.name === 'reminder_offset_placeholder') {
      return (
        <div key={field.name} className="mb-4">
          <label className="block text-sm font-medium text-foreground mb-1.5">
            {field.label}
          </label>
          <ReminderOffsetSelector
            value={formData.reminder_offset}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, reminder_offset: value }))
            }
          />
        </div>
      );
    }

    // Recurrence picker
    if (field.name === 'recurrence_placeholder') {
      return (
        <div key={field.name} className="mb-4">
          <label className="block text-sm font-medium text-foreground mb-1.5">
            {field.label}
          </label>
          <RecurrencePicker
            value={formData.recurrence}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, recurrence: value }))
            }
          />
        </div>
      );
    }

    return null;
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl mx-4">
        <MultiStepForm
          steps={formSteps}
          onSubmit={handleSubmit}
          submitLabel={mode === 'create' ? 'Create Task' : 'Save Changes'}
          initialData={initialData}
          className="max-h-[90vh] overflow-y-auto"
        />
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close form"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
