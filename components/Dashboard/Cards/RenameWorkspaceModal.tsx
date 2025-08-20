"use client";

import React, { useEffect, useRef, useState } from "react";

export default function RenameWorkspaceModal({
  open,
  loading,
  currentName,
  onClose,
  onConfirm,
}: {
  open: boolean;
  loading?: boolean;
  currentName?: string | null;
  onClose: () => void;
  onConfirm: (newName: string) => void;
}) {
  const [name, setName] = useState(currentName ?? "");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      setName(currentName ?? "");
      // Focus & select on open
      requestAnimationFrame(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      });
    }
  }, [open, currentName]);

  if (!open) return null;

  const handleSubmit = () => {
    if (loading) return;
    const next = (name ?? "").trim();
    if (!next) return; // simple guard: don't submit empty
    onConfirm(next);
  };

  const isDisabled =
    !!loading || (name ?? "").trim().length === 0 || (name ?? "") === (currentName ?? "");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rename-title"
    >
      <div className="absolute inset-0 bg-black/60" onClick={() => !loading && onClose()} />
      <div className="relative w-full max-w-md bg-[#0E1116] border border-gray-800 rounded-2xl p-4 md:p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 id="rename-title" className="text-lg font-semibold">
              Rename collection
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              Enter a new name for{" "}
              <strong className="text-white">{currentName ?? "this collection"}</strong>.
            </p>
          </div>
          <button
            onClick={() => {
              if (!loading) onClose();
            }}
            className="text-gray-400 hover:text-white outline-none"
            aria-label="Close"
            title="Close"
          >
            ✕
          </button>
        </div>

        <div className="mt-4">
          <label htmlFor="ws-new-name" className="block text-sm text-gray-300 mb-2">
            New name
          </label>
          <input
            id="ws-new-name"
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
              if (e.key === "Escape" && !loading) onClose();
            }}
            className="w-full rounded-lg border border-gray-700 bg-[#0B0E14] px-3 py-2 text-sm outline-none focus:border-gray-500"
            placeholder="Enter new name"
            disabled={!!loading}
            autoComplete="off"
          />
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={() => {
              if (!loading) onClose();
            }}
            className="px-3 py-2 text-sm rounded-lg border border-gray-700 hover:bg-[#1A1D29] outline-none"
            disabled={!!loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-3 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50"
            disabled={isDisabled}
          >
            {loading ? "Renaming..." : "Rename"}
          </button>
        </div>
      </div>
    </div>
  );
}
