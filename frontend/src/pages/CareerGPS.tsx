import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownAZ,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  Download,
  History,
  RefreshCw,
  Route,
  Save,
  Search,
  Target,
  TrendingUp
} from "lucide-react";
import { getCurrentUser } from "../services/auth.service";
import { useAuthStore } from "../store/auth.store";
import { useCareerGPS } from "../hooks/useCareerGPS";
import { getCareerGPSHistory, type CareerGPSData, type CareerGPSHistoryItem } from "../services/careerGps.service";
import { RoleSelector } from "../components/gps/RoleSelector";
import { GPSProgressRing } from "../components/gps/GPSProgressRing";
import { CompletedSkillBadge } from "../components/gps/CompletedSkillBadge";
import { MissingSkillCard } from "../components/gps/MissingSkillCard";
import { SkillRoadmapTimeline } from "../components/gps/SkillRoadmapTimeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type MissingSort = "priority" | "difficulty" | "name";

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

function pdfText(value: string) {
  return value
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function wrapPdfText(text: string, maxChars: number) {
  const words = text.replace(/\s+/g, " ").trim().split(" ");
  const lines: string[] = [];
  let line = "";

  words.forEach((word) => {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  });

  if (line) lines.push(line);
  return lines.length ? lines : [""];
}

function createCareerGPSPdf(data: CareerGPSData) {
  const pageWidth = 595;
  const pageHeight = 842;
  const margin = 44;
  const contentWidth = pageWidth - margin * 2;
  const bottom = pageHeight - 48;
  const pages: string[][] = [[]];
  let pageIndex = 0;
  let y = margin;

  const current = () => pages[pageIndex];
  const command = (value: string) => current().push(value);
  const color = (hex: string) => {
    const normalized = hex.replace("#", "");
    const r = parseInt(normalized.slice(0, 2), 16) / 255;
    const g = parseInt(normalized.slice(2, 4), 16) / 255;
    const b = parseInt(normalized.slice(4, 6), 16) / 255;
    return `${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)}`;
  };
  const rect = (x: number, top: number, width: number, height: number, fill: string) => {
    command(`${color(fill)} rg ${x} ${pageHeight - top - height} ${width} ${height} re f`);
  };
  const text = (value: string, x: number, top: number, size = 10, fill = "#17202a", font = "F1") => {
    command(`BT /${font} ${size} Tf ${color(fill)} rg ${x} ${pageHeight - top} Td (${pdfText(value)}) Tj ET`);
  };
  const line = (x1: number, top1: number, x2: number, top2: number, stroke = "#dfe3ea") => {
    command(`${color(stroke)} RG 1 w ${x1} ${pageHeight - top1} m ${x2} ${pageHeight - top2} l S`);
  };
  const newPage = () => {
    pages.push([]);
    pageIndex += 1;
    y = margin;
  };
  const ensureSpace = (height: number) => {
    if (y + height > bottom) newPage();
  };
  const paragraph = (value: string, x: number, maxChars: number, size = 10, fill = "#44546f", leading = 14) => {
    wrapPdfText(value, maxChars).forEach((lineText) => {
      text(lineText, x, y, size, fill);
      y += leading;
    });
  };
  const sectionTitle = (value: string) => {
    ensureSpace(42);
    y += 12;
    text(value, margin, y, 14, "#17202a", "F2");
    y += 12;
    line(margin, y, pageWidth - margin, y);
    y += 18;
  };

  rect(0, 0, pageWidth, 96, "#f7f8fa");
  rect(0, 0, 8, 96, "#0c66e4");
  text("Career GPS", margin, 34, 22, "#17202a", "F2");
  text(data.targetRole.name, margin, 58, 13, "#44546f");
  text(`Generated ${new Date().toLocaleDateString()}`, pageWidth - 180, 36, 10, "#626f86");
  y = 124;

  const cardGap = 12;
  const cardWidth = (contentWidth - cardGap * 2) / 3;
  [
    ["Progress", `${data.completionPercentage}%`, `${data.skillsCompleted} of ${data.totalSkillsRequired} skills`],
    ["Estimated time", `${data.estimatedWeeks} weeks`, `${data.roadmap.reduce((total, item) => total + item.estimatedWeeks, 0)} roadmap weeks`],
    ["Skills to learn", String(data.skillsRemaining), `${data.completedSkills.length} already covered`]
  ].forEach(([label, value, sub], index) => {
    const x = margin + index * (cardWidth + cardGap);
    rect(x, y, cardWidth, 86, "#ffffff");
    command(`${color("#dfe3ea")} RG 1 w ${x} ${pageHeight - y - 86} ${cardWidth} 86 re S`);
    text(label, x + 14, y + 22, 9, "#626f86", "F2");
    text(value, x + 14, y + 50, 22, "#0c66e4", "F2");
    text(sub, x + 14, y + 70, 9, "#44546f");
  });
  y += 112;

  sectionTitle("Skills To Learn");
  if (data.missingSkills.length === 0) {
    paragraph("You already cover every required skill for this role.", margin, 82);
  } else {
    data.missingSkills.forEach((skill) => {
      ensureSpace(34);
      text(skill.name, margin, y, 11, "#17202a", "F2");
      text(`${skill.category} | Difficulty ${skill.learningDifficulty}/5`, margin + 260, y, 9, "#626f86");
      y += 18;
    });
  }

  sectionTitle("Learning Roadmap");
  if (data.roadmap.length === 0) {
    paragraph("No roadmap items are needed for this role right now.", margin, 82);
  } else {
    data.roadmap.forEach((item, index) => {
      const objectiveLines = wrapPdfText(item.objective, 82);
      const projectLines = wrapPdfText(item.practiceProject, 82);
      const estimatedHeight = 70 + (objectiveLines.length + projectLines.length + item.milestones.length) * 14;
      ensureSpace(estimatedHeight);
      rect(margin, y - 8, contentWidth, estimatedHeight - 8, "#f7f8fa");
      text(`${index + 1}. ${item.skillName}`, margin + 14, y + 12, 12, "#17202a", "F2");
      text(`${item.estimatedWeeks} weeks | Difficulty ${item.difficulty}/5`, margin + 360, y + 12, 9, "#0c66e4", "F2");
      y += 34;
      paragraph(`Objective: ${item.objective}`, margin + 14, 82, 9, "#44546f", 13);
      paragraph(`Project: ${item.practiceProject}`, margin + 14, 82, 9, "#44546f", 13);
      item.milestones.forEach((milestone) => paragraph(`- ${milestone}`, margin + 14, 80, 9, "#44546f", 13));
      y += 18;
    });
  }

  pages.forEach((page, index) => {
    page.push(`BT /F1 9 Tf ${color("#626f86")} rg ${margin} 24 Td (SkillGraph Career GPS) Tj ET`);
    page.push(`BT /F1 9 Tf ${color("#626f86")} rg ${pageWidth - 92} 24 Td (Page ${index + 1} of ${pages.length}) Tj ET`);
  });

  const objects: string[] = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    `<< /Type /Pages /Kids [${pages.map((_, index) => `${index * 2 + 3} 0 R`).join(" ")}] /Count ${pages.length} >>`
  ];

  pages.forEach((page, index) => {
    const pageObjectId = index * 2 + 3;
    const contentObjectId = pageObjectId + 1;
    const stream = `${page.join("\n")}\n`;
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> >> >> /Contents ${contentObjectId} 0 R >>`);
    objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}endstream`);
  });

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
}

