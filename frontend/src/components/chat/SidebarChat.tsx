/**
 * SidebarChat Component
 * [From]: specs/012-ui-redesign/tasks.md - T-027
 *
 * Integrates TaskChat into ChatSidebar:
 * - TaskChat fills sidebar content
 * - No duplicate headers
 * - Chat functionality maintained
 * - SSE streaming preserved
 */

'use client';

import { ChatSidebar } from './ChatSidebar';
import { TaskChat } from './TaskChat';

export interface SidebarChatProps {
  userId: string;
  initialThreadId?: string;
  defaultExpanded?: boolean;
}

export function SidebarChat({
  userId,
  initialThreadId,
  defaultExpanded = false,
}: SidebarChatProps) {
  return (
    <ChatSidebar defaultExpanded={defaultExpanded}>
      <TaskChat
        userId={userId}
        initialThreadId={initialThreadId}
        className="h-full"
      />
    </ChatSidebar>
  );
}

export default SidebarChat;
