"use client";
import { useEffect, useRef, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { FaEllipsisV, FaEdit, FaTrash } from "react-icons/fa";

export default function SnippetsPreview({
  snippets,
  onSelectSnippet,
  onEditSnippet,
  onDeleteSnippet,
}: {
  snippets: any[];
  onSelectSnippet: (snippet: any) => void;
  onEditSnippet?: (snippet: any) => void;
  onDeleteSnippet?: (snippet: any) => void;
}) {
  // track which snippet menu is open
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  // refs for click-outside handling (one ref per snippet card)
  const menuRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuOpenId === null) return;
      const el = menuRefs.current[menuOpenId];
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

  const handleDelete = (snip: any) => {
    if (typeof onDeleteSnippet === "function") {
      onDeleteSnippet(snip);
    } else {
      // fallback
      if (confirm(`Delete snippet "${snip.title}"?`)) {
        // consumer didn't provide a handler — user can implement deletion in parent
        // but we'll call onDeleteSnippet if later provided
      }
    }
    setMenuOpenId(null);
  };

  const handleEdit = (snip: any) => {
    if (typeof onEditSnippet === "function") onEditSnippet(snip);
    setMenuOpenId(null);
  };

  return (
    <section className="flex-1 p-6 overflow-y-auto border-r border-gray-800">
      <div className="relative mb-6">
        <AiOutlineSearch className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Find by Code, Tag, title..."
          className="bg-[#1A1D29] w-full pl-10 pr-4 py-2 rounded border border-gray-700 focus:outline-none focus:border-indigo-500"
        />
      </div>

      <div className="space-y-4">
        {snippets.map((snip) => {
          const id = Number(snip.id);
          return (
            <div
              key={id}
              ref={(el) => {
                // store the card element so the dropdown click-outside can use it
                if (el) menuRefs.current[id] = el;
              }}
              className="group bg-[#1A1D29] p-4 rounded border border-transparent hover:border-indigo-500 hover:scale-[1.01] transition cursor-pointer relative"
            >
              {/* clickable card area */}
              <div
                onClick={() => onSelectSnippet(snip)}
                className="pr-8" /* leave space for kebab */
              >
                <h3 className="font-semibold">{snip.title}</h3>
                <div className="mt-2 flex gap-2 flex-wrap">
                  {snip.tags?.map((tag: any) => (
                    <span
                      key={tag.id}
                      className="px-2 py-0.5 text-xs bg-purple-600/20 text-purple-400 rounded"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* kebab (three dots) - visible on hover */}
              <div className="absolute right-3 top-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpenId(menuOpenId === id ? null : id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white p-1 rounded focus:outline-none"
                  aria-haspopup="menu"
                  aria-expanded={menuOpenId === id}
                  title="Options"
                >
                  <FaEllipsisV size={14} />
                </button>

                {/* dropdown menu */}
                {menuOpenId === id && (
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
                      onClick={() => handleDelete(snip)}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-red-600 w-full text-left"
                      role="menuitem"
                    >
                      <FaTrash size={12} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
