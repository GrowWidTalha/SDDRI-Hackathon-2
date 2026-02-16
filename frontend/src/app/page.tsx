/**
 * Landing Page
 * [From]: specs/012-ui-redesign/tasks.md - T-015, T-016
 *
 * Story-driven landing page with all sections combined:
 * - Hero section at top
 * - Story sections with narrative
 * - Feature grid in middle
 * - CTA section at bottom
 * - Smart redirect for authenticated users
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { HeroSection } from '@/components/landing/HeroSection';
import { ProblemStorySection, SolutionStorySection } from '@/components/landing/StorySection';
import { FeatureSection } from '@/components/landing/FeatureSection';
import { CTASection } from '@/components/landing/CTASection';
import { authClient } from '@/lib/auth-client';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function LandingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await authClient.getSession();
        if (data) {
          // User is authenticated, redirect to dashboard
          router.push('/dashboard');
          return;
        }
        setIsAuthenticated(false);
      } catch {
        // Error checking auth, assume not authenticated
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If authenticated, redirect will happen (empty return is fine)
  if (isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection />

      {/* Problem Story Section */}
      <ProblemStorySection />

      {/* Feature Grid */}
      <FeatureSection />

      {/* Solution Story Section */}
      <SolutionStorySection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-glass-border">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2024 Todo List App. Built with love for productivity.</p>
        </div>
      </footer>
    </main>
  );
}
