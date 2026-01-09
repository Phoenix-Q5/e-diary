import React from "react";
import { format, addMonths, subMonths, isToday, startOfDay, isAfter, startOfMonth, isSameMonth } from "date-fns";
import { monthGrid, monthKey, dateKey, isInMonth } from "../lib/dates";
import { Card, CardBody, CardHeader } from "./Card";
import { Button } from "./Button";

export function CalendarNavigator({
  month,
  selected,
  entryDays,
  onChangeMonth,
  onSelect
}: {
  month: Date;
  selected: Date;
  entryDays: Set<string>;
  onChangeMonth: (d: Date) => void;
  onSelect: (d: Date) => void;
}) {
  const days = monthGrid(month);
  const wk = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = new Date();
  const isCurrentMonth = isSameMonth(month, today);
  const isFutureMonth = isAfter(startOfMonth(month), startOfMonth(today));

  return (
    <Card>
      <CardHeader
        title="Calendar"
        subtitle={format(month, "MMMM yyyy")}
        right={
          <div className="flex gap-1">
            <Button
              variant="ghost"
              onClick={() => onChangeMonth(subMonths(month, 1))}
              aria-label="Previous month"
            >
              ←
            </Button>

            <Button
              variant="ghost"
              disabled={isCurrentMonth}
              onClick={() => onChangeMonth(addMonths(month, 1))}
              aria-label="Next month"
              className={isCurrentMonth ? "opacity-40 cursor-not-allowed" : ""}
            >
              →
            </Button>
          </div>
        }
      />
      <CardBody>
        <div className="grid grid-cols-7 gap-1 text-xs text-zinc-500">
          {wk.map((d) => (
            <div key={d} className="pb-1 text-center">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((d) => {
            const dk = dateKey(d);
            const disabled = isAfter(startOfDay(d), startOfDay(new Date()));
            const inMonth = isInMonth(d, month);
            const hasEntry = entryDays.has(dk);
            const sel = dateKey(d) === dateKey(selected);
            return (
              <button
                key={dk}
                disabled={disabled}
                onClick={() => !disabled && onSelect(d)}
                className={[
                  "relative h-8 w-8 rounded-xl border text-xs transition",
                  inMonth ? "border-zinc-200 bg-white" : "border-transparent bg-zinc-50 text-zinc-400",
                  sel ? "ring-2 ring-zinc-900" : "",
                  isToday(d) ? "font-semibold" : "",
                  disabled
                    ? "cursor-not-allowed opacity-40"
                    : "hover:bg-zinc-100"
                ].join(" ")}
              >
                <span className="inline-flex items-center justify-center">{format(d, "d")}</span>
                {hasEntry ? (
                  <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-zinc-900" />
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex items-center justify-between text-[9px] text-zinc-500">
          <div>Dots indicate days with notes.</div>
          <div className="tabular-nums">{monthKey(month)}</div>
        </div>
      </CardBody>
    </Card>
  );
}
