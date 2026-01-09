import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "./Button";

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write what happened today…"
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false }
      }),
      Placeholder.configure({ placeholder })
    ],
    content: value || "",

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    }
  });

  React.useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (current !== (value || "")) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return null;

  const Tool = ({ active, onClick, children }: any) => (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-xl border px-3 py-0.5 text-[8px] font-medium transition",
        active ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 bg-white hover:bg-zinc-50"
      ].join(" ")}
    >
      {children}
    </button>
  );

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Tool
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          Bold
        </Tool>

        <Tool
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          Italic
        </Tool>

        <Tool
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • List
        </Tool>

        <Tool
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. List
        </Tool>

        <Tool
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          Quote
        </Tool>

        <Tool
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </Tool>

        <button
          type="button"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          className="rounded-xl border border-zinc-200 bg-white px-3 py-1 text-[8px] font-medium hover:bg-red-300"
        >
          Clear
        </button>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-xs">
        <EditorContent
          editor={editor}
          className="prose prose-zinc max-w-none focus:outline-none"
        />
      </div>
    </div>
  );
}
