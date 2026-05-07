import { GPSProgressRing } from "../components/gps/GPSProgressRing";
import { MissingSkillCard } from "../components/gps/MissingSkillCard";
import { RoleSelector } from "../components/gps/RoleSelector";
import { SkillRoadmapTimeline } from "../components/gps/SkillRoadmapTimeline";

export function CareerGPS() {
  return (
    <section className="grid gap-4">
      <div className="flex items-center justify-between">
        <RoleSelector />
        <GPSProgressRing />
      </div>
      <MissingSkillCard label="React" />
      <SkillRoadmapTimeline />
    </section>
  );
}
