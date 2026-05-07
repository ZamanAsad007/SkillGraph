import { CandidateCard } from "../components/matchmaker/CandidateCard";
import { ProjectSkillPicker } from "../components/matchmaker/ProjectSkillPicker";
import { TeamCompositionPanel } from "../components/matchmaker/TeamCompositionPanel";

export function Matchmaker() {
  return (
    <section className="grid gap-4 lg:grid-cols-[1fr_280px]">
      <div className="grid gap-4">
        <ProjectSkillPicker />
        <CandidateCard />
      </div>
      <TeamCompositionPanel />
    </section>
  );
}
