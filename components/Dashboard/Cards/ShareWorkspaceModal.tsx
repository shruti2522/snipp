import React, { useEffect, useState } from "react";

export default function ShareWorkspaceModal({
  open,
  loading,
  workspace,
  onClose,
  onConfirm,
}: {
  open: boolean;
  loading: boolean;
  workspace: any | null;
  onClose: () => void;
  onConfirm: (email: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setEmail("");
      setLocalLoading(false);
      setError(null);
    }
  }, [open, workspace]);

  useEffect(() => {
    setLocalLoading(loading);
  }, [loading]);

  if (!open) return null;

  const onSubmit = () => {
    setError(null);
    const e = email.trim();
    if (!e) {
      setError("Please enter an email.");
      return;
    }
    
    if (!/^\S+@\S+\.\S+$/.test(e)) {
      setError("Invalid email address.");
      return;
    }
    onConfirm(e);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-[#1f2028] p-6 rounded-lg w-96 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-white text-lg font-bold">Share workspace</h2>
          <div className="text-sm text-gray-400">{workspace?.name ?? ""}</div>
        </div>

        <label className="text-sm text-gray-300">Collaborator email</label>
        <input
          autoFocus
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSubmit();
            if (e.key === "Escape") onClose();
          }}
          placeholder="user@example.com"
          className="p-2 rounded bg-gray-700 text-white w-full focus:outline-none"
        />
        {error && <div className="text-xs text-red-400">{error}</div>}

        <div className="flex justify-between items-center gap-2">
          <div className="text-xs text-gray-400">User must have an account. To invite non-registered users implement invites.</div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 text-white" onClick={onClose} disabled={localLoading}>
              Cancel
            </button>
            <button className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-500 text-white disabled:opacity-50" onClick={onSubmit} disabled={!email.trim() || localLoading}>
              {localLoading ? "Sharing..." : "Share"}
            </button>
          </div>
        </div>

        {workspace?.sharedWith && Array.isArray(workspace.sharedWith) && (
          <div className="mt-2">
            <div className="text-sm text-gray-300 mb-1">Currently shared with:</div>
            <div className="flex gap-2 flex-wrap">
              {workspace.sharedWith.map((u: any, i: number) => {
                const label = u.email ?? u.name ?? String(u);
                return (
                  <div key={i} className="text-xs bg-gray-700 px-2 py-1 rounded text-white">
                    {label}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
