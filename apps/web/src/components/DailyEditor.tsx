import React from "react";
import { format } from "date-fns";
import { Card, CardBody, CardHeader } from "./Card";
import { RichTextEditor } from "./RichTextEditor";
import { Button } from "./Button";

export function DailyEditor({
  date,
  content,
  status,
  onChange,
  onSave,
  lastSavedAt
}: {
  date: Date;
  content: string;
  status: "idle" | "saving" | "saved";
  onChange: (v: string) => void;
  onSave: () => void;
  lastSavedAt: Date | null;
}) {
  const title = format(date, "EEEE, MMMM d, yyyy");
  const empty = content.trim().length === 0;

  return (
    <Card>
      <CardHeader
        title={title}
        subtitle={empty ? "No entry yet for this day" : status === "saving" ? "Saving…" : status === "saved" ? "Saved" : "Edit your note"}
        right={
          <div className="flex items-center gap-2">
            {lastSavedAt ? <div className="hidden text-[9px] text-zinc-500 sm:block">Saved at {format(lastSavedAt, "p")}</div> : null}
            <Button onClick={onSave} disabled={status === "saving"}>
              Save
            </Button>
          </div>
        }
      />
      <CardBody>
        <RichTextEditor
          placeholder="Write what happened today…"
          value={content}
          onChange={onChange}
        />
        <div className="mt-3 text-[8px] text-zinc-500">
          Tip: Keep it simple. A few lines a day adds up fast.
        </div>
      </CardBody>
    </Card>
  );
}
