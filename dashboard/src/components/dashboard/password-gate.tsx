"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

// SHA-256 hash of the password "TahomaBears"
const PASSWORD_HASH = "95858ea9bb291145f7aecfc156f3d2f8b1342996025e76ba4bc74456b0ef7d5f";

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function PasswordGate({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("dashboard_auth");
    if (stored === PASSWORD_HASH) {
      setAuthenticated(true);
    }
    setLoading(false);
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const hash = await sha256(password);
    if (hash === PASSWORD_HASH) {
      sessionStorage.setItem("dashboard_auth", PASSWORD_HASH);
      setAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setPassword("");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafaf9]" role="status" aria-label="Loading dashboard">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#00357b] border-t-transparent" />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (authenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fafaf9] p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#00357b]">
            <Lock className="h-6 w-6 text-[#FFCB1E]" />
          </div>
          <CardTitle className="text-lg text-[#00357b]">
            Tahoma Bears Baseball
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter password to access the board dashboard
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="dashboard-password" className="sr-only">
                Password
              </label>
              <Input
                id="dashboard-password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                autoFocus
                autoComplete="current-password"
                aria-invalid={error || undefined}
                aria-describedby={error ? "password-error" : undefined}
                className={error ? "border-rose-500 focus-visible:ring-rose-500" : ""}
              />
              <div aria-live="assertive">
                {error && (
                  <p id="password-error" className="mt-1.5 text-xs text-rose-600">
                    Incorrect password. Please try again.
                  </p>
                )}
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-[#00357b] hover:bg-[#00357b]/90"
            >
              Access Dashboard
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
