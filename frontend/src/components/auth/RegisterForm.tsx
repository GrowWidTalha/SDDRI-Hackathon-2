/**
 * Registration form component (client component).
 *
 * [Task]: T023, T075
 * [From]: specs/001-user-auth/plan.md, specs/005-ux-improvement/tasks.md
 * [Updated]: specs/012-ui-redesign/tasks.md - T-024
 *
 * Redesigned with multi-step card approach:
 * - Step 1: Email + name
 * - Step 2: Password + confirm
 * - GlassCard styling with MultiStepForm wrapper
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import type { SignUpRequest } from '@/types/auth';
import { MultiStepForm, type FormStep } from '@/components/design-system';
import { toast } from 'sonner';

const registerSteps: FormStep[] = [
  {
    id: 'info',
    title: 'Create your account',
    description: 'Enter your details to get started',
    fields: [
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'you@example.com',
        required: true,
        validation: (value: string) => {
          const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!pattern.test(value)) {
            return 'Invalid email format';
          }
        },
      },
      {
        name: 'full_name',
        label: 'Full Name',
        type: 'text',
        placeholder: 'John Doe',
        required: true,
        validation: (value: string) => {
          if (value.length < 2) {
            return 'Name must be at least 2 characters';
          }
        },
      },
    ],
  },
  {
    id: 'password',
    title: 'Choose a password',
    description: 'Create a secure password for your account',
    fields: [
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        placeholder: 'Min 8 characters',
        required: true,
        validation: (value: string) => {
          if (value.length < 8) {
            return 'Password must be at least 8 characters';
          }
        },
      },
      {
        name: 'confirmPassword',
        label: 'Confirm Password',
        type: 'password',
        placeholder: 'Re-enter password',
        required: true,
        validation: (value: string, allData: Record<string, any>) => {
          if (value !== allData.password) {
            return 'Passwords do not match';
          }
        },
      },
    ],
  },
];

export function RegisterForm() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (data: Record<string, any>) => {
    const signUpData: SignUpRequest = {
      email: data.email,
      password: data.password,
      full_name: data.full_name,
    };

    try {
      await apiClient.signUp(signUpData);
      setSuccess(true);
      toast.success('Account created successfully!');

      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message.includes('already registered')) {
          toast.error('Email already registered');
        } else if (err.message.includes('Invalid email format')) {
          toast.error('Invalid email format');
        } else if (err.message.includes('Password must be at least')) {
          toast.error(err.message);
        } else {
          toast.error('Failed to create account. Please try again.');
        }
      } else {
        toast.error('An unexpected error occurred');
      }
      throw err; // Re-throw to keep form on current step
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Account Created!
          </h2>
          <p className="text-muted-foreground">
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <MultiStepForm
        steps={registerSteps}
        onSubmit={handleSubmit}
        submitLabel="Create Account"
      />
    </div>
  );
}
