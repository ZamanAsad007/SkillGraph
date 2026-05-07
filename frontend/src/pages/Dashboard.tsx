import { SkillGalaxy } from "../components/galaxy/SkillGalaxy";
import { SkillDetailPanel } from "../components/galaxy/SkillDetailPanel";

export function Dashboard() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
      <SkillGalaxy />
      <SkillDetailPanel />
    </div>
  );
}
