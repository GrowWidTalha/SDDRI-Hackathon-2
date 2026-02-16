/**
 * Login form component (client component).
 *
 * [Task]: T032, T075
 * [From]: specs/001-user-auth/plan.md, specs/005-ux-improvement/tasks.md
 * [Updated]: specs/012-ui-redesign/tasks.md - T-023
 *
 * Redesigned with multi-step card approach:
 * - Step 1: Email
 * - Step 2: Password
 * - GlassCard styling with MultiStepForm wrapper
 */

'use client';

import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import type { SignInRequest } from '@/types/auth';
import { MultiStepForm, type FormStep } from '@/components/design-system';
import { toast } from 'sonner';

const loginSteps: FormStep[] = [
  {
    id: 'email',
    title: 'Welcome back',
    description: 'Enter your email to continue',
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
    ],
  },
  {
    id: 'password',
    title: 'Enter your password',
    description: 'Welcome back! Please enter your password',
    fields: [
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        placeholder: '••••••••',
        required: true,
        validation: (value: string) => {
          if (value.length < 8) {
            return 'Password must be at least 8 characters';
          }
        },
      },
    ],
  },
];

export function LoginForm() {
  const router = useRouter();

  const handleSubmit = async (data: Record<string, any>) => {
    const signInData: SignInRequest = {
      email: data.email,
      password: data.password,
    };

    try {
      await apiClient.signIn(signInData);
      toast.success('Signed in successfully');
      router.push('/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message.includes('Invalid email or password')) {
          toast.error('Invalid email or password');
        } else {
          toast.error('Failed to sign in. Please try again.');
        }
      } else {
        toast.error('An unexpected error occurred');
      }
      throw err; // Re-throw to keep form on current step
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <MultiStepForm
        steps={loginSteps}
        onSubmit={handleSubmit}
        submitLabel="Sign In"
      />
    </div>
  );
}
