"use client";

import { useState } from "react";
import { FaPlus, FaEllipsisV, FaTrash, FaEdit } from "react-icons/fa";

export default function CollectionSidebar({
  collections,
  selectedCollection,
  onSelectCollection,
  setCollections,
  selectedWorkspaceId,
  onAddSnippet
}: any) {
  const [addingCollection, setAddingCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [loading, setLoading] = useState(false);

  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [renamingId, setRenamingId] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState("");

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
          workspaceId: selectedWorkspaceId
        })
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
        body: JSON.stringify({ name: renameValue.trim() })
      });

      if (!res.ok) throw new Error("Failed to rename collection");

      const updated = await res.json();
      setCollections((prev: any[]) =>
        prev.map((c) => (c.id === id ? updated : c))
      );
      setRenamingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this collection?")) return;
    try {
      const res = await fetch(`/api/collections?id=${id}`, {
        method: "DELETE"
      });

      if (!res.ok) throw new Error("Failed to delete collection");

      setCollections((prev: any[]) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <aside className="w-64 bg-[#1A1D29] border-r border-gray-800 p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg">Collections</h2>
        <button
          onClick={() => setAddingCollection(true)}
          className="text-gray-400 hover:text-white"
        >
          <FaPlus size={14} />
        </button>
      </div>

      {addingCollection && (
        <div className="flex mb-2">
          <input
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            onKeyDown={handleCreate}
            className="flex-1 bg-[#0E1116] border border-gray-700 rounded px-2 py-1 text-sm"
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
            className={`group flex justify-between items-center px-2 py-1 rounded cursor-pointer ${
              selectedCollection === col.id ? "bg-indigo-600" : "hover:bg-[#2A2D3A]"
            }`}
            onClick={() => onSelectCollection(col.id)}
          >
            {renamingId === col.id ? (
              <input
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRename(col.id)}
                className="flex-1 bg-[#0E1116] border border-gray-700 rounded px-2 py-1 text-sm"
                autoFocus
              />
            ) : (
              <span>{col.name}</span>
            )}

            <div className="relative flex items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpenId(menuOpenId === col.id ? null : col.id);
                }}
                className={`text-gray-400 hover:text-white transition-opacity ${
                  menuOpenId === col.id
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                }`}
              >
                <FaEllipsisV size={12} />
              </button>

              {menuOpenId === col.id && (
                <div className="absolute right-0 top-full mt-1 bg-[#2A2D3A] rounded shadow-lg text-sm z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setRenamingId(col.id);
                      setRenameValue(col.name);
                      setMenuOpenId(null);
                    }}
                    className="flex items-center gap-2 px-3 py-1 hover:bg-indigo-600 w-full"
                  >
                    <FaEdit size={12} /> Rename
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(col.id);
                      setMenuOpenId(null);
                    }}
                    className="flex items-center gap-2 px-3 py-1 hover:bg-red-600 w-full"
                  >
                    <FaTrash size={12} /> Delete
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
