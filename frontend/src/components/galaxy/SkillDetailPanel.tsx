import type { GalaxyNode } from "../../services/graph.service";
import { Badge } from "@/components/ui/badge";

interface SkillDetailPanelProps {
  node: GalaxyNode | null;
}

export function SkillDetailPanel({ node }: SkillDetailPanelProps) {
  if (!node) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-[#787774]">
          Select a skill to view details
        </p>
      </div>
    );
  }

  // Check if it's a skill node (has proficiency) or repository node
  const isSkill = "proficiency" in node;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-[#37352f]">
          {node.name}
        </h2>
        {node.category && (
          <Badge variant="secondary" className="mt-2">
            {node.category}
          </Badge>
        )}
      </div>

      {/* Skill Details */}
      {isSkill && (
        <div className="space-y-4">
          {/* Proficiency */}
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-[#787774]">Proficiency</span>
              <span className="font-medium text-[#37352f]">
                {Math.round((node.proficiency || 0) * 100)}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#f7f6f3]">
              <div
                className="h-full bg-[#37352f] transition-all"
                style={{ width: `${(node.proficiency || 0) * 100}%` }}
              />
            </div>
          </div>

          {/* Confidence */}
          {node.confidence !== undefined && (
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-[#787774]">Confidence</span>
                <span className="font-medium text-[#37352f]">
                  {Math.round(node.confidence * 100)}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[#f7f6f3]">
                <div
                  className="h-full bg-[#37352f] transition-all"
                  style={{ width: `${node.confidence * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Status */}
          <div className="flex items-center justify-between border-t border-[#e3e2e0] pt-4 text-sm">
            <span className="text-[#787774]">Status</span>
            <Badge variant={node.dormant ? "secondary" : "default"}>
              {node.dormant ? "Dormant" : "Active"}
            </Badge>
          </div>

          {/* Endorsements */}
          {node.endorsementCount !== undefined && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#787774]">Endorsements</span>
              <span className="font-medium text-[#37352f]">
                {node.endorsementCount}
              </span>
            </div>
          )}

          {/* Source Repositories */}
          {node.sourceRepos && node.sourceRepos.length > 0 && (
            <div className="border-t border-[#e3e2e0] pt-4">
              <h3 className="mb-2 text-sm font-medium text-[#37352f]">
                Used in {node.sourceRepos.length} {node.sourceRepos.length === 1 ? "repository" : "repositories"}
              </h3>
              <div className="space-y-1">
                {node.sourceRepos.slice(0, 5).map((repo) => (
                  <div
                    key={repo}
                    className="rounded-md bg-[#f7f6f3] px-2 py-1 text-xs text-[#787774]"
                  >
                    {repo}
                  </div>
                ))}
                {node.sourceRepos.length > 5 && (
                  <p className="text-xs text-[#787774]">
                    +{node.sourceRepos.length - 5} more
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Repository Details */}
      {!isSkill && (
        <div className="space-y-4">
          {node.language && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#787774]">Language</span>
              <Badge variant="secondary">{node.language}</Badge>
            </div>
          )}
          
          {node.fullName && (
            <div className="border-t border-[#e3e2e0] pt-4">
              <p className="text-xs text-[#787774]">{node.fullName}</p>
            </div>
          )}
          
          {node.description && (
            <div>
              <p className="text-sm text-[#37352f]">{node.description}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
