"use client";

import { useEffect, useRef, useState } from "react";
import { FaPlus, FaEllipsisV, FaTrash, FaEdit } from "react-icons/fa";
import CreateSnippetModal from "./Cards/CreateSnippetModal";
import DeleteCollectionModal from "./Cards/DeleteCollectionModal";

export default function CollectionSidebar({
  collections,
  selectedCollection,
  onSelectCollection,
  setCollections,
  selectedWorkspaceId,
  onAddSnippet,
}: any) {
  const [addingCollection, setAddingCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [loading, setLoading] = useState(false);

  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [renamingId, setRenamingId] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState("");

  // Track action area per row for click-outside
  const createInputRef = useRef<HTMLInputElement | null>(null);
  const menuRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Snippet modal
  const [snippetModalOpen, setSnippetModalOpen] = useState(false);
  const [snippetCollectionId, setSnippetCollectionId] = useState<number | null>(null);

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Close kebab when clicking outside or on Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuOpenId === null) return;
      const activeNode = menuRefs.current[menuOpenId];
      if (!activeNode || !activeNode.contains(e.target as Node)) {
        setMenuOpenId(null);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpenId(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [menuOpenId]);

  useEffect(() => {
  if (!addingCollection) return;

  const handleClickOutside = (e: MouseEvent) => {
    if (
      createInputRef.current &&
      !createInputRef.current.contains(e.target as Node)
    ) {
      if (!newCollectionName.trim()) {
        setAddingCollection(false);
      }
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, [addingCollection, newCollectionName]);

  const handleCreate = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    if (!newCollectionName.trim() || !selectedWorkspaceId) return;

    try {
      setLoading(true);
      const res = await fetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCollectionName.trim(),
          workspaceId: selectedWorkspaceId,
        }),
      });

      if (!res.ok) throw new Error("Failed to create collection");

      const created = await res.json();
      setCollections((prev: any[]) => [...prev, created]);

      setNewCollectionName("");
      setAddingCollection(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRename = async (id: number) => {
    if (!renameValue.trim()) return;
    try {
      const res = await fetch(`/api/collections?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: renameValue.trim() }),
      });

      if (!res.ok) throw new Error("Failed to rename collection");

      const updated = await res.json();
      setCollections((prev: any[]) => prev.map((c) => (c.id === id ? updated : c)));
      setRenamingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Called when delete confirmed in DeleteCollectionModal
  const confirmDelete = async (id: number) => {
    try {
      setDeleting(true);
      const res = await fetch(`/api/collections?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete collection");

      setCollections((prev: any[]) => prev.filter((c) => c.id !== id));
      setDeleteModalOpen(false);
      setDeleteTargetId(null);
      setDeleteTargetName(null);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    // Sidebar default: disable selection and hide caret; inputs re-enable selection
    <aside className="w-64 bg-[#1A1D29] border-r border-gray-800 p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg select-none">Collections</h2>
        <button
          onClick={() => setAddingCollection(true)}
          className="text-gray-400 hover:text-white outline-none"
          aria-label="Add collection"
        >
          <FaPlus size={14} />
        </button>
      </div>

      {addingCollection && (
        <div className="flex mb-2">
          <input
            ref={createInputRef}
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            onKeyDown={handleCreate}
            className="flex-1 bg-[#0E1116] border border-gray-700 rounded px-2 py-1 text-sm select-text caret-auto"
            placeholder="New collection"
            disabled={loading}
            autoFocus
          />
        </div>
      )}

      <ul>
        {collections.map((col: any) => (
          <li
            key={col.id}
            className={`group flex justify-between items-center gap-2 px-2 py-1 rounded cursor-pointer ${
              selectedCollection === col.id ? "bg-indigo-600" : "hover:bg-[#2A2D3A]"
            }`}
            onClick={() => onSelectCollection(col.id)}
          >
            {renamingId === col.id ? (
              <input
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRename(col.id)}
                className="flex-1 bg-[#0E1116] border border-gray-700 rounded px-2 py-1 text-sm select-text caret-auto"
                autoFocus
              />
            ) : (
              <span className="truncate flex-1 select-none">{col.name}</span>
            )}

            <div
              className="relative flex items-center gap-1"
              ref={(el) => {
                menuRefs.current[col.id] = el;
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSnippetCollectionId(col.id);
                  setSnippetModalOpen(true);
                  setMenuOpenId(null);
                }}
                className={`text-gray-400 hover:text-white transition-opacity outline-none ${
                  menuOpenId === col.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
                aria-label="Add snippet"
                title="Add snippet"
              >
                <FaPlus size={12} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpenId(menuOpenId === col.id ? null : col.id);
                }}
                className={`text-gray-400 hover:text-white transition-opacity outline-none ${
                  menuOpenId === col.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
                aria-haspopup="menu"
                aria-expanded={menuOpenId === col.id}
                aria-label="Collection options"
                title="Options"
              >
                <FaEllipsisV size={12} />
              </button>

              {menuOpenId === col.id && (
                <div
                  className="absolute right-0 top-full mt-1 bg-[#2A2D3A] rounded shadow-lg text-sm z-10 min-w-36"
                  role="menu"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setRenamingId(col.id);
                      setRenameValue(col.name);
                      setMenuOpenId(null);
                    }}
                    className="flex items-center gap-2 px-3 py-1 hover:bg-indigo-600 w-full text-left"
                    role="menuitem"
                  >
                    <FaEdit size={12} /> Rename
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTargetId(col.id);
                      setDeleteTargetName(col.name ?? null);
                      setDeleteModalOpen(true);
                      setMenuOpenId(null);
                    }}
                    className="flex items-center gap-2 px-3 py-1 hover:bg-red-600 w-full text-left"
                    role="menuitem"
                  >
                    <FaTrash size={12} /> Delete
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* Snippet modal (separate file) */}
      {snippetModalOpen && (
        <CreateSnippetModal
          isOpen={snippetModalOpen}
          onClose={() => setSnippetModalOpen(false)}
          collectionId={snippetCollectionId ?? selectedCollection}
          onCreated={(snippet: any) => {
            if (typeof onAddSnippet === "function") onAddSnippet(snippet);
          }}
        />
      )}

      {/* Delete collection modal (separate file) */}
      <DeleteCollectionModal
        open={deleteModalOpen}
        loading={deleting}
        collectionName={deleteTargetName}
        onClose={() => {
          if (!deleting) {
            setDeleteModalOpen(false);
            setDeleteTargetId(null);
            setDeleteTargetName(null);
          }
        }}
        onConfirm={() => {
          if (deleteTargetId !== null) confirmDelete(deleteTargetId);
        }}
      />
    </aside>
  );
}
