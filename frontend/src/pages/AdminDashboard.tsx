import { AdminRoleEditor } from "../components/admin/AdminRoleEditor";
import { IndustryGapChart } from "../components/admin/IndustryGapChart";
import { SkillHeatmap } from "../components/admin/SkillHeatmap";
import { TrendLineChart } from "../components/admin/TrendLineChart";

export function AdminDashboard() {
  return (
    <section className="mx-auto grid w-full max-w-[1400px] gap-4 pb-20 lg:pb-4">
      <header className="rounded-lg border border-[#dfe3ea] bg-white px-4 py-3 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#626f86]">Admin</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#17202a]">Skill intelligence</h1>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        <SkillHeatmap />
        <IndustryGapChart />
        <TrendLineChart />
        <AdminRoleEditor />
      </div>
    </section>
  );
}
