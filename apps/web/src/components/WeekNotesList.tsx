import React from "react";
import { format, parseISO } from "date-fns";
import { Card, CardBody, CardHeader } from "./Card";
import type { Note } from "../lib/api";

export function WeekNotesList({ notes, onSelect }: { notes: Note[]; onSelect: (dateKey: string) => void }) {
  const withContent = notes.filter((n) => (n.content ?? "").trim().length > 0);

  return (
    <Card>
      <CardHeader title="This Week" subtitle={withContent.length ? `${withContent.length} entries` : "No entries yet"} />
      <CardBody>
        {withContent.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-200 p-4 text-xs text-zinc-600">
            Write something today — your week list will appear here.
          </div>
        ) : (
          <div className="space-y-2 text-xs">
            {withContent.map((n) => {
              const d = parseISO(n.dateKey);
              const title = format(d, "EEE, MMM d");
              const snippet = n.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 120);
              return (
                <button
                  key={n.dateKey}
                  onClick={() => onSelect(n.dateKey)}
                  className="w-full rounded-2xl border border-zinc-200 bg-white p-3 text-left hover:bg-zinc-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold">{title}</div>
                    <div className="text-[10px] text-zinc-500">{n.dateKey}</div>
                  </div>
                  <div className="mt-1 text-xs text-zinc-600">{snippet}{n.content.trim().length > 120 ? "…" : ""}</div>
                </button>
              );
            })}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
