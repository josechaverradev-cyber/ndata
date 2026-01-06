import { AdminSidebarContent } from "./AdminSidebarContent";

export function AdminSidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-sidebar-border lg:block">
      <AdminSidebarContent />
    </aside>
  );
}
