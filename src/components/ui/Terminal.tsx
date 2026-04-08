"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTheme, FONT_PRESETS } from "@/context/ThemeContext";

interface HistoryEntry {
  type: "input" | "output" | "error" | "system";
  text: string;
}

const ROUTES: Record<string, string> = {
  home: "/",
  team: "/team",
  projects: "/projects",
  events: "/events",
  resources: "/resources",
  join: "/join",
};

const MOTD = [
  "SOCS Terminal v2.0.0 — Society of Cyber Security",
  'Type "help" for available commands.',
  "",
];

export function Terminal() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    theme,
    setThemePrimary,
    setThemeSecondary,
    setThemeBackground,
    setThemeFont,
    resetTheme,
  } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>(
    MOTD.map((t) => ({ type: "system", text: t }))
  );
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [cmdHistoryIdx, setCmdHistoryIdx] = useState(-1);

  // Position & size
  const [pos, setPos] = useState({ x: 20, y: 80 });
  const [size, setSize] = useState({ w: 560, h: 360 });
  const [isMinimized, setIsMinimized] = useState(false);

  // Drag state
  const dragging = useRef(false);

  // Resize state
  const resizing = useRef(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new history
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input when terminal opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  // Listen for navbar TERM button
  useEffect(() => {
    const handle = () => setIsOpen(prev => !prev);
    window.addEventListener("toggle-terminal", handle);
    return () => window.removeEventListener("toggle-terminal", handle);
  }, []);


  // Current directory label from pathname
  const currentDir = useCallback(() => {
    const entry = Object.entries(ROUTES).find(([, v]) => v === pathname);
    return entry ? entry[0] : pathname.replace("/", "") || "home";
  }, [pathname]);

  // ── Theme sub-command processor ────────────────────────────────────────
  const processThemeCommand = useCallback(
    (subCmd: string, args: string[]): HistoryEntry[] => {
      const out: HistoryEntry[] = [];

      switch (subCmd) {
        case "set-primary":
        case "primary": {
          const color = args.join(" ");
          if (!color) {
            out.push({ type: "error", text: "usage: theme primary <color>" });
            out.push({ type: "system", text: "example: theme primary #ff0040" });
            break;
          }
          const err = setThemePrimary(color);
          if (err) {
            out.push({ type: "error", text: err });
          } else {
            out.push({ type: "system", text: `✓ primary color → ${color}` });
            out.push({ type: "system", text: "accent color updated across the site." });
          }
          break;
        }

        case "set-secondary":
        case "secondary": {
          const color = args.join(" ");
          if (!color) {
            out.push({ type: "error", text: "usage: theme secondary <color>" });
            break;
          }
          const err = setThemeSecondary(color);
          if (err) {
            out.push({ type: "error", text: err });
          } else {
            out.push({ type: "system", text: `✓ secondary color → ${color}` });
          }
          break;
        }

        case "set-bg":
        case "bg":
        case "background": {
          const color = args.join(" ");
          if (!color) {
            out.push({ type: "error", text: "usage: theme bg <color>" });
            break;
          }
          const err = setThemeBackground(color);
          if (err) {
            out.push({ type: "error", text: err });
          } else {
            out.push({ type: "system", text: `✓ background color → ${color}` });
          }
          break;
        }

        case "set-font":
        case "font": {
          const fontKey = args[0];
          if (!fontKey) {
            out.push({ type: "error", text: "usage: theme font <name>" });
            out.push({
              type: "system",
              text: `available: ${Object.keys(FONT_PRESETS).join(", ")}`,
            });
            break;
          }
          const err = setThemeFont(fontKey);
          if (err) {
            out.push({ type: "error", text: err });
          } else {
            const label = FONT_PRESETS[fontKey.toLowerCase()]?.label ?? fontKey;
            out.push({ type: "system", text: `✓ font → ${label}` });
          }
          break;
        }

        case "list-fonts":
        case "fonts": {
          const lines = [
            "┌─ Available Fonts ───────────────────────────┐",
            ...Object.entries(FONT_PRESETS).map(
              ([key, { label }]) =>
                `│  ${key.padEnd(12)} ${label.padEnd(26)} │`
            ),
            "└─────────────────────────────────────────────┘",
          ];
          out.push({ type: "system", text: lines.join("\n") });
          break;
        }

        case "status": {
          const fontLabel =
            Object.entries(FONT_PRESETS).find(
              ([, v]) => v.cssVar === theme.font
            )?.[1]?.label ?? theme.font;
          out.push({
            type: "system",
            text: [
              "┌─ Current Theme ─────────────────────────────┐",
              `│  primary    ${theme.primary.padEnd(32)} │`,
              `│  secondary  ${theme.secondary.padEnd(32)} │`,
              `│  background ${theme.background.padEnd(32)} │`,
              `│  font       ${fontLabel.slice(0, 32).padEnd(32)} │`,
              "└─────────────────────────────────────────────┘",
            ].join("\n"),
          });
          break;
        }

        case "reset": {
          resetTheme();
          out.push({ type: "system", text: "✓ theme reset to defaults." });
          break;
        }

        default: {
          out.push({ type: "error", text: `theme: unknown sub-command: ${subCmd}` });
          out.push({
            type: "system",
            text: [
              "usage: theme <sub-command> [args]",
              "",
              "  primary <color>      set primary accent color",
              "  secondary <color>    set secondary color",
              "  bg <color>           set background color",
              "  font <name>          set site font",
              "  fonts                list available fonts",
              "  status               show current theme",
              "  reset                revert to defaults",
            ].join("\n"),
          });
        }
      }

      return out;
    },
    [
      theme,
      setThemePrimary,
      setThemeSecondary,
      setThemeBackground,
      setThemeFont,
      resetTheme,
    ]
  );

  // ── Command processor ──────────────────────────────────────────────────
  const processCommand = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed) return;

      const newHistory: HistoryEntry[] = [
        { type: "input", text: `socs@${currentDir()} ~$ ${trimmed}` },
      ];

      const parts = trimmed.split(/\s+/);
      const cmd = parts[0].toLowerCase();
      const rest = parts.slice(1);
      const arg = rest.join(" ").toLowerCase();

      switch (cmd) {
        case "cd": {
          if (!arg) {
            newHistory.push({ type: "error", text: "usage: cd <page>" });
            newHistory.push({
              type: "system",
              text: `available: ${Object.keys(ROUTES).join(", ")}`,
            });
          } else {
            const target = arg.replace(/^\//, "").replace(/\/$/, "");
            const route = ROUTES[target];
            if (route) {
              if (route === pathname) {
                newHistory.push({
                  type: "system",
                  text: `already at /${target}`,
                });
              } else {
                newHistory.push({
                  type: "system",
                  text: `navigating to /${target}...`,
                });
                setTimeout(() => router.push(route), 150);
              }
            } else {
              newHistory.push({
                type: "error",
                text: `cd: no such page: ${arg}`,
              });
              newHistory.push({
                type: "system",
                text: `available: ${Object.keys(ROUTES).join(", ")}`,
              });
            }
          }
          break;
        }

        case "ls": {
          newHistory.push({
            type: "system",
            text: Object.entries(ROUTES)
              .map(
                ([name, route]) =>
                  `  ${route === pathname ? "▸ " : "  "}${name.padEnd(12)} ${route}`
              )
              .join("\n"),
          });
          break;
        }

        case "pwd": {
          newHistory.push({ type: "system", text: pathname });
          break;
        }

        case "clear": {
          setHistory([]);
          return;
        }

        case "theme": {
          const subCmd = rest[0]?.toLowerCase();
          const subArgs = rest.slice(1);
          if (!subCmd) {
            // show theme status by default
            const entries = processThemeCommand("status", []);
            newHistory.push(...entries);
          } else {
            newHistory.push(...processThemeCommand(subCmd, subArgs));
          }
          break;
        }

        case "help": {
          newHistory.push({
            type: "system",
            text: [
              "┌─ SOCS Terminal Commands ─────────────────────────────────────────┐",
              "│                                                                  │",
              "│  Navigation                                                      │",
              "│    cd <page>           navigate to a page                        │",
              "│    ls                  list all pages                            │",
              "│    pwd                 print current path                        │",
              "│                                                                  │",
              "│  Theme Customization                                             │",
              "│    theme               show current theme                        │",
              "│    theme primary <c>   set primary accent color                  │",
              "│    theme secondary <c> set secondary color                       │",
              "│    theme bg <c>        set background color                      │",
              "│    theme font <name>   set site font                             │",
              "│    theme fonts         list available fonts                      │",
              "│    theme reset         revert to defaults                        │",
              "│                                                                  │",
              "│  Misc                                                            │",
              "│    whoami              who are you?                              │",
              "│    clear               clear terminal                            │",
              "│    exit / quit         close terminal                            │",
              "│                                                                  │",
              "└──────────────────────────────────────────────────────────────────┘",
            ].join("\n"),
          });
          break;
        }

        case "whoami": {
          newHistory.push({ type: "system", text: "guest@socs-network" });
          break;
        }

        case "exit":
        case "quit": {
          newHistory.push({ type: "system", text: "terminal closed." });
          setTimeout(() => setIsOpen(false), 200);
          break;
        }

        default: {
          newHistory.push({
            type: "error",
            text: `command not found: ${cmd}`,
          });
          newHistory.push({
            type: "system",
            text: 'type "help" for available commands.',
          });
        }
      }

      setHistory((prev) => [...prev, ...newHistory]);
    },
    [currentDir, pathname, router, processThemeCommand]
  );

  // ── Key handler ────────────────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        processCommand(input);
        if (input.trim()) {
          setCmdHistory((prev) => [input, ...prev]);
        }
        setCmdHistoryIdx(-1);
        setInput("");
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setCmdHistoryIdx((prev) => {
          const next = Math.min(prev + 1, cmdHistory.length - 1);
          if (cmdHistory[next]) setInput(cmdHistory[next]);
          return next;
        });
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setCmdHistoryIdx((prev) => {
          const next = Math.max(prev - 1, -1);
          setInput(next < 0 ? "" : cmdHistory[next] || "");
          return next;
        });
      }
    },
    [input, cmdHistory, processCommand]
  );

  // ── Drag handlers ──────────────────────────────────────────────────────
  const onDragStart = useCallback(
    (e: React.MouseEvent) => {
      const startX = e.clientX;
      const startY = e.clientY;
      const initialPos = { x: pos.x, y: pos.y };

      dragging.current = true;
      document.body.style.cursor = "grabbing";
      document.body.style.userSelect = "none";

      const onMove = (ev: MouseEvent) => {
        if (!dragging.current) return;
        setPos({
          x: Math.max(0, Math.min(window.innerWidth - 100, initialPos.x + ev.clientX - startX)),
          y: Math.max(0, Math.min(window.innerHeight - 40, initialPos.y + ev.clientY - startY)),
        });
      };

      const onUp = () => {
        dragging.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [pos.x, pos.y]
  );

  // ── Resize handlers ────────────────────────────────────────────────────
  const onResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const startX = e.clientX;
      const startY = e.clientY;
      const initialSize = { w: size.w, h: size.h };

      resizing.current = true;
      document.body.style.cursor = "nwse-resize";
      document.body.style.userSelect = "none";

      const onMove = (ev: MouseEvent) => {
        if (!resizing.current) return;
        setSize({
          w: Math.max(380, initialSize.w + ev.clientX - startX),
          h: Math.max(200, initialSize.h + ev.clientY - startY),
        });
      };

      const onUp = () => {
        resizing.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [size.w, size.h]
  );

  // ── Global keyboard shortcut: Ctrl+` to toggle ────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "`" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // ── Colour swatch helper ───────────────────────────────────────────────
  // Renders a tiny inline colour dot for input-type entries that set a color
  const renderLine = (entry: HistoryEntry, i: number) => {
    const colorMatch = entry.text.match(/→\s*(#[0-9a-fA-F]{3,8}|[a-z]+\([^)]+\)|[a-z]{3,})\s*$/);
    return (
      <div
        key={i}
        className={`whitespace-pre-wrap flex items-start gap-1 ${
          entry.type === "input"
            ? "text-primary"
            : entry.type === "error"
              ? "text-red-400"
              : entry.type === "system"
                ? "text-gray-400"
                : "text-white"
        }`}
      >
        <span>{entry.text}</span>
        {colorMatch && entry.type === "system" && (
          <span
            className="inline-block w-3 h-3 rounded-sm shrink-0 mt-[3px] border border-white/10"
            style={{ backgroundColor: colorMatch[1] }}
          />
        )}
      </div>
    );
  };

  // ── Toggle button (always visible) ────────────────────────────────────
  const toggleButton = (
    <button
      onClick={() => {
        setIsOpen((p) => !p);
        setIsMinimized(false);
      }}
      data-terminal
      className="fixed bottom-5 right-5 z-[100000] border border-primary/50 bg-neutral/90 backdrop-blur-md text-primary font-mono text-sm px-3 py-2 hover:bg-primary/10 hover:border-primary hover:shadow-[0_0_12px_rgba(200,255,0,0.3)] transition-all duration-200"
      title="Toggle Terminal (Ctrl+`)"
    >
      {isOpen ? "✕ TERM" : ">_ TERM"}
    </button>
  );

  if (!isOpen) return toggleButton;

  return (
    <>
      {toggleButton}

      {/* Terminal window */}
      <div
        data-terminal
        className="fixed"
        style={{
          left: pos.x,
          top: pos.y,
          width: isMinimized ? 260 : size.w,
          height: isMinimized ? "auto" : size.h,
          zIndex: 100001,
        }}
      >
        {/* ── Title bar (draggable) ──────────────────────────────────────── */}
        <div
          onMouseDown={onDragStart}
          className="flex items-center justify-between h-8 bg-[#0a0a0f] border border-b-0 border-primary/30 px-3 select-none"
          style={{ cursor: "move" }}
        >
          <div className="flex items-center gap-2 text-[10px]">
             <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 cursor-pointer" onClick={() => setIsOpen(false)} />
             <span
               className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 cursor-pointer"
               onClick={() => setIsMinimized((p) => !p)}
             />
             <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          </div>
          <span className="font-mono text-[10px] text-primary/60 tracking-[0.3em] uppercase select-none">
            socs@{currentDir()}
          </span>
          <div className="w-12" />
        </div>

        {/* ── Terminal body ──────────────────────────────────────────────── */}
        {!isMinimized && (
          <div
            className="relative bg-[#07070c]/95 backdrop-blur-lg border border-primary/20 flex flex-col overflow-hidden"
            style={{ height: `calc(100% - 32px)` }}
            onClick={() => inputRef.current?.focus()}
          >
            {/* Scanline effect */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.03]"
              style={{
                background:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(200,255,0,0.08) 2px, rgba(200,255,0,0.08) 4px)",
              }}
            />

            {/* Scrollable output */}
            <div
              ref={scrollRef}
              data-lenis-prevent
              className="flex-1 overflow-y-auto overflow-x-hidden p-3 pb-10 font-mono text-[13px] leading-relaxed relative z-[1] select-text"
              style={{ scrollbarWidth: "thin", scrollbarColor: "#C8FF00 transparent" }}
            >
              {history.map((entry, i) => renderLine(entry, i))}

              {/* Input line */}
              <div className="flex items-center mt-1">
                <span className="text-primary/70 mr-2 shrink-0">
                  socs@{currentDir()} ~$
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent text-primary outline-none border-none caret-primary font-mono text-[13px]"
                  spellCheck={false}
                  autoComplete="off"
                  autoFocus
                />
              </div>
            </div>

            {/* ── Resize handle ──────────────────────────────────────────── */}
            <div
              onMouseDown={onResizeStart}
              className="absolute bottom-1 right-1 w-6 h-6 cursor-nwse-resize opacity-40 hover:opacity-100 transition-all duration-200 z-[10]"
              style={{
                background: `linear-gradient(135deg, transparent 65%, var(--color-primary) 65%)`,
              }}
            >
              <div className="absolute bottom-1 right-1 w-3 h-[2px] bg-primary/40 rotate-[-45deg] origin-right" />
              <div className="absolute bottom-[6px] right-[6px] w-1.5 h-[1.5px] bg-primary/40 rotate-[-45deg] origin-right" />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
