"use client";

import { useEffect, useRef, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { FaEllipsisV, FaEdit, FaTrash } from "react-icons/fa";
import {
  SiJavascript,
  SiTypescript,
  SiPython,
  SiHtml5,
  SiCss3,
  SiCplusplus,
  SiRust
} from "react-icons/si";
import DeleteSnippetModal from "./Cards/DeleteSnippetModal"; // adjust path if needed

export default function SnippetsPreview({
  snippets,
  selectedSnippetId, // optional: id of the currently selected snippet
  onSelectSnippet,
  onEditSnippet,
  onDeleteSnippet,
}: {
  snippets: any[];
  selectedSnippetId?: any;
  onSelectSnippet: (snippet: any) => void;
  onEditSnippet?: (snippet: any) => void;
  onDeleteSnippet?: (snippet: any) => void;
}) {
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const menuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuOpenId === null) return;
      const el = menuRefs.current[String(menuOpenId)];
      if (!el || !el.contains(e.target as Node)) {
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

  const openDeleteModal = (snip: any) => {
    setDeleteTarget(snip);
    setDeleteModalOpen(true);
    setMenuOpenId(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    // If parent provided handler, let it handle deletion (optimistic UI expected)
    if (typeof onDeleteSnippet === "function") {
      try {
        await Promise.resolve(onDeleteSnippet(deleteTarget));
      } catch (err) {
        console.error("onDeleteSnippet failed:", err);
      } finally {
        setDeleting(false);
        setDeleteModalOpen(false);
        setDeleteTarget(null);
      }
      return;
    }

    // Fallback: call API directly
    try {
      const id = deleteTarget.id ?? deleteTarget._id;
      if (!id) throw new Error("Missing snippet id");
      const res = await fetch(`/api/snippets?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete snippet");
    } catch (err) {
      console.error("Failed to delete snippet (fallback):", err);
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
      setDeleteTarget(null);
    }
  };

  const handleEdit = (snip: any) => {
    if (typeof onEditSnippet === "function") onEditSnippet(snip);
    setMenuOpenId(null);
  };

  const handleCardKey = (e: React.KeyboardEvent, snip: any) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelectSnippet(snip);
    }
  };

  const getLanguageIcon = (lang?: string) => {
    if (!lang) return null;
    switch (lang.toLowerCase()) {
      case "javascript":
        return <SiJavascript className="text-yellow-400" size={18} />;
      case "typescript":
        return <SiTypescript className="text-blue-400" size={18} />;
      case "python":
        return <SiPython className="text-green-400" size={18} />;
      case "html":
        return <SiHtml5 className="text-orange-500" size={18} />;
      case "css":
        return <SiCss3 className="text-sky-400" size={18} />;
      case "c++":
      case "cpp":
        return <SiCplusplus className="text-indigo-400" size={18} />;
      case "rust":
        return <SiRust className="text-rose-400" size={18} />;
      default:
        return null;
    }
  };

  const smallPreview = (content: string | undefined, lines = 3) => {
    if (!content) return "";
    const arr = content.split("\n").map((l) => l.replace(/\t/g, "  "));
    const slice = arr.slice(0, lines);
    const more = arr.length > lines;
    return slice.join("\n") + (more ? "\n..." : "");
  };

  return (
    <section className="h-full border-r border-gray-800 flex flex-col">
      {/* Search Bar - Fixed */}
      <div className="flex-shrink-0 p-6 pb-0">
        <div className="relative mb-6">
          <AiOutlineSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Find by Code, Tag, title..."
            className="bg-[#1A1D29] w-full pl-10 pr-4 py-2 rounded border border-gray-700 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Scrollable Content Area - Choose your preferred scrollbar style */}
      <div
  className="flex-1 px-6 pb-6 overflow-y-auto scrollbar-indigo"
  style={{ height: '500px' }}
>
  <style jsx>{`
    .scrollbar-indigo {
      scrollbar-width: thin;
      scrollbar-color: rgba(99, 102, 241, 0.6) transparent;
    }

    /* For Chrome, Edge, Safari */
    .scrollbar-indigo::-webkit-scrollbar {
      width: 4px;         /* scrollbar thickness */
    }

    .scrollbar-indigo::-webkit-scrollbar-track {
      background: transparent;
      margin-top: 2px;   /* push track down */
      margin-bottom: 2px; /* push track up */
    }

    .scrollbar-indigo::-webkit-scrollbar-thumb {
      background: rgba(99, 102, 241, 0.6);
      border-radius: 2px;
      min-height: 4px;   /* minimum height of thumb */
    }

    /* ↓ Add margin so thumb doesn’t touch top/bottom → fixed shorter scrollbar */
    .scrollbar-indigo::-webkit-scrollbar-thumb {
      margin: 40px 0;     /* 40px gap from top and bottom */
    }

    .scrollbar-indigo::-webkit-scrollbar-thumb:hover {
      background: rgba(99, 102, 241, 0.8);
    }

    .scrollbar-indigo::-webkit-scrollbar-corner {
      background: transparent;
    }
  `}</style>


        <div className="space-y-4">
          {snippets.map((snip, index) => {
            // safe id/key fallback
            const idRaw = snip?.id ?? snip?._id ?? index;
            const idKey = String(idRaw);
            const isSelected = selectedSnippetId !== undefined && selectedSnippetId !== null
              ? String(selectedSnippetId) === idKey
              : false;

            return (
              <div
                key={idKey}
                ref={(el) => {
                  menuRefs.current[idKey] = el;
                }}
                className={`group relative rounded-xl p-6 min-h-[140px] transition cursor-pointer border
                  ${isSelected
                    ? "bg-gradient-to-r from-[#18191F] via-[#1E1F28] to-[#14151C] border-indigo-500"
                    : "bg-gradient-to-r from-[#222633] via-[#1C1F29] to-[#15171F] border-transparent hover:border-indigo-500 hover:scale-[1.01]"}
                `}
                role="button"
                aria-pressed={isSelected}
                tabIndex={0}
                onKeyDown={(e) => handleCardKey(e, snip)}
                onClick={() => onSelectSnippet(snip)}
              >
                {/* kebab (three dots) */}
                <div className="absolute right-4 top-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpenId(menuOpenId === Number(idKey) ? null : Number(idKey));
                    }}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white p-1 rounded focus:outline-none"
                    aria-haspopup="menu"
                    aria-expanded={menuOpenId === Number(idKey)}
                    title="Options"
                  >
                    <FaEllipsisV size={14} />
                  </button>

                  {menuOpenId === Number(idKey) && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="mt-2 w-36 bg-[#2A2D3A] rounded shadow-lg text-sm z-10 right-0 absolute"
                      role="menu"
                    >
                      <button
                        onClick={() => handleEdit(snip)}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-indigo-600 w-full text-left"
                        role="menuitem"
                      >
                        <FaEdit size={12} /> Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(snip)}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-red-600 w-full text-left"
                        role="menuitem"
                      >
                        <FaTrash size={12} /> Delete
                      </button>
                    </div>
                  )}
                </div>

                {/* clickable card area */}
                <div className="pr-8">
                  <div className="flex items-center gap-2">
                    {getLanguageIcon(snip.language)}
                    <h3 className={`font-semibold text-lg ${isSelected ? "text-white" : "text-gray-100"}`}>
                      {snip.title}
                    </h3>
                  </div>

                  {snip.description && (
                    <p className={`mt-2 text-sm ${isSelected ? "text-indigo-100" : "text-gray-300"} line-clamp-2`}>
                      {snip.description}
                    </p>
                  )}

                  <pre
                    className={`mt-3 text-xs font-mono leading-5 text-indigo-300 bg-transparent max-h-[4.5rem] overflow-hidden whitespace-pre-wrap ${
                      isSelected ? "text-indigo/90" : "text-indigo-200"
                    }`}
                  >
                    {smallPreview(snip.content || snip.code || "", 2)}
                  </pre>

                  <div className="mt-3 flex gap-2 flex-wrap">
                    {snip.tags?.map((tag: any) => (
                      <span
                        key={tag.id ?? tag.name}
                        className={`px-2 py-0.5 text-xs rounded ${
                          isSelected ? "bg-purple-500/30 text-purple-200" : "bg-purple-600/20 text-purple-400"
                        }`}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delete confirmation modal */}
      <DeleteSnippetModal
        open={deleteModalOpen}
        loading={deleting}
        snippetName={deleteTarget?.title ?? ""}
        onClose={() => {
          if (!deleting) {
            setDeleteModalOpen(false);
            setDeleteTarget(null);
          }
        }}
        onConfirm={confirmDelete}
      />
    </section>
  );
}
