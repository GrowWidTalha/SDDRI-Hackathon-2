/**
 * MultiStepForm Component
 * [From]: specs/012-ui-redesign/tasks.md - T-022
 *
 * Multi-step form wrapper with:
 * - Step array prop with validation
 * - Progress indicator
 * - Next/Back navigation
 * - Slide animation between steps
 * - Data accumulation across steps
 */

'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/design-system';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'date' | 'select' | 'textarea' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  validation?: (value: any, allData?: Record<string, any>) => string | undefined;
}

export interface FormStep {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
}

export interface MultiStepFormProps {
  steps: FormStep[];
  onSubmit: (data: Record<string, any>) => void | Promise<void>;
  submitLabel?: string;
  className?: string;
  initialData?: Record<string, any>;
}

export function MultiStepForm({
  steps,
  onSubmit,
  submitLabel = 'Submit',
  className,
  initialData = {},
}: MultiStepFormProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  // Validate current step fields
  const validateStep = useCallback((stepIndex: number, data: Record<string, any>): boolean => {
    const step = steps[stepIndex];
    const errors: Record<string, string> = {};

    for (const field of step.fields) {
      const value = data[field.name];

      // Required validation
      if (field.required && !value) {
        errors[field.name] = `${field.label} is required`;
        continue;
      }

      // Custom validation
      if (field.validation && value) {
        const error = field.validation(value, data);
        if (error) {
          errors[field.name] = error;
        }
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [steps]);

  // Handle field change
  const handleFieldChange = useCallback((fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    // Clear error for this field
    if (fieldErrors[fieldName]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  }, [fieldErrors]);

  // Handle next step
  const handleNext = useCallback(async () => {
    if (!validateStep(currentStepIndex, formData)) {
      return;
    }

    if (isLastStep) {
      // Submit form
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  }, [currentStepIndex, formData, isLastStep, onSubmit, validateStep]);

  // Handle previous step
  const handlePrevious = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex]);

  // Handle step click (jump to step)
  const handleStepClick = useCallback((stepIndex: number) => {
    // Only allow going to previous steps or next step if current is valid
    if (stepIndex < currentStepIndex) {
      setCurrentStepIndex(stepIndex);
    } else if (stepIndex === currentStepIndex + 1) {
      handleNext();
    }
  }, [currentStepIndex, handleNext]);

  return (
    <GlassCard
      blur="md"
      border
      className={cn(
        'w-full max-w-md',
        'transition-all duration-300',
        className
      )}
    >
      {/* Progress indicator */}
      <div className="px-6 pt-6">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const isClickable = isCompleted || (isCurrent && validateStep(currentStepIndex, formData));

            return (
              <button
                key={step.id}
                onClick={() => isClickable && handleStepClick(index)}
                disabled={!isClickable}
                className={cn(
                  'flex items-center justify-center',
                  'w-8 h-8 rounded-full text-sm font-medium transition-all duration-200',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  isCompleted && 'bg-primary text-primary-foreground',
                  isCurrent && 'bg-primary text-primary-foreground scale-110',
                  !isCompleted && !isCurrent && 'bg-muted text-muted-foreground'
                )}
                aria-label={`Go to step ${index + 1}`}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
              </button>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="px-6 py-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            {currentStep.title}
          </h2>
          {currentStep.description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {currentStep.description}
            </p>
          )}
        </div>

        {/* Slide animation container */}
        <div
          className="transition-transform duration-300 ease-out"
          style={{
            transform: `translateX(-${currentStepIndex * 100}%)`,
          }}
        >
          <div className="flex" style={{ width: `${steps.length * 100}%` }}>
            {steps.map((step) => (
              <div
                key={step.id}
                className="flex-shrink-0 w-full"
                style={{ width: `${100 / steps.length}%` }}
              >
                {step.fields.map((field) => (
                  <div key={field.name} className="mb-4">
                    <label
                      htmlFor={field.name}
                      className="block text-sm font-medium text-foreground mb-1.5"
                    >
                      {field.label}
                      {field.required && <span className="text-destructive ml-1">*</span>}
                    </label>

                    {field.type === 'textarea' ? (
                      <textarea
                        id={field.name}
                        value={formData[field.name] || ''}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        className={cn(
                          'w-full px-3 py-2 rounded-lg',
                          'bg-background/50 border border-glass-border',
                          'text-foreground placeholder:text-muted-foreground',
                          'focus:outline-none focus:ring-2 focus:ring-primary/50',
                          'transition-all duration-200'
                        )}
                        rows={3}
                      />
                    ) : field.type === 'select' ? (
                      <select
                        id={field.name}
                        value={formData[field.name] || ''}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        className={cn(
                          'w-full px-3 py-2 rounded-lg',
                          'bg-background/50 border border-glass-border',
                          'text-foreground',
                          'focus:outline-none focus:ring-2 focus:ring-primary/50',
                          'transition-all duration-200'
                        )}
                      >
                        <option value="">{field.placeholder || 'Select...'}</option>
                        {field.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : field.type === 'checkbox' ? (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          id={field.name}
                          checked={formData[field.name] || false}
                          onChange={(e) => handleFieldChange(field.name, e.target.checked)}
                          className="w-4 h-4 rounded border-glass-border"
                        />
                        <span className="text-sm text-foreground">
                          {field.placeholder}
                        </span>
                      </label>
                    ) : (
                      <input
                        type={field.type}
                        id={field.name}
                        value={formData[field.name] || ''}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        className={cn(
                          'w-full px-3 py-2 rounded-lg',
                          'bg-background/50 border border-glass-border',
                          'text-foreground placeholder:text-muted-foreground',
                          'focus:outline-none focus:ring-2 focus:ring-primary/50',
                          'transition-all duration-200'
                        )}
                      />
                    )}

                    {fieldErrors[field.name] && (
                      <p className="mt-1 text-xs text-destructive">
                        {fieldErrors[field.name]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-6 pb-6 flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStepIndex === 0}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg',
            'text-sm font-medium transition-all duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            currentStepIndex === 0
              ? 'text-muted-foreground'
              : 'text-foreground hover:bg-muted/50'
          )}
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <button
          onClick={handleNext}
          disabled={isSubmitting}
          className={cn(
            'flex items-center gap-2 px-6 py-2 rounded-lg',
            'bg-primary text-primary-foreground',
            'text-sm font-medium',
            'hover:bg-primary/90 active:scale-95',
            'transition-all duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {isSubmitting ? (
            'Submitting...'
          ) : isLastStep ? (
            submitLabel
          ) : (
            <>
              Next
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </GlassCard>
  );
}
