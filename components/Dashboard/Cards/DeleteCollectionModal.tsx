"use client";

import React from "react";

export default function DeleteCollectionModal({
  open,
  loading,
  collectionName,
  onClose,
  onConfirm,
}: {
  open: boolean;
  loading?: boolean;
  collectionName?: string | null;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0E1116] border border-gray-800 rounded-2xl p-4 md:p-6 shadow-xl select-none caret-transparent">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Delete collection</h3>
            <p className="text-sm text-gray-400 mt-1">
              Are you sure you want to delete{" "}
              <strong className="text-white select-none">{collectionName}</strong>? This action cannot be undone.
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

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={() => {
              if (!loading) onClose();
            }}
            className="px-3 py-2 text-sm rounded-lg border border-gray-700 hover:bg-[#1A1D29] outline-none"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (!loading) onConfirm();
            }}
            className="px-3 py-2 text-sm rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
