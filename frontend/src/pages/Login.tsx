import { Github } from "lucide-react";

export function Login() {
  return (
    <main className="grid min-h-screen place-items-center bg-white">
      <a className="inline-flex items-center gap-2 rounded bg-slate-900 px-4 py-2 text-white" href="/api/v1/auth/github">
        <Github size={18} />
        Connect GitHub
      </a>
    </main>
  );
}
