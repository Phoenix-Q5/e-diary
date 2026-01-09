import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { CalendarNavigator } from "../components/CalendarNavigator";
import { DailyEditor } from "../components/DailyEditor";
import { WeekNotesList } from "../components/WeekNotesList";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import * as api from "../lib/api";
import { dateKey, monthKey, weekRange } from "../lib/dates";
import { useAuth } from "../state/auth";

export function AppPage() {
  const { state, setAnon } = useAuth();
  const nav = useNavigate();
  const [params, setParams] = useSearchParams();
  const selectedKey = params.get("d") ?? dateKey(new Date());
  const selected = parseISO(selectedKey);

  const [month, setMonth] = React.useState<Date>(new Date(selected.getFullYear(), selected.getMonth(), 1));

  const qc = useQueryClient();

  const { from, to } = weekRange(selected);

  const weekQ = useQuery({
    queryKey: ["week", from, to],
    queryFn: () => api.getRange(from, to),
    enabled: state.status === "authed"
  });

  const noteQ = useQuery({
    queryKey: ["note", selectedKey],
    queryFn: () => api.getNote(selectedKey),
    enabled: state.status === "authed"
  });

  const monthQ = useQuery({
    queryKey: ["month", monthKey(month)],
    queryFn: () => api.getCalendarMonth(monthKey(month)),
    enabled: state.status === "authed"
  });

  const [draft, setDraft] = React.useState("");
  const [saveStatus, setSaveStatus] = React.useState<"idle" | "saving" | "saved">("idle");
  const [lastSavedAt, setLastSavedAt] = React.useState<Date | null>(null);

  React.useEffect(() => {
    setDraft(noteQ.data?.note?.content ?? "");
    setSaveStatus("idle");
  }, [selectedKey, noteQ.data?.note?.content]);

  async function doSave() {
    setSaveStatus("saving");
    await api.upsertNote(selectedKey, draft);
    setSaveStatus("saved");
    setLastSavedAt(new Date());

    await Promise.all([
      qc.invalidateQueries({ queryKey: ["note", selectedKey] }),
      qc.invalidateQueries({ queryKey: ["week", from, to] }),
      qc.invalidateQueries({ queryKey: ["month", monthKey(month)] })
    ]);
  }

  // Debounced autosave
  React.useEffect(() => {
    if (state.status !== "authed") return;
    const t = setTimeout(() => {
      const serverContent = noteQ.data?.note?.content ?? "";
      if (draft !== serverContent) {
        // autosave only if user typed something (or cleared) and the editor is not in initial loading
        if (!noteQ.isLoading) doSave().catch(() => setSaveStatus("idle"));
      }
    }, 1200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  async function doLogout() {
    await api.logout();
    setAnon();
    nav("/auth");
  }

  const entryDays = new Set<string>((monthQ.data?.dateKeys ?? []).concat((weekQ.data?.notes ?? []).filter(n => n.content.trim().length>0).map(n => n.dateKey)));

  if (state.status !== "authed") return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-xl font-semibold">Dashboard</div>
          <div className="text-sm text-zinc-600">
            Today is <span className="font-medium">{format(new Date(), "MMMM d, yyyy")}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => setParams({ d: dateKey(new Date()) })}>
            Today
          </Button>
          <Button variant="ghost" onClick={doLogout}>
            Logout
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <CalendarNavigator
            month={month}
            selected={selected}
            entryDays={entryDays}
            onChangeMonth={(d) => setMonth(new Date(d.getFullYear(), d.getMonth(), 1))}
            onSelect={(d) => setParams({ d: dateKey(d) })}
          />
        </div>

        <div className="lg:col-span-5">
          <DailyEditor
            date={selected}
            content={draft}
            status={saveStatus}
            onChange={(v) => {
              setSaveStatus("idle");
              setDraft(v);
            }}
            onSave={() => doSave().catch(() => setSaveStatus("idle"))}
            lastSavedAt={lastSavedAt}
          />
        </div>

        <div className="lg:col-span-3">
          <WeekNotesList
            notes={weekQ.data?.notes ?? []}
            onSelect={(dk) => setParams({ d: dk })}
          />
          <div className="mt-4 text-xs text-zinc-500">
            <Card>
              <div className="p-4">
                <div className="font-semibold text-xs text-zinc-800">Celebrate your life 🎉</div>
                <div className="mt-1 text-[10px]">
                  Happiness is loving what you have and enjoying where you are right now.
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
