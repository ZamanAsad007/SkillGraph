import { isAxiosError } from "axios";
import { ArrowLeft, Mail, ShieldCheck } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GitHubConnectButton } from "../components/auth/GitHubConnectButton";
import { GoogleConnectButton } from "../components/auth/GoogleConnectButton";
import { loginWithEmail, registerWithEmail, verifyEmail } from "../services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function authError(error: unknown) {
  if (isAxiosError(error)) {
    return error.response?.data?.error?.message ?? error.message;
  }
  return error instanceof Error ? error.message : "Something went wrong";
}

export function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialMode = location.pathname === "/signup" ? "signup" : "login";
  const [mode, setMode] = useState<"login" | "signup" | "verify">(initialMode);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const [devVerificationToken, setDevVerificationToken] = useState<string>();
  const [verificationEmailSent, setVerificationEmailSent] = useState<boolean>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = new URLSearchParams(location.search).get("token");
    if (!token) return;

    setVerificationToken(token);
    setMode("verify");
  }, [location.search]);

  const title = useMemo(() => {
    if (mode === "signup") return "Create your SkillGraph account";
    if (mode === "verify") return "Confirm your email";
    return "Log in to SkillGraph";
  }, [mode]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(undefined);
    setLoading(true);

    try {
      if (mode === "signup") {
        const result = await registerWithEmail({ fullName, email, password });
        setDevVerificationToken(result.verificationToken);
        setVerificationEmailSent(result.emailSent);
        setVerificationToken("");
        setMode("verify");
      } else if (mode === "verify") {
        await verifyEmail(verificationToken);
        navigate("/dashboard");
      } else {
        await loginWithEmail({ email, password });
        navigate("/dashboard");
      }
    } catch (submitError) {
      setError(authError(submitError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-[#f6f7f9] px-4 py-8 text-[#17202a] lg:grid-cols-[minmax(0,1fr)_520px] lg:p-0">
      <section className="hidden flex-col justify-between border-r border-[#dfe3ea] bg-white p-10 lg:flex">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-[#44546f]">
          <ArrowLeft className="size-4" />
          Back to landing
        </Link>
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.08em] text-[#626f86]">SkillGraph</p>
          <h1 className="max-w-xl text-5xl font-semibold tracking-tight">One account, many ways in.</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-[#44546f]">
            Start with email, Google, or GitHub. If you do not connect GitHub now, you can add it later from settings.
          </p>
        </div>
        <div className="grid gap-3 text-sm text-[#44546f]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-[#1f845a]" />
            Email confirmation for manual accounts
          </div>
          <div className="flex items-center gap-2">
            <Mail className="size-4 text-[#0c66e4]" />
            GitHub can be linked later for repository scanning
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-md flex-col justify-center lg:px-10">
        <div className="mb-8 lg:hidden">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-[#44546f]">
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </div>

        <div className="rounded-lg border border-[#dfe3ea] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          <p className="mt-2 text-sm text-[#626f86]">
            {mode === "verify"
              ? verificationEmailSent === false
                ? "Email delivery is not configured for this environment."
                : "Paste the confirmation token sent to your email."
              : "Choose an OAuth provider or use email and password."}
          </p>

          {mode !== "verify" && (
            <div className="mt-6 grid gap-2">
              <GoogleConnectButton />
              <GitHubConnectButton />
            </div>
          )}

          {mode !== "verify" && (
            <div className="my-5 flex items-center gap-3 text-xs text-[#626f86]">
              <div className="h-px flex-1 bg-[#edf0f5]" />
              or
              <div className="h-px flex-1 bg-[#edf0f5]" />
            </div>
          )}

          <form className="grid gap-3" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <label className="grid gap-1.5 text-sm font-medium">
                Full name
                <Input value={fullName} onChange={(event) => setFullName(event.target.value)} required />
              </label>
            )}

            {mode !== "verify" ? (
              <>
                <label className="grid gap-1.5 text-sm font-medium">
                  Email
                  <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
                </label>
                <label className="grid gap-1.5 text-sm font-medium">
                  Password
                  <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} />
                </label>
              </>
            ) : (
              <label className="grid gap-1.5 text-sm font-medium">
                Confirmation token
                <Input value={verificationToken} onChange={(event) => setVerificationToken(event.target.value)} required />
              </label>
            )}

            {mode === "verify" && devVerificationToken && (
              <div className="rounded-lg border border-[#cce0ff] bg-[#e9f2ff] p-3 text-xs leading-5 text-[#0c66e4]">
                SMTP is not configured locally. Use this development token to verify the account:
                <span className="mt-1 block break-all font-mono">{devVerificationToken}</span>
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <Button disabled={loading} className="mt-2 bg-[#0c66e4] text-white hover:bg-[#0055cc]">
              {loading ? "Please wait..." : mode === "signup" ? "Create account" : mode === "verify" ? "Confirm email" : "Log in"}
            </Button>
          </form>

          <div className="mt-5 text-center text-sm text-[#626f86]">
            {mode === "signup" ? (
              <button className="font-medium text-[#0c66e4]" onClick={() => {
                setDevVerificationToken(undefined);
                setVerificationEmailSent(undefined);
                setMode("login");
              }}>
                Already have an account? Log in
              </button>
            ) : (
              <button className="font-medium text-[#0c66e4]" onClick={() => {
                setDevVerificationToken(undefined);
                setVerificationEmailSent(undefined);
                setVerificationToken("");
                setMode("signup");
              }}>
                New here? Create an account
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
