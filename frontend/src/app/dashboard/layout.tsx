/**
 * Dashboard layout with NotificationManager and ChatSidebar.
 *
 * [Task]: T056
 * [From]: specs/008-advanced-features/tasks.md (User Story 2)
 * [Updated]: specs/012-ui-redesign/tasks.md - T-028
 *
 * This layout:
 * - Wraps dashboard page with NotificationManager
 * - Enables browser notifications for task reminders
 * - Adds persistent ChatSidebar for AI assistant
 * - Runs on client-side for notification permission and polling
 */

'use client';

import { NotificationManager } from '@/components/tasks/NotificationManager';
import { SidebarChat } from '@/components/chat/SidebarChat';
import { useSession } from '@/lib/hooks';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated } = useSession();

  return (
    <>
      {/* Main content */}
      <div className={isAuthenticated ? 'md:ml-[316px]' : ''}>
        {children}
      </div>

      {/* Notification Manager */}
      <NotificationManager enabled={true} pollInterval={60000} />

      {/* AI Chat Sidebar */}
      {isAuthenticated && user && (
        <SidebarChat
          userId={user.id}
          defaultExpanded={false}
        />
      )}
    </>
  );
}
