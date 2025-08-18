"use client";

import { useEffect, useState } from "react";

export default function EditSnippetModal({
  isOpen,
  onClose,
  snippet,
  onUpdated,
}: {
  isOpen: boolean;
  onClose: () => void;
  snippet: any; // existing snippet object
  onUpdated?: (snippet: any) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("");
  const [tagsInput, setTagsInput] = useState(""); // comma or space separated
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prefill fields when modal opens
  useEffect(() => {
    if (isOpen && snippet) {
      setTitle(snippet.title || "");
      setDescription(snippet.description || "");
      setCode(snippet.code || "");
      setLanguage(snippet.language || "");
      setTagsInput(snippet.tags?.map((t: any) => t.name).join(" ") || "");
      setError(null);
      setSubmitting(false);
    }
  }, [isOpen, snippet]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const parseTags = (raw: string) => {
    return raw
      .split(/[\s,]+/)
      .map((t) => t.trim())
      .filter(Boolean);
  };

  const handleSubmit = async () => {
    setError(null);
    if (!title || !code.trim() || !language.trim()) {
      setError("Title, Code and Language are required.");
      return;
    }

    const payload = {
      title: title,
      description: description.trim() || null,
      code,
      language: language.trim(),
      tags: parseTags(tagsInput),
    } as any;

    try {
      setSubmitting(true);
      const res = await fetch(`/api/snippets/${snippet.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Failed to update snippet");
      }

      const updatedRaw = await res.json();
      const updated = updatedRaw?.snippet ?? updatedRaw?.data ?? updatedRaw;

      const normalized = {
        ...updated,
        content: updated.content ?? updated.code ?? "",
        code: updated.code ?? updated.content ?? "",
        language: updated.language ?? updated.lang ?? language.trim(),
      };

      onUpdated?.(normalized);
      onClose();
    } catch (e: any) {
      console.error(e);
      setError(e?.message || "Failed to update snippet");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-[#0E1116] border border-gray-800 rounded-2xl p-4 md:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Edit Snippet</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        {error && (
          <div className="mb-3 text-sm text-red-400 bg-red-900/20 border border-red-800 rounded p-2">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Title *</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#1A1D29] border border-gray-700 rounded px-3 py-2 text-sm"
                placeholder="Readable title"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Language *</label>
              <input
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-[#1A1D29] border border-gray-700 rounded px-3 py-2 text-sm"
                placeholder="e.g. typescript, python"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-20 bg-[#1A1D29] border border-gray-700 rounded px-3 py-2 text-sm resize-y"
              placeholder="Optional context or usage notes"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Code *</label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-40 bg-[#1A1D29] border border-gray-700 rounded px-3 py-2 text-sm font-mono resize-y"
              placeholder={`Paste your snippet here...`}
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Tags</label>
            <input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full bg-[#1A1D29] border border-gray-700 rounded px-3 py-2 text-sm"
              placeholder="space or comma separated (e.g. auth jwt prisma)"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={onClose}
              className="px-3 py-2 text-sm rounded-lg border border-gray-700 hover:bg-[#1A1D29]"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-3 py-2 text-sm rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? "Updating..." : "Update Snippet"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
