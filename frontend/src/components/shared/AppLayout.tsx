import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-[#f6f7f9] text-[#17202a]">
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="min-w-0 flex-1 px-4 py-4 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
