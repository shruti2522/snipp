"use client";

import { useState, useEffect } from "react";
import { FaPlus, FaShareAlt, FaUserFriends, FaUserPlus, FaUsers } from "react-icons/fa";
import { signIn, signOut, useSession } from "next-auth/react";
import DeleteWorkspaceModal from "./Cards/DeleteWorkspaceModal";
import RenameWorkspaceModal from "./Cards/RenameWorkspaceModal";
import ShareWorkspaceModal from "./Cards/ShareWorkspaceModal";
import ProfileMenu from "./ProfileMenu";

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

  const [profileMenu, setProfileMenu] = useState<{ visible: boolean; x: number; y: number }>(
    { visible: false, x: 0, y: 0 }
  );

  const [deleteModal, setDeleteModal] = useState<{ open: boolean; workspace: any | null; loading: boolean }>(
    { open: false, workspace: null, loading: false }
  );

  const [renameModal, setRenameModal] = useState<{ open: boolean; workspace: any | null; loading: boolean }>(
    { open: false, workspace: null, loading: false }
  );

  const [shareModal, setShareModal] = useState<{ open: boolean; workspace: any | null; loading: boolean }>(
    { open: false, workspace: null, loading: false }
  );

  const [sharedUsersModal, setSharedUsersModal] = useState<{
  open: boolean;
  workspace: Workspace | null;
}>({ open: false, workspace: null });

