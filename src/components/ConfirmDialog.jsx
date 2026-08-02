import { useEffect } from "react";

/**
 * Reusable confirmation dialog.
 * Props:
 *   open        – boolean, whether to show
 *   title       – dialog heading
 *   message     – body text
 *   confirmText – label for the confirm button (default "Confirm")
 *   cancelText  – label for the cancel button (default "Cancel")
 *   variant     – "danger" | "warning" | "success" (default "warning")
 *   onConfirm   – callback when user confirms
 *   onCancel    – callback when user cancels / closes
 */
export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  message = "",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "warning",
  onConfirm,
  onCancel,
}) {
  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") onCancel?.(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onCancel]);

  if (!open) return null;

  const colors = {
    danger:  { icon: "🗑️",  accent: "var(--accent-rose)",   btn: "#e11d48" },
    warning: { icon: "⚠️",  accent: "var(--accent-amber)",  btn: "#d97706" },
    success: { icon: "💾",  accent: "var(--accent-green)",  btn: "#059669" },
  };
  const c = colors[variant] ?? colors.warning;

  return (
    /* Backdrop */
    <div
      onClick={onCancel}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(11,18,32,0.65)",
        backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        animation: "fadeIn 150ms ease",
      }}
    >
      {/* Card – stop click from bubbling to backdrop */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--surface)",
          borderRadius: "16px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.22)",
          padding: "2rem",
          maxWidth: "420px",
          width: "90%",
          animation: "slideUp 200ms cubic-bezier(0.4,0,0.2,1)",
          borderTop: `4px solid ${c.accent}`,
        }}
      >
        {/* Icon + title */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
          <span style={{ fontSize: "1.75rem" }}>{c.icon}</span>
          <h2 style={{ margin: 0, fontSize: "1.1rem", color: "var(--text-primary)", fontWeight: 700 }}>
            {title}
          </h2>
        </div>

        {/* Message */}
        {message && (
          <p style={{ margin: "0 0 1.5rem", color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6 }}>
            {message}
          </p>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "0.6rem 1.25rem",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              background: "var(--surface-soft)",
              color: "var(--text-secondary)",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              padding: "0.6rem 1.25rem",
              borderRadius: "8px",
              border: "none",
              background: c.btn,
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.9rem",
              boxShadow: `0 4px 14px ${c.accent}55`,
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
