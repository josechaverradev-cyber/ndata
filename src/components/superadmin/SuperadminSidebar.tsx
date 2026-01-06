import { SuperadminSidebarContent } from "./SuperadminSidebarContent";

export function SuperadminSidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-sidebar-border lg:block">
      <SuperadminSidebarContent />
    </aside>
  );
}
