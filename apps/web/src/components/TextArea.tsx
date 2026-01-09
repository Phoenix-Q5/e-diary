import React from "react";

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm leading-relaxed outline-none focus:border-zinc-400 ${
        props.className ?? ""
      }`}
    />
  );
}