export function CareerGPS() {
  const { userId, setUser } = useAuthStore();
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [skillQuery, setSkillQuery] = useState("");
  const [missingSort, setMissingSort] = useState<MissingSort>("priority");
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [history, setHistory] = useState<CareerGPSHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const { data, loading, error, save } = useCareerGPS({
    studentId: userId ?? null,
    targetRoleId: selectedRoleId
  });

  useEffect(() => {
    if (userId) return;

    void getCurrentUser()
      .then(setUser)
      .catch(() => {
        window.location.href = "/login";
      });
  }, [setUser, userId]);

  useEffect(() => {
    if (!userId) return;

    setHistoryLoading(true);
    getCareerGPSHistory(userId)
      .then(setHistory)
      .catch(() => setHistory([]))
      .finally(() => setHistoryLoading(false));
  }, [userId, saveStatus]);

  const filteredCompletedSkills = useMemo(() => {
    if (!data) return [];
    const query = skillQuery.trim().toLowerCase();
    return data.completedSkills.filter((skill) => {
      if (!query) return true;
      return `${skill.name} ${skill.category}`.toLowerCase().includes(query);
    });
  }, [data, skillQuery]);

  const filteredMissingSkills = useMemo(() => {
    if (!data) return [];
    const query = skillQuery.trim().toLowerCase();
    const skills = data.missingSkills.filter((skill) => {
      if (!query) return true;
      return `${skill.name} ${skill.category}`.toLowerCase().includes(query);
    });

    return [...skills].sort((a, b) => {
      if (missingSort === "difficulty") {
        return (b.learningDifficulty ?? 0) - (a.learningDifficulty ?? 0);
      }

      if (missingSort === "name") {
        return a.name.localeCompare(b.name);
      }

      return (b.learningDifficulty ?? 0) - (a.learningDifficulty ?? 0);
    });
  }, [data, missingSort, skillQuery]);

  const roadmapWeeks = data?.roadmap.reduce((total, item) => total + item.estimatedWeeks, 0) ?? 0;

  const handleSave = async () => {
    if (!selectedRoleId) {
      setSaveStatus("Select a target role before saving.");
      return;
    }

    if (loading) {
      setSaveStatus("Wait for the career path to finish calculating before saving.");
      return;
    }

    if (!data) {
      setSaveStatus("Generate a career path before saving.");
      return;
    }

    setSaving(true);
    setSaveStatus(null);

    try {
      await save();
      setSaveStatus("Career path saved.");
    } catch (err) {
      setSaveStatus(err instanceof Error ? err.message : "Failed to save career path.");
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    if (!data) return;

    const blob = createCareerGPSPdf(data);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${data.targetRole.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-career-gps.pdf`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <section className="mx-auto grid w-full max-w-[1500px] gap-4 pb-20 lg:pb-4">
      <header className="flex flex-col gap-3 rounded-lg border border-[#dfe3ea] bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.08em] text-[#626f86]">
            <Route className="size-3.5 text-[#0c66e4]" />
            Career navigation
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#17202a]">Career GPS</h1>
          <p className="mt-1 text-sm text-[#626f86]">Compare your current skill graph with target roles.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => window.location.reload()}
            className="gap-2"
          >
            <RefreshCw className="size-4" />
            Refresh
          </Button>
          <Button
            type="button"
            size="lg"
            onClick={handleSave}
            disabled={saving || loading}
            className="gap-2 bg-[#0c66e4] text-white hover:bg-[#0055cc]"
          >
            {saving ? <RefreshCw className="size-4 animate-spin" /> : <Save className="size-4" />}
            {saving ? "Saving..." : "Save path"}
          </Button>
        </div>
      </header>

      {saveStatus && (
        <div className="rounded-lg border border-[#dfe3ea] bg-white px-4 py-3 text-sm text-[#17202a] shadow-sm">
          {saveStatus}
        </div>
      )}

      <Card className="rounded-lg border-[#dfe3ea] bg-white py-0 shadow-sm">
        <CardContent className="p-4">
          <RoleSelector value={selectedRoleId} onChange={(roleId) => {
            setSelectedRoleId(roleId || null);
            setSaveStatus(null);
          }} />
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {loading && (
        <Card className="rounded-lg border-[#dfe3ea] bg-white p-8 text-center shadow-sm">
          <RefreshCw className="mx-auto size-5 animate-spin text-[#0c66e4]" />
          <p className="mt-3 text-sm text-[#626f86]">Calculating your career path...</p>
        </Card>
      )}

      {data && !loading && (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="grid gap-4">
            <section className="grid gap-3 md:grid-cols-3">
              <Card className="rounded-lg border-[#dfe3ea] bg-white py-4 shadow-sm">
                <CardContent className="flex flex-col items-center px-4">
                  <GPSProgressRing percentage={data.completionPercentage} />
                  <h2 className="mt-3 text-sm font-semibold text-[#17202a]">{data.targetRole.name}</h2>
                  <p className="mt-1 text-xs text-[#626f86]">
                    {data.skillsCompleted} of {data.totalSkillsRequired} required skills
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-lg border-[#dfe3ea] bg-white py-4 shadow-sm">
                <CardContent className="flex items-start gap-3 px-4">
                  <div className="grid size-9 place-items-center rounded-lg bg-[#e9f2ff] text-[#0c66e4]">
                    <Clock className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#626f86]">Estimated time</p>
                    <p className="mt-1 text-2xl font-semibold text-[#17202a]">{data.estimatedWeeks} weeks</p>
                    <p className="mt-1 text-xs text-[#626f86]">{roadmapWeeks} scheduled roadmap weeks</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-lg border-[#dfe3ea] bg-white py-4 shadow-sm">
                <CardContent className="flex items-start gap-3 px-4">
                  <div className="grid size-9 place-items-center rounded-lg bg-[#fff4e5] text-[#974f0c]">
                    <Target className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#626f86]">Skills to learn</p>
                    <p className="mt-1 text-2xl font-semibold text-[#17202a]">{data.skillsRemaining}</p>
                    <p className="mt-1 text-xs text-[#626f86]">{data.completedSkills.length} already covered</p>
                  </div>
                </CardContent>
              </Card>
            </section>

            <Card className="rounded-lg border-[#dfe3ea] bg-white py-0 shadow-sm">
              <CardHeader className="border-b border-[#edf0f5] px-4 py-3">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <CardTitle className="text-sm font-semibold text-[#17202a]">Skill breakdown</CardTitle>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="relative sm:w-64">
                      <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-[#626f86]" />
                      <Input
                        value={skillQuery}
                        onChange={(event) => setSkillQuery(event.target.value)}
                        placeholder="Search skills"
                        className="h-9 border-[#cfd7e3] bg-[#f7f8fa] pl-8"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setMissingSort((current) => current === "priority" ? "difficulty" : current === "difficulty" ? "name" : "priority")}
                      className="gap-2"
                    >
                      {missingSort === "name" ? <ArrowDownAZ className="size-4" /> : <ArrowUpDown className="size-4" />}
                      {missingSort === "priority" ? "Priority" : missingSort === "difficulty" ? "Difficulty" : "Name"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 p-4 lg:grid-cols-2">
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <TrendingUp className="size-4 text-[#1f845a]" />
                    <h3 className="text-sm font-semibold text-[#17202a]">Completed ({filteredCompletedSkills.length})</h3>
                  </div>
                  <div className="space-y-2">
                    {filteredCompletedSkills.length === 0 ? (
                      <p className="rounded-lg border border-dashed border-[#cfd7e3] p-4 text-sm text-[#626f86]">
                        No completed skills match this view.
                      </p>
                    ) : (
                      filteredCompletedSkills.map((skill) => (
                        <CompletedSkillBadge key={skill.id} name={skill.name} category={skill.category} />
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <Target className="size-4 text-[#974f0c]" />
                    <h3 className="text-sm font-semibold text-[#17202a]">To learn ({filteredMissingSkills.length})</h3>
                  </div>
                  <div className="space-y-2">
                    {filteredMissingSkills.length === 0 ? (
                      <p className="rounded-lg border border-dashed border-[#cfd7e3] p-4 text-sm text-[#626f86]">
                        All required skills are covered in this view.
                      </p>
                    ) : (
                      filteredMissingSkills.map((skill) => (
                        <MissingSkillCard
                          key={skill.id}
                          name={skill.name}
                          category={skill.category}
                          learningDifficulty={skill.learningDifficulty}
                        />
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-lg border-[#dfe3ea] bg-white py-0 shadow-sm">
              <CardHeader className="border-b border-[#edf0f5] px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-sm font-semibold text-[#17202a]">Learning roadmap</CardTitle>
                  <Button type="button" variant="outline" onClick={handleExport} disabled={!data} className="gap-2">
                    <Download className="size-4" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <SkillRoadmapTimeline roadmap={data.roadmap} />
              </CardContent>
            </Card>
          </div>

          <aside className="grid gap-4 self-start xl:sticky xl:top-4">
            <Card className="rounded-lg border-[#dfe3ea] bg-white py-0 shadow-sm">
              <CardHeader className="border-b border-[#edf0f5] px-4 py-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-[#17202a]">
                  <CheckCircle2 className="size-4 text-[#1f845a]" />
                  Next best steps
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-4">
                {data.roadmap.slice(0, 3).map((item, index) => (
                  <div key={item.skillId} className="rounded-lg border border-[#dfe3ea] bg-[#f7f8fa] p-3">
                    <p className="text-xs font-medium text-[#626f86]">Step {index + 1}</p>
                    <p className="mt-1 text-sm font-semibold text-[#17202a]">{item.skillName}</p>
                    <p className="mt-1 text-xs leading-5 text-[#626f86]">
                      {item.objective}
                    </p>
                    <p className="mt-2 text-xs font-medium text-[#17202a]">
                      {item.estimatedWeeks} weeks, difficulty {item.difficulty}/5
                    </p>
                  </div>
                ))}
                {data.roadmap.length === 0 && (
                  <p className="text-sm text-[#626f86]">You already cover every required skill for this role.</p>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-lg border-[#dfe3ea] bg-white py-0 shadow-sm">
              <CardHeader className="border-b border-[#edf0f5] px-4 py-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-[#17202a]">
                  <History className="size-4 text-[#0c66e4]" />
                  Saved paths
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-4">
                {historyLoading && <p className="text-sm text-[#626f86]">Loading saved paths...</p>}
                {!historyLoading && history.length === 0 && (
                  <p className="text-sm text-[#626f86]">Saved paths will appear here after you save one.</p>
                )}
                {!historyLoading && history.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedRoleId(item.roleId)}
                    className="w-full rounded-lg border border-[#dfe3ea] bg-white p-3 text-left transition hover:border-[#0c66e4] hover:bg-[#f7f8fa]"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-[#17202a]">{item.roleName}</p>
                      <span className="text-xs font-medium text-[#0c66e4]">{item.completionPercentage}%</span>
                    </div>
                    <p className="mt-1 text-xs text-[#626f86]">{formatDate(item.lastUpdated)}</p>
                  </button>
                ))}
              </CardContent>
            </Card>
          </aside>
        </div>
      )}

      {!selectedRoleId && !loading && (
        <Card className="rounded-lg border-[#dfe3ea] bg-white p-10 text-center shadow-sm">
          <Target className="mx-auto size-10 text-[#0c66e4]" />
          <h2 className="mt-4 text-lg font-semibold text-[#17202a]">Select a target role</h2>
          <p className="mt-2 text-sm text-[#626f86]">Choose a role above to generate your personalized skill gap, timeline, and saved path.</p>
        </Card>
      )}
    </section>
  );
}
