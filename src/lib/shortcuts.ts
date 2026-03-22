/**
 * Keyboard shortcut handler for desktop (Electron) and web.
 *
 * Shortcuts:
 *   F2  — Navigate to order entry
 *   F5  — Refresh data (invalidate React Query cache)
 *   Escape — Close any open detail panel
 */

type ShortcutHandler = (action: string) => void;

let handler: ShortcutHandler | null = null;

export function registerShortcuts(onAction: ShortcutHandler): () => void {
  handler = onAction;

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "F2") {
      e.preventDefault();
      handler?.("new-order");
    }
    if (e.key === "F5") {
      e.preventDefault();
      handler?.("refresh");
    }
    if (e.key === "Escape") {
      handler?.("close");
    }
  }

  // Listen for Electron custom events
  function onOmsShortcut(e: Event) {
    const detail = (e as CustomEvent).detail as string;
    handler?.(detail);
  }

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("oms-shortcut", onOmsShortcut);

  return () => {
    handler = null;
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("oms-shortcut", onOmsShortcut);
  };
}
