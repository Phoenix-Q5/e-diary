import React from "react";
import { useAuth } from "../state/auth";
import myImage from "../assets/bhavyanth.png";
import defaultImage from "../assets/defImage.png";

export function Shell({ children }: { children: React.ReactNode }) {
  const { state } = useAuth();
  const isAuthed = state.status === "authed";
  const headerImg = isAuthed ? myImage : defaultImage;
  const headerTitle = isAuthed ? "Bhavyanth's Diary" : "E-Diary";
  const headerSubtitle = isAuthed ? "My daily notes" : "Write your daily notes with privacy!";
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
  <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
    <div className="flex items-center gap-2">
      <img
        src={headerImg}
        alt="icon"
        className="h-8 w-8 rounded-xl object-cover"
      />

      <div>
        <div className="text-sm font-semibold leading-tight">{headerTitle}</div>
        <div className="text-[9px] text-zinc-500 leading-tight">{headerSubtitle}</div>
      </div>
    </div>

    <div className="text-sm text-zinc-600">
      {isAuthed ? (
        <span>
          {state.user.firstName} {state.user.lastName}
        </span>
      ) : (
        <span>Welcome</span>
      )}
    </div>
  </div>
</header>

      <main className="flex-1 mx-auto max-w-6xl px-4 py-6 w-full">
        {children}
      </main>

      <footer className="border-t bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-2 text-[8px] text-center text-zinc-500">
          © {new Date().getFullYear()} E Diary • Built with React, Tailwind, Express and MongoDB
        </div>
      </footer>
    </div>
  );
}