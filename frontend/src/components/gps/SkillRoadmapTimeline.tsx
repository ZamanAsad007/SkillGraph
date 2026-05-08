import { BookOpen, CheckCircle2, ExternalLink, Hammer, ListChecks } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RoadmapItem {
  skillId: string;
  skillName: string;
  category?: string;
  difficulty: number;
  prerequisites: string[];
  estimatedWeeks: number;
  criticality?: number;
  objective?: string;
  practiceProject?: string;
  milestones?: string[];
  resources?: Array<{
    title: string;
    type: string;
    url?: string;
  }>;
}

interface SkillRoadmapTimelineProps {
  roadmap: RoadmapItem[];
}

function getCriticalityLabel(criticality?: number) {
  if (!criticality) return "Core";
  if (criticality >= 0.85) return "Role-critical";
  if (criticality >= 0.7) return "Important";
  return "Supporting";
}

export function SkillRoadmapTimeline({ roadmap }: SkillRoadmapTimelineProps) {
  if (roadmap.length === 0) {
    return (
      <div className="rounded-lg border border-[#dfe3ea] bg-[#f7f8fa] p-8 text-center">
        <CheckCircle2 className="mx-auto size-8 text-[#1f845a]" />
        <p className="mt-3 text-sm font-medium text-[#17202a]">No skills to learn right now.</p>
        <p className="mt-1 text-sm text-[#626f86]">You already cover the required skills for this role.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {roadmap.map((item, index) => (
        <div key={item.skillId} className="relative">
          {index < roadmap.length - 1 && (
            <div className="absolute left-4 top-12 h-full w-0.5 bg-[#dfe3ea]" />
          )}

          <div className="flex gap-4">
            <div className="relative z-10 flex size-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-[#0c66e4] bg-white">
              <span className="text-xs font-semibold text-[#0c66e4]">{index + 1}</span>
            </div>

            <div className="flex-1 rounded-lg border border-[#dfe3ea] bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-base font-semibold text-[#17202a]">{item.skillName}</h4>
                    {item.category && <Badge variant="secondary">{item.category}</Badge>}
                    <Badge variant="outline">{getCriticalityLabel(item.criticality)}</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#44546f]">
                    {item.objective ?? `Build practical confidence with ${item.skillName}.`}
                  </p>
                </div>

                <div className="grid min-w-32 grid-cols-2 gap-2 text-left lg:text-right">
                  <div>
                    <p className="text-xs font-medium text-[#626f86]">Time</p>
                    <p className="text-sm font-semibold text-[#17202a]">
                      {item.estimatedWeeks} {item.estimatedWeeks === 1 ? "week" : "weeks"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#626f86]">Difficulty</p>
                    <p className="text-sm font-semibold text-[#17202a]">{item.difficulty}/5</p>
                  </div>
                </div>
              </div>

              {item.prerequisites.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#626f86]">Review first</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {item.prerequisites.map((prereq) => (
                      <Badge key={prereq} variant="secondary" className="text-xs">
                        {prereq}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(260px,0.8fr)]">
                <div className="rounded-lg border border-[#dfe3ea] bg-[#f7f8fa] p-3">
                  <div className="flex items-center gap-2">
                    <Hammer className="size-4 text-[#0c66e4]" />
                    <p className="text-sm font-semibold text-[#17202a]">Practice project</p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#44546f]">
                    {item.practiceProject ?? `Create a portfolio artifact using ${item.skillName}.`}
                  </p>
                </div>

                <div className="rounded-lg border border-[#dfe3ea] bg-[#f7f8fa] p-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="size-4 text-[#0c66e4]" />
                    <p className="text-sm font-semibold text-[#17202a]">Resources</p>
                  </div>
                  <div className="mt-2 space-y-2">
                    {(item.resources ?? []).map((resource) => (
                      resource.url ? (
                        <a
                          key={`${item.skillId}-${resource.title}`}
                          href={resource.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between gap-2 rounded-md border border-[#dfe3ea] bg-white px-2 py-1.5 text-sm text-[#17202a] hover:border-[#0c66e4]"
                        >
                          <span className="truncate">{resource.title}</span>
                          <ExternalLink className="size-3.5 text-[#626f86]" />
                        </a>
                      ) : (
                        <div
                          key={`${item.skillId}-${resource.title}`}
                          className="rounded-md border border-[#dfe3ea] bg-white px-2 py-1.5 text-sm text-[#17202a]"
                        >
                          {resource.title}
                        </div>
                      )
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center gap-2">
                  <ListChecks className="size-4 text-[#1f845a]" />
                  <p className="text-sm font-semibold text-[#17202a]">Done when you can</p>
                </div>
                <div className="mt-2 grid gap-2 md:grid-cols-3">
                  {(item.milestones ?? []).map((milestone) => (
                    <div key={milestone} className="rounded-lg border border-[#dfe3ea] bg-white p-3 text-sm leading-5 text-[#44546f]">
                      {milestone}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
