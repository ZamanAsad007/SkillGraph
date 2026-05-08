import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Github,
  GraduationCap,
  MailCheck,
  Network,
  Radar,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const networkNodes = [
  { label: "React", left: "12%", top: "24%", size: "size-20", tone: "border-[#86b7ff] bg-[#e9f2ff] text-[#0c66e4]" },
  { label: "Python", left: "74%", top: "18%", size: "size-24", tone: "border-[#9ee7bf] bg-[#e7f8ef] text-[#1f845a]" },
  { label: "APIs", left: "61%", top: "58%", size: "size-18", tone: "border-[#ffc2d4] bg-[#ffe8ef] text-[#c0265a]" },
  { label: "Docker", left: "22%", top: "69%", size: "size-22", tone: "border-[#ffd99b] bg-[#fff4e5] text-[#974f0c]" },
  { label: "Neo4j", left: "44%", top: "34%", size: "size-28", tone: "border-[#d7b8ff] bg-[#f3e8ff] text-[#7e22ce]" },
];

const outcomes = [
  ["Skill graph", "Understand what your projects prove."],
  ["Career GPS", "See the shortest path to target roles."],
  ["Team fit", "Find collaborators by real strengths."],
  ["Verified profile", "Use email, Google, or GitHub identity."],
];

const steps = [
  {
    title: "Create a verified profile",
    body: "Sign up with email confirmation, Google, or GitHub. GitHub can be connected later.",
    Icon: ShieldCheck,
  },
  {
    title: "Map real project evidence",
    body: "Turn repositories, academic projects, and endorsements into a readable skill graph.",
    Icon: Network,
  },
  {
    title: "Act on the next move",
    body: "Compare yourself to roles, fill gaps, and match with the right teammates.",
    Icon: GraduationCap,
  },
];

const authOptions = [
  { label: "Email confirmation", Icon: MailCheck },
  { label: "Google OAuth", Icon: CheckCircle2 },
  { label: "GitHub linking", Icon: Github },
];

export function Landing() {
  return (
    <main className="min-h-screen bg-[#f6f7f9] text-[#17202a]">
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/20 bg-[#07111f]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between px-5 sm:px-8">
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-white">
            <span className="grid size-8 place-items-center rounded-lg bg-white text-[#07111f]">
              <Network className="size-4" />
            </span>
            SkillGraph
          </Link>
          <div className="hidden items-center gap-6 text-sm font-medium text-white/70 md:flex">
            <a href="#platform" className="hover:text-white">Platform</a>
            <a href="#workflow" className="hover:text-white">Workflow</a>
            <a href="#auth" className="hover:text-white">Access</a>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white">Log in</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-white text-[#07111f] hover:bg-white/90">Sign up</Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative min-h-screen overflow-hidden bg-[#07111f] pt-16 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.075)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.075)_1px,transparent_1px)] bg-[size:44px_44px]" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#f6f7f9] to-transparent" />

        <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-[1600px] items-center gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[0.86fr_1.14fr]">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/75 backdrop-blur">
              <Sparkles className="size-3.5 text-[#8bb8ff]" />
              Career intelligence for project-based learning
            </div>
            <h1 className="mt-6 text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
              Make every project count toward the next role.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">
              SkillGraph turns student work into a verified skill profile, career roadmap, and collaboration signal without forcing GitHub at signup.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/signup">
                <Button size="lg" className="w-full gap-2 bg-[#0c66e4] text-white hover:bg-[#0055cc] sm:w-auto">
                  Create account
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full border-white/20 bg-white/10 text-white hover:bg-white/15 sm:w-auto">
                  Log in
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative min-h-[560px]">
            <div data-gsap="radar" className="absolute left-1/2 top-1/2 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
            <div className="absolute left-1/2 top-1/2 size-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
            <div className="absolute left-1/2 top-1/2 grid size-32 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-3xl border border-white/20 bg-white text-[#07111f] shadow-2xl">
              <Radar className="size-12 text-[#0c66e4]" />
            </div>

            <svg className="absolute inset-0 h-full w-full opacity-60" aria-hidden="true">
              {networkNodes.map((node) => (
                <line key={node.label} x1="50%" y1="50%" x2={node.left} y2={node.top} stroke="#8bb8ff" strokeWidth="1" />
              ))}
            </svg>

            {networkNodes.map((node) => (
              <div
                className={`absolute grid ${node.size} place-items-center rounded-2xl border text-sm font-semibold shadow-2xl ${node.tone}`}
                key={node.label}
                style={{ left: node.left, top: node.top }}
              >
                {node.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="platform" className="relative mx-auto -mt-16 grid w-full max-w-[1600px] gap-4 px-5 sm:px-8 lg:grid-cols-4">
        {outcomes.map(([title, body]) => (
          <article className="rounded-lg border border-[#dfe3ea] bg-white p-5 shadow-sm" key={title}>
            <p className="text-base font-semibold">{title}</p>
            <p className="mt-2 text-sm leading-6 text-[#626f86]">{body}</p>
          </article>
        ))}
      </section>

      <section id="workflow" className="mx-auto grid w-full max-w-[1600px] gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#0c66e4]">Organized workflow</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">A cleaner path from signup to career signal.</h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#44546f]">
            The product supports students who do not want to connect GitHub immediately, while still making GitHub scanning a powerful upgrade from settings.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {steps.map(({ title, body, Icon }) => (
            <article className="rounded-lg border border-[#dfe3ea] bg-white p-5 shadow-sm" key={title}>
              <Icon className="size-6 text-[#0c66e4]" />
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#626f86]">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="auth" className="mx-5 mb-8 rounded-2xl bg-[#07111f] px-5 py-10 text-white sm:mx-8 sm:px-8">
        <div className="mx-auto grid w-full max-w-[1536px] gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8bb8ff]">Flexible access</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight">Start with email. Connect GitHub when you are ready.</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {authOptions.map(({ label, Icon }) => (
              <div className="rounded-lg border border-white/10 bg-white/10 p-4" key={label}>
                <Icon className="size-5 text-[#8bb8ff]" />
                <p className="mt-3 text-sm font-semibold">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
