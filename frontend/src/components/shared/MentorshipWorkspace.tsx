import { useState, useEffect } from "react";
import {
  BookOpen,
  Award,
  CheckCircle2,
  Lock,
  RefreshCw,
  Zap,
  HelpCircle,
  FileCheck
} from "lucide-react";
import {
  updateMentorshipMilestones,
  verifyMentorshipRequest
} from "../../services/mentorship.service";
import { Button } from "@/components/ui/button";

interface MentorshipWorkspaceProps {
  mentorshipId: string;
  skillName: string;
  partnerName: string;
  partnerRole: "mentor" | "student";
  initialStatus: string;
  onRefresh: () => void;
}

export function MentorshipWorkspace({
  mentorshipId,
  skillName,
  partnerName,
  partnerRole,
  initialStatus,
  onRefresh
}: MentorshipWorkspaceProps) {
  // Load milestone checked states from localStorage (since we don't have DB column)
  const storageKey = `mentorship_${mentorshipId}_milestones`;
  const [checkedMilestones, setCheckedMilestones] = useState<boolean[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [false, false, false];
    } catch {
      return [false, false, false];
    }
  });

  const [verifying, setVerifying] = useState(false);
  const [status, setStatus] = useState(initialStatus);

  const milestonesList = [
    {
      id: 0,
      title: "Foundational Concepts & Core Syntax",
      desc: "Demonstrate grasp of core structures, syntax rules, and standard design paradigms."
    },
    {
      id: 1,
      title: "Practical Hands-On Application",
      desc: "Build a prototype repository or complete a module assignment showcasing functional utility."
    },
    {
      id: 2,
      title: "Advanced Review & Code Refactoring",
      desc: "Perform optimization checks, implement clean error handling, and complete a final knowledge audit."
    }
  ];

  const allDone = checkedMilestones.every((m) => m === true);

  const handleCheckboxChange = async (index: number) => {
    if (partnerRole !== "mentor" || status === "completed") return;

    const updated = [...checkedMilestones];
    updated[index] = !updated[index];
    setCheckedMilestones(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));

    // Optional api update log
    try {
      await updateMentorshipMilestones(
        mentorshipId,
        updated.map((val, idx) => (val ? milestonesList[idx].title : "")).filter(Boolean)
      );
    } catch (err) {
      console.error("Failed to sync milestones:", err);
    }
  };

  const handleVerifySkill = async () => {
    if (partnerRole !== "mentor" || !allDone || status === "completed") return;
    setVerifying(true);
    try {
      await verifyMentorshipRequest(mentorshipId);
      setStatus("completed");
      onRefresh();
    } catch (err) {
      console.error("Failed to verify mentorship:", err);
      alert("Error finalizing mentorship verification.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="rounded-xl border border-[#dfe3ea] bg-white p-5 shadow-sm flex flex-col gap-4">
      {/* Workspace Header */}
      <div className="flex items-center justify-between border-b border-[#edf0f5] pb-3">
        <div>
          <h4 className="text-sm font-bold text-[#17202a]">
            {skillName} Mentorship Workspace
          </h4>
          <p className="text-xs text-[#626f86] mt-0.5">
            {partnerRole === "mentor" ? (
              <>Working with Student: <strong className="text-[#17202a]">{partnerName}</strong></>
            ) : (
              <>Your Alumni Mentor: <strong className="text-[#17202a]">{partnerName}</strong></>
            )}
          </p>
        </div>

        {status === "completed" ? (
          <span className="rounded-full bg-[#e7f8ef] border border-[#b8f5d0] px-2.5 py-0.5 text-xs font-bold text-[#1f845a] flex items-center gap-1">
            <CheckCircle2 className="size-3.5" />
            Skill Verified
          </span>
        ) : (
          <span className="rounded-full bg-[#e9f2ff] border border-[#0c66e4]/10 px-2.5 py-0.5 text-xs font-bold text-[#0c66e4] flex items-center gap-1.5 animate-pulse">
            <Zap className="size-3.5" />
            Active Learning
          </span>
        )}
      </div>

      {/* Checklist items */}
      <div className="flex flex-col gap-3">
        {milestonesList.map((m, idx) => {
          const isChecked = checkedMilestones[idx];
          const isMentor = partnerRole === "mentor";
          const isDisabled = !isMentor || status === "completed";

          return (
            <div
              key={m.id}
              onClick={() => !isDisabled && handleCheckboxChange(idx)}
              className={`flex gap-3.5 p-3 rounded-lg border transition-all ${
                isChecked
                  ? "bg-[#e7f8ef]/20 border-emerald-200"
                  : "bg-white border-[#dfe3ea]"
              } ${!isDisabled ? "cursor-pointer hover:border-slate-300 hover:bg-[#f7f8fa]" : "cursor-not-allowed"}`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                disabled={isDisabled}
                onChange={() => {}} // handled by click of outer container
                className="mt-0.5 rounded border-[#cfd7e3] text-emerald-600 focus:ring-emerald-500 cursor-pointer disabled:cursor-not-allowed"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${isChecked ? "text-emerald-800 line-through" : "text-[#17202a]"}`}>
                    Milestone {idx + 1}: {m.title}
                  </span>
                  {!isMentor && (
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#626f86] px-1 py-0.5 rounded bg-slate-50 border flex items-center gap-0.5">
                      <Lock className="size-2.5" />
                      Read-only
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-[#626f86] leading-relaxed">
                  {m.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recipient validation controls */}
      {partnerRole === "mentor" && status !== "completed" && (
        <div className="border-t border-[#edf0f5] pt-4 mt-1 flex flex-col gap-2.5">
          <div className="flex items-start gap-2 text-xs text-[#626f86] bg-[#f7f8fa] border border-[#dfe3ea] p-3 rounded-lg">
            <HelpCircle className="size-4 text-[#0c66e4] shrink-0 mt-0.5" />
            <p>
              <strong>Mentor Verification:</strong> Check off milestones as the student demonstrates competence. When all 3 checkboxes are ticked, you can verify this skill, publishing it to their Neo4j public graph.
            </p>
          </div>

          <Button
            onClick={handleVerifySkill}
            disabled={verifying || !allDone}
            className={`w-full py-2 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 ${
              allDone
                ? "bg-[#1f845a] hover:bg-[#166042] text-white"
                : "bg-slate-100 border border-[#dfe3ea] text-slate-400 cursor-not-allowed"
            }`}
          >
            {verifying ? (
              <RefreshCw className="size-3.5 animate-spin" />
            ) : (
              <FileCheck className="size-3.5" />
            )}
            Confirm & Verify Student's Skill
          </Button>
        </div>
      )}
    </div>
  );
}