const openSharedUsersModal = (workspace: Workspace) => {
  setSharedUsersModal({ open: true, workspace });
  closeContextMenu();
};

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

  type User = {
	id: string;
	name: string;
	email?: string;
	};

	type Workspace = {
	id: string;
	name: string;
	sharedWith?: User[];  
	sharedBy?: User;       
	};

  const wsList = Array.isArray(workspaces) ? workspaces : [];

  const normalizeId = (id: any): number | null => {
    if (id === null || id === undefined) return null;
    if (typeof id === "number") return id;
    const n = Number(id);
    return Number.isNaN(n) ? null : n;
  };

  const handleAuthError = async (res: Response) => {
    if (res.status === 401) {
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
        credentials: "same-origin",
        body: JSON.stringify({ name: newWorkspaceName.trim() }),
      });

      if (await handleAuthError(res)) return;

      const data = await res.json().catch(() => null);
      if (res.ok) {
        setIsModalOpen(false);
        setNewWorkspaceName("");
        closeContextMenu();
        onWorkspaceCreated?.(data);
      } else {
        console.error("Error creating workspace:", data || res.statusText);
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  // --- RENAME ---
  const openRenameModal = (workspace: any) => {
    setRenameModal({ open: true, workspace, loading: false });
    closeContextMenu();
  };

  const handleRenameConfirm = async (newName: string) => {
    if (!renameModal.workspace) return;
    const id = normalizeId(renameModal.workspace.id);
    if (id === null) {
      console.error("Invalid workspace id for rename");
      return;
    }

    setRenameModal((prev) => ({ ...prev, loading: true }));
    try {
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
        onWorkspaceCreated?.(updated);
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

  // --- SHARE ---
  const openShareModal = (workspace: any) => {
    setShareModal({ open: true, workspace, loading: false });
    closeContextMenu();
  };

  const handleShareConfirm = async (email: string) => {
    if (!shareModal.workspace) return;
    const id = normalizeId(shareModal.workspace.id);
    if (id === null) {
      console.error("Invalid workspace id for share");
      return;
    }

    setShareModal((prev) => ({ ...prev, loading: true }));
    try {
      const res = await fetch(`/api/workspaces/share?id=${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email: email.trim() }),
      });

      if (await handleAuthError(res)) {
        setShareModal((prev) => ({ ...prev, loading: false }));
        return;
      }

      const updated = await res.json().catch(() => null);
      if (res.ok) {
        onWorkspaceCreated?.(updated);
        setShareModal({ open: false, workspace: null, loading: false });
      } else {
        console.error("Failed to share workspace:", updated?.error || updated || res.statusText);
        setShareModal((prev) => ({ ...prev, loading: false }));
      }
    } catch (err) {
      console.error(err);
      setShareModal((prev) => ({ ...prev, loading: false }));
    }
  };

  // --- DELETE ---
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
      const res = await fetch(`/api/workspaces?id=${id}`, {
        method: "DELETE",
        credentials: "same-origin",
      });

      if (await handleAuthError(res)) {
        setDeleteModal((prev) => ({ ...prev, loading: false }));
        return;
      }

      if (res.ok) {
        onWorkspaceCreated?.({ id, deleted: true });

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

  const profileImage = session?.user?.image ?? null;
  const profileInitial = session?.user?.name?.[0] ?? session?.user?.email?.[0] ?? "P";

  // Robust isOwner check: prefer session.user.id when available, fall back to email comparisons
  const isOwner = (ws: any) => {
    if (!ws) return false;
    const sessionUser = session?.user;
    if (!sessionUser) return false;

    // prefer id if available in session
    if (sessionUser.id) {
      const sid = String(sessionUser.id);
      if (ws.ownerId !== undefined && ws.ownerId !== null) {
        if (String(ws.ownerId) === sid) return true;
      }
      if (ws.owner?.id !== undefined && ws.owner?.id !== null) {
        if (String(ws.owner.id) === sid) return true;
      }
    }

    // fallback to comparing emails (case-insensitive)
    const sEmail = (sessionUser.email ?? "").toLowerCase();
    if (sEmail) {
      if (ws.ownerEmail && String(ws.ownerEmail).toLowerCase() === sEmail) return true;
      if (ws.owner?.email && String(ws.owner.email).toLowerCase() === sEmail) return true;
      // edge-case: owner stored as string id but equal to email (unlikely) handled below
    }

    // edge-case: workspace.owner might be the id string
    if (typeof ws.owner === "string" && sessionUser.id) {
      if (String(ws.owner) === String(sessionUser.id)) return true;
    }

    return false;
  };

  const sharedCount = (ws: any) => {
    if (!ws) return 0;
    if (Array.isArray(ws.sharedWith)) return ws.sharedWith.length;
    if (typeof ws.sharedWith === "string") return ws.sharedWith ? ws.sharedWith.split(",").length : 0;
    return 0;
  };

  // Helper function to determine sharing status
  const getSharingStatus = (ws: any) => {
    const owner = isOwner(ws);
    const shared = sharedCount(ws) > 0;
    
    // Debug logging
    console.log('Workspace:', ws.name, {
      owner,
      shared,
      sharedWith: ws.sharedWith,
      sharedCount: sharedCount(ws),
      ownerId: ws.ownerId,
      sessionUserId: session?.user?.id
    });
    
    if (owner && shared) {
      return 'sharedByMe'; // I own it and have shared it with others
    } else if (!owner && shared) {
      return 'sharedWithMe'; // Someone else owns it, shared with me
    }
    return null; // No sharing indicators needed
  };

  const getSharedByTooltip = (ws: Workspace): string => {
  if (!ws.sharedWith || ws.sharedWith.length === 0) return "Not shared";
  if (ws.sharedWith.length === 1) return `Shared by you with ${ws.sharedWith[0].name}`;
  return `Shared by you with ${ws.sharedWith.map(u => u.name).join(", ")}`;
};

const getSharedWithMeTooltip = (ws: Workspace): string => {
  if (!ws.sharedBy) return "Shared with you";
  return `Shared with you by ${ws.sharedBy.name}`;
};


  return (
    <aside className="h-full flex flex-col justify-between bg-[#141820] border-r border-gray-800">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b border-gray-800">
        <span className="text-white font-bold text-xl">
			<img 
				src="logo.png" 
				alt="Snipp Logo" 
				width={300} 
				height={64} 
				className="object-contain"
			/>	
		</span>
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
            const sharingStatus = getSharingStatus(ws);

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
                className={`relative aspect-square w-6/10 rounded-xl flex items-center justify-center uppercase cursor-pointer select-none transition-all duration-300
                bg-gradient-to-r ${gradients[i % gradients.length]}
                ${isSelected ? "border-2 border-white shadow-lg scale-110" : "hover:scale-105 hover:shadow-md hover:brightness-110"}`}
              >
                <span
                  className={`font-extrabold text-2xl tracking-wider drop-shadow-[0_0_10px_rgba(147,51,234,0.9)]
                  ${isSelected ? "text-white" : "text-gray-100"}`}
                >
                  {ws.name?.[0] ?? "W"}
                </span>

                {/* Sharing status indicators */}
               {sharingStatus === "sharedByMe" && (
  <div
    className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full flex items-center justify-center border border-white/80 shadow-lg backdrop-blur-sm cursor-pointer"
    title={getSharedByTooltip(ws)}
  >
    <span className="text-black text-[10px] font-bold drop-shadow-sm">
      {sharedCount(ws)}
    </span>
  </div>
)}

{sharingStatus === "sharedWithMe" && (
  <div
    className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-emerald-400 to-green-600 rounded-full flex items-center justify-center border border-white/80 shadow-lg backdrop-blur-sm cursor-pointer"
    title={getSharedWithMeTooltip(ws)}
  >
    <FaUserFriends className="text-white text-[10px] drop-shadow-sm" />
  </div>
)}


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
		<ProfileMenu profileImage={profileImage} profileInitial={profileInitial} />
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
          className="fixed bg-[#1f2028] border border-gray-700 rounded shadow-lg text-white z-50 py-1 min-w-[160px]"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <li
            className="px-4 py-2 cursor-pointer hover:bg-gray-700 transition-colors"
            onClick={() => openRenameModal(contextMenu.workspace)}
          >
            Rename
          </li>

          {/* only owner sees Share */}
          {isOwner(contextMenu.workspace) && (
            <li
              className="px-4 py-2 cursor-pointer hover:bg-gray-700 transition-colors flex items-center gap-2"
              onClick={() => openShareModal(contextMenu.workspace)}
            >
              <FaShareAlt className="text-sm" />
              <span>Share</span>
            </li>
          )}

					{/* ✅ View Shared Users Option */}
			{(sharedCount(contextMenu.workspace) > 0 || contextMenu.workspace.sharedBy) && (
			<li
			className="px-4 py-2 cursor-pointer hover:bg-gray-700 transition-colors flex items-center gap-2"
			onClick={() => openSharedUsersModal(contextMenu.workspace)}
			>
			<FaUserFriends className="text-sm" />
			<span>View Shared Users</span>
			</li>
			)}

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

      {/* Share Modal (new) */}
      <ShareWorkspaceModal
        open={shareModal.open}
        loading={shareModal.loading}
        workspace={shareModal.workspace}
        onClose={() => setShareModal({ open: false, workspace: null, loading: false })}
        onConfirm={handleShareConfirm}
      />

	  {/* Shared Users Modal */}
{sharedUsersModal.open && sharedUsersModal.workspace && (
  <div
    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    onClick={(e) => e.target === e.currentTarget && setSharedUsersModal({ open: false, workspace: null })}
  >
    <div className="bg-[#1f2028] p-6 rounded-lg w-96 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
      <h2 className="text-white text-lg font-bold">Shared Users</h2>

      {/* If shared by me */}
      {isOwner(sharedUsersModal.workspace) && (
        <div>
          <p className="text-gray-300 text-sm mb-2">You shared with:</p>
          {sharedUsersModal.workspace.sharedWith?.length ? (
            <ul className="space-y-1">
              {sharedUsersModal.workspace.sharedWith.map((u) => (
                <li key={u.id} className="text-white flex items-center gap-2">
                  <FaUserPlus className="text-xs text-indigo-400" />
                  <span>{u.name} {u.email && <span className="text-gray-400">({u.email})</span>}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No one yet.</p>
          )}
        </div>
      )}

      {/* If shared with me */}
      {!isOwner(sharedUsersModal.workspace) && sharedUsersModal.workspace.sharedBy && (
        <div>
          <p className="text-gray-300 text-sm mb-2">Shared with you by:</p>
          <div className="text-white flex items-center gap-2">
            <FaUserFriends className="text-xs text-green-400" />
            <span>{sharedUsersModal.workspace.sharedBy.name} {sharedUsersModal.workspace.sharedBy.email && <span className="text-gray-400">({sharedUsersModal.workspace.sharedBy.email})</span>}</span>
          </div>
        </div>
      )}

      <div className="flex justify-end mt-4">
        <button
          className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 text-white"
          onClick={() => setSharedUsersModal({ open: false, workspace: null })}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

    </aside>
  );
}
