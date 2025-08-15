"use client";

import { useState } from "react";
import { FaPlus, FaEllipsisV } from "react-icons/fa";

export default function CollectionSidebar({
  collections,
  selectedCollection,
  onSelectCollection,
  setCollections,
  selectedWorkspaceId, // pass from Dashboard so we know where to add
  onAddSnippet
}: any) {
  const [addingCollection, setAddingCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [loading, setLoading] = useState(false);

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

      // Update UI with newly created collection from DB
      setCollections((prev: any[]) => [...prev, created]);

      setNewCollectionName("");
      setAddingCollection(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
            <span>{col.name}</span>
            <div className="hidden group-hover:flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddSnippet(`New Snippet in ${col.name}`);
                }}
                className="text-gray-400 hover:text-white"
              >
                <FaPlus size={12} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // TODO: Show collection menu (rename/delete)
                }}
                className="text-gray-400 hover:text-white"
              >
                <FaEllipsisV size={12} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
