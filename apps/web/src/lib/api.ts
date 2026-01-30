const API_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:8082").replace(/\/$/, "");

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  timezone: string;
};

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

async function request<T>(path: string, init?: RequestInit, retry = true): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as any)
  };

  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    credentials: "include"
  });

  if (res.status === 401 && retry) {
    const refreshed = await refresh();
    if (refreshed) return request<T>(path, init, false);
  }

  if (!res.ok) {
    const msg = await safeJson(res);
    throw new Error(msg?.message ?? `Request failed (${res.status})`);
  }

  return (await res.json()) as T;
}

async function safeJson(res: Response): Promise<any | null> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function register(payload: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  timezone: string;
}): Promise<{ accessToken: string; user: User }> {
  const data = await request<{ accessToken: string; user: User }>(
    "/auth/register",
    { method: "POST", body: JSON.stringify(payload) },
    false
  );
  setAccessToken(data.accessToken);
  return data;
}

export async function login(payload: { email: string; password: string }): Promise<{ accessToken: string; user: User }> {
  const data = await request<{ accessToken: string; user: User }>(
    "/auth/login",
    { method: "POST", body: JSON.stringify(payload) },
    false
  );
  setAccessToken(data.accessToken);
  return data;
}

export async function refresh(): Promise<{ accessToken: string; user: User } | null> {
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { accessToken: string; user: User };
    setAccessToken(data.accessToken);
    return data;
  } catch {
    return null;
  }
}

export async function logout(): Promise<void> {
  await request("/auth/logout", { method: "POST" }, false);
  setAccessToken(null);
}

export type Note = {
  _id?: string;
  dateKey: string;
  content: string;
  tags?: string[];
  updatedAt?: string;
  createdAt?: string;
};

export async function getNote(dateKey: string): Promise<{ note: Note | null }> {
  return request(`/notes/${dateKey}`, { method: "GET" });
}

export async function upsertNote(dateKey: string, content: string, tags: string[] = []): Promise<{ note: Note }> {
  return request(`/notes/${dateKey}`, { method: "PUT", body: JSON.stringify({ content, tags }) });
}

export async function getRange(from: string, to: string): Promise<{ notes: Note[] }> {
  const qs = new URLSearchParams({ from, to }).toString();
  return request(`/notes?${qs}`, { method: "GET" });
}

export async function getCalendarMonth(month: string): Promise<{ dateKeys: string[] }> {
  return request(`/notes/calendar/${month}`, { method: "GET" });
}
