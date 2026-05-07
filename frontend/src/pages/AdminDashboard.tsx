import { AdminRoleEditor } from "../components/admin/AdminRoleEditor";
import { IndustryGapChart } from "../components/admin/IndustryGapChart";
import { SkillHeatmap } from "../components/admin/SkillHeatmap";
import { TrendLineChart } from "../components/admin/TrendLineChart";

export function AdminDashboard() {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      <SkillHeatmap />
      <IndustryGapChart />
      <TrendLineChart />
      <AdminRoleEditor />
    </section>
  );
}
