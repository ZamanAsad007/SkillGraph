import { Bell } from "lucide-react";
import { NotificationBell } from "../notifications/NotificationBell";

export function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <div className="font-semibold">SkillGraph</div>
        <NotificationBell icon={Bell} />
      </div>
    </header>
  );
}
