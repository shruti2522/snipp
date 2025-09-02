"use client";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { useState, useEffect } from "react";
import { FiCopy, FiEdit, FiCheck } from "react-icons/fi";

export default function CodePreview({
  snippet,
  onUpdated,
}: {
  snippet: any | null;
  onUpdated?: (s: any) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCode, setEditedCode] = useState<string>(snippet?.code ?? "");
  const [saving, setSaving] = useState(false);
  const [localSnippet, setLocalSnippet] = useState<any | null>(snippet ?? null);

  useEffect(() => {
    setLocalSnippet(snippet ?? null);
    if (!isEditing) setEditedCode(snippet?.code ?? "");
  }, [snippet, isEditing]);

  const handleCopy = async () => {
    const codeToCopy = isEditing ? editedCode : localSnippet?.code ?? snippet?.code;
    if (!codeToCopy) return;
    await navigator.clipboard.writeText(codeToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedCode(localSnippet?.code ?? snippet?.code ?? "");
  };

  const fetchLatestSnippet = async (id: any) => {
    try {
      const r = await fetch(`/api/snippets/${id}`);
      if (!r.ok) {
        return null;
      }
      const j = await r.json().catch(() => null);
      return j;
    } catch (e) {
      return null;
    }
  };

  const emitUpdate = (updated: any) => {
    console.debug("[CodePreview] emitUpdate -> calling onUpdated/window events with:", updated);
    try {
      if (typeof onUpdated === "function") {
        try {
          onUpdated(updated);
        } catch (e) {
          console.warn("[CodePreview] dispatchEvent failed:", e);
        }
      }

      try {
        window.dispatchEvent(new CustomEvent("snippet-updated", { detail: updated }));
      } catch (e) {
        console.warn("[CodePreview] dispatchEvent failed:", e);
      }

      try {
        // postMessage so it appears in parent frames if applicable
        window.postMessage?.({ type: "snippet-updated", payload: updated }, "*");
      } catch (e) {
        console.warn("[CodePreview] postMessage failed:", e);
      }
    } catch (e) {
      console.warn("[CodePreview] emitUpdate outer error:", e);
    }
  };

  const handleSaveClick = async () => {
    if (!localSnippet) {
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/snippets/${localSnippet.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: editedCode }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => null);
        console.error("[CodePreview] PATCH not ok body:", text);
        throw new Error(text || `Request failed with status ${res.status}`);
      }

      // Try parse JSON, fallback to GET if nothing useful returned
      let updated: any = null;
      try {
        updated = await res.json();
      } catch (e) {
        updated = null;
      }

      if (!updated) {
        updated = await fetchLatestSnippet(localSnippet.id);
      }

      // Guarantee id stays the same type as localSnippet.id to avoid mismatches
      const merged = { ...localSnippet, ...(updated ?? {}), id: localSnippet.id };

      console.debug("[CodePreview] merged object (to be emitted):", merged, "types:", {
        localIdType: typeof localSnippet.id,
        mergedIdType: typeof merged.id,
      });

      // Update UI immediately
      setLocalSnippet(merged);
      if (merged?.code !== undefined) setEditedCode(merged.code);
      setIsEditing(false);

      emitUpdate(merged);
    } catch (err: any) {
      console.error("[CodePreview] Save failed:", err);
      alert(`Save failed: ${err?.message ?? err}`);
    } finally {
      setSaving(false);
    }
  };

  if (!localSnippet) {
    return (
      <section className="h-full p-6 overflow-y-auto bg-[#141820] flex items-center justify-center">
      <div className="flex flex-col items-center text-gray-400">
        <p className="text-sm">Select a snippet to view details</p>
      </div>
    </section>
    );
  }

  return (
    <section className="h-full p-6 overflow-y-auto bg-[#141820]">
      <h2 className="text-xl font-bold">{localSnippet.title}</h2>
      <p className="text-gray-400 text-sm">{localSnippet.description}</p>

      <div className="mt-3 flex gap-2 flex-wrap">
        {(localSnippet.tags ?? []).map((tag: any) => (
          <span key={tag.id ?? tag.name} className="px-2 py-0.5 text-xs bg-purple-600/20 text-purple-400 rounded">
            {tag.name}
          </span>
        ))}
      </div>

      <div className="mt-4 rounded-lg bg-[#0f131a] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 text-xs font-mono text-gray-400">
          <span className="lowercase tracking-wide">{localSnippet.language || "plaintext"}</span>
          <div className="flex items-center gap-2">
            <button onClick={handleCopy} className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/5 transition">
              
              {copied ? (
                <>
                  <FiCheck size={14} /> Copied
                </>
              ) : (
                <>
                  <FiCopy size={14} /> Copy
                </>
              )}
            </button>

            {!isEditing ? (
              <button onClick={handleEditClick} className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/5 transition">
                <FiEdit size={14} />
                Edit
              </button>
            ) : (
              <button onClick={handleSaveClick} disabled={saving} className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/5 transition">
                <FiEdit size={14} />
                {saving ? "Saving..." : "Save"}
              </button>
            )}
          </div>
        </div>

        <div className="max-h-[400px] overflow-auto clean-syntax">
          {!isEditing ? (
            <SyntaxHighlighter
              language={localSnippet.language}
              style={oneDark}
              showLineNumbers={false}
              wrapLongLines={false}
              customStyle={{
                margin: 0,
                padding: "1rem 1.2rem",
                background: "transparent",
                boxShadow: "none",
                border: "none",
                fontSize: "0.9rem",
                lineHeight: "1.55",
                minWidth: "100%",
              }}
              codeTagProps={{
        style: { background: "transparent" },
      }}
            >
              {localSnippet.code ?? ""}
            </SyntaxHighlighter>
          ) : (
            <textarea
              value={editedCode}
              onChange={(e) => setEditedCode(e.target.value)}
              className="w-full min-h-[200px] p-4 font-mono text-sm leading-6 resize-none"
              style={{
                background: "transparent",
                boxShadow: "none",
                border: "none",
                outline: "none",
                padding: "1rem 1.2rem",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Courier New', monospace",
                tabSize: 2,
                whiteSpace: "pre",
              }}
            />
          )}
        </div>
      </div>

      {/* force remove unwanted grey borders but keep scrollbar */}
      <style jsx>{`
        .clean-syntax :global(pre) {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
      `}</style>
    </section>
  );
}
