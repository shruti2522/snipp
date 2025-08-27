"use client";

import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { signIn, signOut, useSession } from "next-auth/react";
import DeleteWorkspaceModal from "./Cards/DeleteWorkspaceModal";
import RenameWorkspaceModal from "./Cards/RenameWorkspaceModal";

export default function Workspaces({
  workspaces,
  selectedWorkspace,
  onSelectWorkspace,
  onAddWorkspace,
  onWorkspaceCreated,
}: {
  workspaces: any[];
  selectedWorkspace: number | null;
  onSelectWorkspace: (id: number | null) => void;
  onAddWorkspace: () => void;
  onWorkspaceCreated?: (ws: any) => void;
}) {
  const { data: session } = useSession();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");

  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    workspace: any | null;
  }>({ visible: false, x: 0, y: 0, workspace: null });

  const [profileMenu, setProfileMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
  }>({ visible: false, x: 0, y: 0 });

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    workspace: any | null;
    loading: boolean;
  }>({ open: false, workspace: null, loading: false });

  const [renameModal, setRenameModal] = useState<{
    open: boolean;
    workspace: any | null;
    loading: boolean;
  }>({ open: false, workspace: null, loading: false });

  const gradients = [
    "from-indigo-900 to-purple-800",
    "from-purple-900 to-pink-800",
    "from-green-700 to-indigo-800",
    "from-blue-900 to-purple-900",
    "from-violet-800 to-fuchsia-900",
    "from-emerald-800 to-blue-900",
    "from-purple-800 to-rose-900",
    "from-teal-800 to-indigo-900",
    "from-indigo-900 to-pink-900",
    "from-slate-900 to-indigo-800",
    "from-red-900 to-purple-900",
    "from-violet-900 to-purple-800",
    "from-green-800 to-cyan-800",
    "from-fuchsia-900 to-indigo-900",
    "from-amber-900 to-red-900",
    "from-gray-900 to-blue-800",
  ];

  // Normalize workspaces to an array (defensive)
  const wsList = Array.isArray(workspaces) ? workspaces : [];

  // helper to normalize id to number|null
  const normalizeId = (id: any): number | null => {
    if (id === null || id === undefined) return null;
    if (typeof id === "number") return id;
    const n = Number(id);
    return Number.isNaN(n) ? null : n;
  };

  // helper to handle auth responses
  const handleAuthError = async (res: Response) => {
    if (res.status === 401) {
      // not signed in — prompt sign in
      await signIn();
      return true;
    }
    if (res.status === 403) {
      console.warn("Forbidden (403) — you don't have permission to perform this action.");
      return true;
    }
    return false;
  };

  // --- CREATE WORKSPACE ---
  const createWorkspace = async () => {
    if (!newWorkspaceName.trim()) return;
    try {
      const res = await fetch("/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin", // important: send auth cookie
        body: JSON.stringify({ name: newWorkspaceName.trim() }),
      });

      if (await handleAuthError(res)) return;

      const data = await res.json().catch(() => null);
      if (res.ok) {
        setIsModalOpen(false);
        setNewWorkspaceName("");
        closeContextMenu();
        onWorkspaceCreated?.(data); // pass created workspace back to parent
      } else {
        console.error("Error creating workspace:", data || res.statusText);
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  // --- OPEN RENAME MODAL ---
  const openRenameModal = (workspace: any) => {
    setRenameModal({ open: true, workspace, loading: false });
    closeContextMenu();
  };

  // --- CONFIRM RENAME ---
  const handleRenameConfirm = async (newName: string) => {
    if (!renameModal.workspace) return;
    const id = normalizeId(renameModal.workspace.id);
    if (id === null) {
      console.error("Invalid workspace id for rename");
      return;
    }

    setRenameModal((prev) => ({ ...prev, loading: true }));
    try {
      // Use PUT with query param to match the server route (/api/workspaces?id=)
      const res = await fetch(`/api/workspaces?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ name: newName.trim() }),
      });

      if (await handleAuthError(res)) {
        setRenameModal((prev) => ({ ...prev, loading: false }));
        return;
      }

      const updated = await res.json().catch(() => null);
      if (res.ok) {
        onWorkspaceCreated?.(updated); // parent can merge/update the list
        setRenameModal({ open: false, workspace: null, loading: false });
      } else {
        console.error("Failed to rename workspace:", updated?.error || updated || res.statusText);
        setRenameModal((prev) => ({ ...prev, loading: false }));
      }
    } catch (err) {
      console.error(err);
      setRenameModal((prev) => ({ ...prev, loading: false }));
    }
  };

  // --- DELETE WORKSPACE ---
  const confirmDeleteWorkspace = (workspace: any) => {
    setDeleteModal({ open: true, workspace, loading: false });
    closeContextMenu();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.workspace) return;
    const id = normalizeId(deleteModal.workspace.id);
    if (id === null) {
      console.error("Invalid workspace id for delete");
      return;
    }

    setDeleteModal((prev) => ({ ...prev, loading: true }));
    try {
      // Use DELETE with query param to match the server route (/api/workspaces?id=)
      const res = await fetch(`/api/workspaces?id=${id}`, {
        method: "DELETE",
        credentials: "same-origin",
      });

      if (await handleAuthError(res)) {
        setDeleteModal((prev) => ({ ...prev, loading: false }));
        return;
      }

      if (res.ok) {
        // Inform parent that this workspace was deleted
        onWorkspaceCreated?.({ id, deleted: true });

        // If deleted workspace was selected, select next available
        if (selectedWorkspace === id) {
          const remaining = wsList.filter((ws) => normalizeId(ws.id) !== id);
          const nextSelected = normalizeId(remaining[0]?.id) ?? null;
          onSelectWorkspace(nextSelected);
        }

        setDeleteModal({ open: false, workspace: null, loading: false });
      } else {
        const data = await res.json().catch(() => ({ error: "Unknown error" }));
        console.error("Failed to delete workspace:", data.error || data);
        setDeleteModal((prev) => ({ ...prev, loading: false }));
      }
    } catch (err) {
      console.error(err);
      setDeleteModal((prev) => ({ ...prev, loading: false }));
    }
  };

  // --- CONTEXT MENU ---
  const handleContextMenu = (e: React.MouseEvent, ws: any) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, workspace: ws });
  };

  const closeContextMenu = () => setContextMenu({ visible: false, x: 0, y: 0, workspace: null });

  // profile menu handlers
  const handleProfileContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setProfileMenu({ visible: true, x: e.clientX, y: e.clientY });
  };
  const closeProfileMenu = () => setProfileMenu({ visible: false, x: 0, y: 0 });

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // close both menus if clicking outside of them
      if (contextMenu.visible) {
        const menuEl = document.getElementById("workspace-context-menu");
        if (menuEl && !menuEl.contains(e.target as Node)) closeContextMenu();
      }
      if (profileMenu.visible) {
        const pEl = document.getElementById("profile-context-menu");
        if (pEl && !pEl.contains(e.target as Node)) closeProfileMenu();
      }
    };
    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  }, [contextMenu.visible, profileMenu.visible]);

  // profile image or fallback initial
  const profileImage = session?.user?.image ?? null;
  const profileInitial = session?.user?.name?.[0] ?? session?.user?.email?.[0] ?? "P";

  return (
    <aside className="h-full flex flex-col justify-between bg-[#141820] border-r border-gray-800">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b border-gray-800">
        <span className="text-white font-bold text-xl">LOGO</span>
      </div>

      {/* Workspaces */}
      <div className="flex-1 flex flex-col items-center py-4 gap-3 overflow-y-auto scrollbar-indigo">
        <style jsx>{`
          .scrollbar-indigo {
            scrollbar-width: thin;
            scrollbar-color: rgba(39, 39, 40, 0.6) transparent;
          }
          .scrollbar-indigo::-webkit-scrollbar {
            width: 6px;
          }
          .scrollbar-indigo::-webkit-scrollbar-track {
            background: transparent;
          }
          .scrollbar-indigo::-webkit-scrollbar-thumb {
            background: rgba(99, 102, 241, 0.6);
            border-radius: 3px;
            min-height: 4px;
          }
          .scrollbar-indigo::-webkit-scrollbar-thumb:hover {
            background: rgba(99, 102, 241, 0.8);
          }
        `}</style>

        {wsList.length === 0 ? (
          <div className="text-gray-400 text-sm px-4">No workspaces yet</div>
        ) : (
          wsList.map((ws, i) => {
            const idNum = normalizeId(ws.id);
            const isSelected = idNum !== null && selectedWorkspace === idNum;
            return (
              <div
                key={String(ws.id) ?? `ws-${i}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectWorkspace(idNum);
                }}
                onContextMenu={(e) => {
                  e.stopPropagation();
                  handleContextMenu(e, ws);
                }}
                title={ws.name}
                className={`aspect-square w-6/10 rounded-xl flex items-center justify-center uppercase cursor-pointer select-none transition-all duration-300
                bg-gradient-to-r ${gradients[i % gradients.length]}
                ${isSelected
                  ? "border-2 border-white shadow-lg scale-110"
                  : "hover:scale-105 hover:shadow-md hover:brightness-110"}`}
              >
                <span
                  className={`font-extrabold text-2xl tracking-wider drop-shadow-[0_0_10px_rgba(147,51,234,0.9)]
                  ${isSelected ? "text-white" : "text-gray-100"}`}
                >
                  {ws.name?.[0] ?? "W"}
                </span>
              </div>
            );
          })
        )}

        {/* Add Button */}
        <button
          className="aspect-square w-6/10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(true);
          }}
        >
          <FaPlus className="text-white text-xl" />
        </button>
      </div>

      {/* Profile */}
      <div className="flex items-center justify-center h-16 border-t border-gray-800 mb-2">
        <div
          id="profile-button"
          onContextMenu={handleProfileContextMenu}
          className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-white text-lg font-bold cursor-pointer overflow-hidden"
          title={session?.user?.email ?? "Profile"}
        >
          {profileImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profileImage} alt="profile" className="w-full h-full object-cover" />
          ) : (
            <span>{profileInitial}</span>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}
        >
          <div className="bg-[#1f2028] p-6 rounded-lg w-80 flex flex-col gap-4">
            <h2 className="text-white text-lg font-bold">New Workspace</h2>
            <input
              type="text"
              className="p-2 rounded bg-gray-700 text-white w-full focus:outline-none"
              placeholder="Workspace name"
              value={newWorkspaceName}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") createWorkspace();
                if (e.key === "Escape") setIsModalOpen(false);
              }}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 text-white"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-500 text-white"
                onClick={createWorkspace}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Context Menu */}
      {contextMenu.visible && contextMenu.workspace && (
        <ul
          id="workspace-context-menu"
          className="fixed bg-[#1f2028] border border-gray-700 rounded shadow-lg text-white z-50 py-1 min-w-[120px]"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <li
            className="px-4 py-2 cursor-pointer hover:bg-gray-700 transition-colors"
            onClick={() => openRenameModal(contextMenu.workspace)}
          >
            Rename
          </li>
          <li
            className="px-4 py-2 cursor-pointer hover:bg-gray-700 transition-colors text-red-400 hover:text-red-300"
            onClick={() => confirmDeleteWorkspace(contextMenu.workspace)}
          >
            Delete
          </li>
        </ul>
      )}

      {/* Profile Context Menu */}
      {profileMenu.visible && (
        <ul
          id="profile-context-menu"
          className="fixed bg-[#1f2028] border border-gray-700 rounded shadow-lg text-white z-50 py-1 min-w-[160px]"
          style={{ top: profileMenu.y, left: profileMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <li
            className="px-4 py-2 cursor-pointer hover:bg-gray-700 transition-colors"
            onClick={() => {
              // close menu first for UX
              closeProfileMenu();
              // sign out and redirect to sign in page
              signOut({ callbackUrl: "/login" });
            }}
          >
            Sign out
          </li>
        </ul>
      )}

      {/* Delete Modal */}
      <DeleteWorkspaceModal
        open={deleteModal.open}
        workspaceName={deleteModal.workspace?.name ?? null}
        loading={deleteModal.loading}
        onClose={() => setDeleteModal({ open: false, workspace: null, loading: false })}
        onConfirm={handleDeleteConfirm}
      />

      {/* Rename Modal */}
      <RenameWorkspaceModal
        open={renameModal.open}
        loading={renameModal.loading}
        currentName={renameModal.workspace?.name ?? ""}
        onClose={() => setRenameModal({ open: false, workspace: null, loading: false })}
        onConfirm={handleRenameConfirm}
      />
    </aside>
  );
}
