import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader } from "../components/Card";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import * as api from "../lib/api";
import { useAuth } from "../state/auth";

export function AuthPage() {
  const nav = useNavigate();
  const { setAuthed } = useAuth();
  const [mode, setMode] = React.useState<"login" | "register">("login");
  const [error, setError] = React.useState<string | null>(null);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");

  async function submit() {
    setError(null);
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC";
      const res =
        mode === "login"
          ? await api.login({ email, password })
          : await api.register({ email, password, firstName, lastName, timezone: tz });

      setAuthed(res.user);
      nav("/");
    } catch (e: any) {
      setError(e.message ?? "Failed");
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <CardHeader
          title={mode === "login" ? "Sign in" : "Create account"}
          subtitle="My diary is private to me!"
          right={
            <Button variant="ghost" onClick={() => setMode(mode === "login" ? "register" : "login")}>
              {mode === "login" ? "Register" : "Login"}
            </Button>
          }
        />
        <CardBody>
          <div className="space-y-3">
            {mode === "register" ? (
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                <Input placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
            ) : null}

            <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

            {error ? <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

            <Button onClick={submit} className="w-full">
              {mode === "login" ? "Sign in" : "Create account"}
            </Button>

            <div className="text-[10px] text-zinc-500">
              Password must be at least 8 characters.
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
