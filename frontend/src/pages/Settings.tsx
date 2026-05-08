import { Github, LogOut, Mail, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { GitHubConnectButton } from "../components/auth/GitHubConnectButton";
import { GoogleConnectButton } from "../components/auth/GoogleConnectButton";
import { getCurrentUser, logout } from "../services/auth.service";
import { useAuthStore } from "../store/auth.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type CurrentUser = {
  id: string;
  fullName: string;
  email?: string;
  emailVerified?: boolean;
  githubHandle?: string;
  githubConnected?: boolean;
  googleConnected?: boolean;
  publicHandle?: string;
};

export function Settings() {
  const [user, setUserState] = useState<CurrentUser | null>(null);
  const { setUser, clearUser } = useAuthStore();

  useEffect(() => {
    void getCurrentUser()
      .then((currentUser) => {
        setUserState(currentUser);
        setUser(currentUser);
      })
      .catch(() => {
        window.location.href = "/login";
      });
  }, [setUser]);

  async function handleLogout() {
    await logout();
    clearUser();
    window.location.href = "/";
  }

  return (
    <section className="mx-auto grid w-full max-w-[1000px] gap-4 pb-20 lg:pb-4">
      <header className="rounded-lg border border-[#dfe3ea] bg-white px-4 py-3 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#626f86]">Account</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#17202a]">Settings</h1>
      </header>

      <Card className="rounded-lg border-[#dfe3ea] bg-white py-0 shadow-sm">
        <CardHeader className="border-b border-[#edf0f5] px-4 py-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <UserRound className="size-4 text-[#0c66e4]" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 p-4 text-sm">
          <div className="flex items-center justify-between rounded-lg bg-[#f7f8fa] p-3">
            <span className="text-[#626f86]">Name</span>
            <span className="font-medium text-[#17202a]">{user?.fullName ?? "Loading..."}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-[#f7f8fa] p-3">
            <span className="text-[#626f86]">Email</span>
            <span className="font-medium text-[#17202a]">{user?.email ?? "Not added"}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-[#f7f8fa] p-3">
            <span className="text-[#626f86]">Public page</span>
            <span className="font-medium text-[#17202a]">{user?.publicHandle ? `/galaxy/${user.publicHandle}` : "Not ready"}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-lg border-[#dfe3ea] bg-white py-0 shadow-sm">
        <CardHeader className="border-b border-[#edf0f5] px-4 py-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <Mail className="size-4 text-[#1f845a]" />
            Sign-in methods
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 p-4">
          <div className="flex flex-col gap-3 rounded-lg border border-[#edf0f5] p-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#17202a]">Email confirmation</p>
              <p className="text-sm text-[#626f86]">{user?.emailVerified ? "Verified" : "Not verified"}</p>
            </div>
            <span className={user?.emailVerified ? "text-sm font-medium text-[#1f845a]" : "text-sm font-medium text-[#974f0c]"}>
              {user?.emailVerified ? "Confirmed" : "Pending"}
            </span>
          </div>

          <div className="flex flex-col gap-3 rounded-lg border border-[#edf0f5] p-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-[#17202a]">
                <Github className="size-4" />
                GitHub
              </p>
              <p className="text-sm text-[#626f86]">
                {user?.githubConnected ? `Connected as ${user.githubHandle}` : "Connect later to scan repositories."}
              </p>
            </div>
            <div className="w-full sm:w-56">
              {user?.githubConnected ? (
                <Button variant="outline" className="w-full border-[#cfd7e3] bg-white" disabled>
                  Connected
                </Button>
              ) : (
                <GitHubConnectButton label="Connect GitHub" link />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-lg border border-[#edf0f5] p-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#17202a]">Google</p>
              <p className="text-sm text-[#626f86]">{user?.googleConnected ? "Connected" : "Use Google as a sign-in method."}</p>
            </div>
            <div className="w-full sm:w-56">
              {user?.googleConnected ? (
                <Button variant="outline" className="w-full border-[#cfd7e3] bg-white" disabled>
                  Connected
                </Button>
              ) : (
                <GoogleConnectButton label="Connect Google" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-lg border-[#dfe3ea] bg-white p-4 shadow-sm">
        <Button variant="outline" className="gap-2 border-red-200 text-red-700 hover:bg-red-50" onClick={handleLogout}>
          <LogOut className="size-4" />
          Log out
        </Button>
      </Card>
    </section>
  );
}
