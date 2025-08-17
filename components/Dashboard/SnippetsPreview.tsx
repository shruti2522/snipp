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
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
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
      if (confirm(`Delete snippet "${snip.title}"?`)) {
        // fallback delete
      }
    }
    setMenuOpenId(null);
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
        return <SiRust className="text-indigo-400" size={18} />;
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
    <section className="h-full p-6 overflow-y-auto border-r border-gray-800">
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
                menuRefs.current[id] = el;
              }}
              className={`group relative rounded-xl p-6 min-h-[140px] bg-gradient-to-r from-[#222633] via-[#1C1F29] to-[#15171F]
 hover:scale-[1.01] transition cursor-pointer border border-transparent hover:border-indigo-500`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => handleCardKey(e, snip)}
            >
              {/* kebab (three dots) */}
              <div className="absolute right-4 top-4">
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

              {/* clickable card area */}
              <div onClick={() => onSelectSnippet(snip)} className="pr-8">
                <div className="flex items-center gap-2">
                  {getLanguageIcon(snip.language)}
                  <h3 className="font-semibold text-lg text-gray-100">{snip.title}</h3>
                </div>

                {snip.description && (
                  <p className="mt-2 text-sm text-gray-300 line-clamp-2">{snip.description}</p>
                )}

                <pre className="mt-3 text-xs font-mono leading-5 text-gray-200 bg-transparent max-h-[4.5rem] overflow-hidden whitespace-pre-wrap">
                  {smallPreview(snip.content || snip.code || "", 3)}
                </pre>

                <div className="mt-3 flex gap-2 flex-wrap">
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
            </div>
          );
        })}
      </div>
    </section>
  );
}
