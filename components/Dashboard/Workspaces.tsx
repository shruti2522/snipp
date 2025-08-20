"use client";

import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
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
  onSelectWorkspace: (id: number) => void;
  onAddWorkspace: () => void;
  onWorkspaceCreated?: (ws: any) => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");

  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    workspace: any | null;
  }>({ visible: false, x: 0, y: 0, workspace: null });

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

  // --- CREATE WORKSPACE ---
  const createWorkspace = async () => {
    if (!newWorkspaceName.trim()) return;
    try {
      const res = await fetch("/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newWorkspaceName }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsModalOpen(false);
        setNewWorkspaceName("");
        onWorkspaceCreated?.(data);
      } else {
        console.error("Error creating workspace:", data);
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
    setRenameModal((prev) => ({ ...prev, loading: true }));
    try {
      const res = await fetch(`/api/workspaces/${renameModal.workspace.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });
      const updated = await res.json();
      if (res.ok) {
        onWorkspaceCreated?.(updated);
        setRenameModal({ open: false, workspace: null, loading: false });
      } else {
        console.error("Failed to rename workspace:", updated?.error || updated);
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
    setDeleteModal((prev) => ({ ...prev, loading: true }));
    try {
      const res = await fetch(`/api/workspaces/${deleteModal.workspace.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Remove workspace immediately from parent state
        onWorkspaceCreated?.({ id: deleteModal.workspace.id, deleted: true });

        // If deleted workspace was selected, select next available
        if (selectedWorkspace === deleteModal.workspace.id) {
          const remaining = workspaces.filter((ws) => ws.id !== deleteModal.workspace.id);
          const nextSelected = remaining[0]?.id ?? null;
          onSelectWorkspace(nextSelected);
        }

        setDeleteModal({ open: false, workspace: null, loading: false });
      } else {
        const data = await res.json();
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

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (contextMenu.visible) {
        const menuEl = document.getElementById("workspace-context-menu");
        if (menuEl && !menuEl.contains(e.target as Node)) closeContextMenu();
      }
    };
    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  }, [contextMenu.visible]);

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

        {workspaces.map((ws, i) => {
          const isSelected = selectedWorkspace === ws.id;
          return (
            <div
              key={`${ws.id}-${i}`}
              onClick={(e) => {
                e.stopPropagation();
                onSelectWorkspace(ws.id);
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
                  : "hover:scale-105 hover:shadow-md hover:brightness-110"}
              `}
            >
              <span
                className={`font-extrabold text-2xl tracking-wider drop-shadow-[0_0_10px_rgba(147,51,234,0.9)]
                  ${isSelected ? "text-white" : "text-gray-100"}
                `}
              >
                {ws.name?.[0] ?? "W"}
              </span>
            </div>
          );
        })}

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
        <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-white text-lg font-bold">
          P
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
