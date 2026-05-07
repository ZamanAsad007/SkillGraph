import type { LucideIcon } from "lucide-react";

export function NotificationBell({ icon: Icon }: { icon: LucideIcon }) {
  return <button className="rounded p-2 hover:bg-slate-100" aria-label="Notifications"><Icon size={18} /></button>;
}
