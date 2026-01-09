import React from "react";
import * as api from "../lib/api";

type AuthState =
  | { status: "loading" }
  | { status: "anon" }
  | { status: "authed"; user: api.User };

const AuthCtx = React.createContext<{
  state: AuthState;
  setAuthed: (user: api.User) => void;
  setAnon: () => void;
}>({
  state: { status: "loading" },
  setAuthed: () => {},
  setAnon: () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AuthState>({ status: "loading" });

  React.useEffect(() => {
    (async () => {
      const refreshed = await api.refresh();
      if (refreshed) setState({ status: "authed", user: refreshed.user });
      else setState({ status: "anon" });
    })();
  }, []);

  return (
    <AuthCtx.Provider
      value={{
        state,
        setAuthed: (user) => setState({ status: "authed", user }),
        setAnon: () => setState({ status: "anon" })
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return React.useContext(AuthCtx);
}
