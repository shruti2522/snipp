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
  SiRust,
} from "react-icons/si";
import DeleteSnippetModal from "./Cards/DeleteSnippetModal";
import EditSnippetModal from "./Cards/EditSnippetModal";

export default function SnippetsPreview({
  snippets,
  selectedSnippetId,
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
  const [editingSnippet, setEditingSnippet] = useState<any | null>(null);
  const menuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Search + Language filter
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedLang, setSelectedLang] = useState("All");
  const [filteredSnippets, setFilteredSnippets] = useState<any[]>(snippets ?? []);

 const languages = Array.from(
  new Set(
    Array.isArray(snippets)
      ? snippets.map((s) => (s.language ?? "").toString().trim()).filter(Boolean)
      : []
  )
);

  useEffect(() => {
    setQuery("");
    setDebouncedQuery("");
    setSelectedLang("All");
    setFilteredSnippets(snippets ?? []);
  }, [snippets]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 200);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const q = (debouncedQuery || "").toLowerCase();
    const langFilter = selectedLang.toLowerCase();

    const tokens = q.split(/\s+/).filter(Boolean);

    const matches = (snip: any) => {
      if (langFilter !== "all") {
        if ((snip.language ?? "").toLowerCase() !== langFilter) return false;
      }
      if (!tokens.length) return true;

      const title = (snip.title ?? "").toString().toLowerCase();
      const desc = (snip.description ?? "").toString().toLowerCase();
      const content = (snip.content ?? snip.code ?? "").toString().toLowerCase();
      const lang = (snip.language ?? "").toString().toLowerCase();
      const tags = (snip.tags ?? []).map((t: any) => (t.name ?? t).toString().toLowerCase());

      return tokens.every((tk) => {
        if (title.includes(tk)) return true;
        if (desc.includes(tk)) return true;
        if (content.includes(tk)) return true;
        if (lang.includes(tk)) return true;
        if (tags.some((tg: string) => tg.includes(tk))) return true;
        return false;
      });
    };

    setFilteredSnippets((snippets ?? []).filter(matches));
  }, [snippets, debouncedQuery, selectedLang]);

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

    try {
      const id = deleteTarget.id ?? deleteTarget._id;
      if (!id) throw new Error("Missing snippet id");
      const res = await fetch(`/api/snippets?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete snippet");
      setFilteredSnippets((prev) => prev.filter((s) => (s.id ?? s._id) !== id));
    } catch (err) {
      console.error("Failed to delete snippet (fallback):", err);
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
      setDeleteTarget(null);
    }
  };

  const handleEdit = (snip: any) => {
    setEditingSnippet(snip);
    setMenuOpenId(null);
  };

  const handleUpdatedSnippet = (updated: any) => {
    if (typeof onEditSnippet === "function") {
      onEditSnippet(updated);
    }
    setFilteredSnippets((prev) => {
      const idx = prev.findIndex((s) => (s.id ?? s._id) === (updated.id ?? updated._id));
      if (idx === -1) return prev;
      const copy = [...prev];
      copy.splice(idx, 1, updated);
      return copy;
    });
    setEditingSnippet(null);
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
    <>
      <section className="h-full border-r border-gray-800 flex flex-col">
        {/* Search + Filter Bar */}
        <div className="flex-shrink-0 p-6 pb-0 relative z-0">
          <div className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <AiOutlineSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Find by code, language, tag, title ..."
                className="bg-[#1A1D29] w-full pl-10 pr-4 py-2 rounded border border-gray-700 focus:outline-none focus:border-indigo-500"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-2.5 text-sm text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="bg-[#1A1D29] text-gray-200 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Languages</option>
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Scrollable Snippet List */}
        <div
          className="flex-1 px-6 pb-6 pt-0.5 overflow-y-auto scrollbar-indigo"
          style={{ height: "500px" }}
        >
          <style jsx>{`
            .scrollbar-indigo {
              scrollbar-width: thin;
              scrollbar-color: rgba(99, 102, 241, 0.6) transparent;
            }
            .scrollbar-indigo::-webkit-scrollbar {
              width: 4px;
            }
            .scrollbar-indigo::-webkit-scrollbar-track {
              background: transparent;
              margin-top: 2px;
              margin-bottom: 2px;
            }
            .scrollbar-indigo::-webkit-scrollbar-thumb {
              background: rgba(99, 102, 241, 0.6);
              border-radius: 2px;
              min-height: 4px;
              margin: 40px 0;
            }
            .scrollbar-indigo::-webkit-scrollbar-thumb:hover {
              background: rgba(99, 102, 241, 0.8);
            }
            .scrollbar-indigo::-webkit-scrollbar-corner {
              background: transparent;
            }
          `}</style>

          {filteredSnippets.length === 0 ? (
            <div className="h-full grid place-items-center text-gray-400">
              <div className="flex flex-col items-center">
                <svg
          viewBox="0 -0.5 25 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-24 h-24 mb-4 opacity-80"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.5 11.493C5.50364 8.39226 7.69698 5.72579 10.7388 5.12416C13.7807 4.52253 16.8239 6.15327 18.0077 9.0192C19.1915 11.8851 18.186 15.1881 15.6063 16.9085C13.0265 18.6288 9.59077 18.2874 7.4 16.093C6.18148 14.8725 5.49799 13.2177 5.5 11.493Z"
            stroke="#d6d7dc"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16.062 16.568L19.5 19.993"
            stroke="#d6d7dc"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10.5303 8.96271C10.2374 8.66982 9.76256 8.66982 9.46967 8.96271C9.17678 9.25561 9.17678 9.73048 9.46967 10.0234L10.5303 8.96271ZM11.4697 12.0234C11.7626 12.3163 12.2374 12.3163 12.5303 12.0234C12.8232 11.7305 12.8232 11.2556 12.5303 10.9627L11.4697 12.0234ZM12.5303 10.9627C12.2374 10.6698 11.7626 10.6698 11.4697 10.9627C11.1768 11.2556 11.1768 11.7305 11.4697 12.0234L12.5303 10.9627ZM13.4697 14.0234C13.7626 14.3163 14.2374 14.3163 14.5303 14.0234C14.8232 13.7305 14.8232 13.2556 14.5303 12.9627L13.4697 14.0234ZM12.5303 12.0234C12.8232 11.7305 12.8232 11.2556 12.5303 10.9627C12.2374 10.6698 11.7626 10.6698 11.4697 10.9627L12.5303 12.0234ZM9.46967 12.9627C9.17678 13.2556 9.17678 13.7305 9.46967 14.0234C9.76256 14.3163 10.2374 14.3163 10.5303 14.0234L9.46967 12.9627ZM11.4697 10.9627C11.1768 11.2556 11.1768 11.7305 11.4697 12.0234C11.7626 12.3163 12.2374 12.3163 12.5303 12.0234L11.4697 10.9627ZM14.5303 10.0234C14.8232 9.73048 14.8232 9.25561 14.5303 8.96271C14.2374 8.66982 13.7626 8.66982 13.4697 8.96271L14.5303 10.0234ZM9.46967 10.0234L11.4697 12.0234L12.5303 10.9627L10.5303 8.96271L9.46967 10.0234ZM11.4697 12.0234L13.4697 14.0234L14.5303 12.9627L12.5303 10.9627L11.4697 12.0234ZM11.4697 10.9627L9.46967 12.9627L10.5303 14.0234L12.5303 12.0234L11.4697 10.9627ZM12.5303 12.0234L14.5303 10.0234L13.4697 8.96271L11.4697 10.9627L12.5303 12.0234Z"
            fill="#d6d7dc"
          />
        </svg>
                <p className="text-sm">No snippets match your search or filter.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSnippets.map((snip, index) => {
                const idRaw = snip?.id ?? snip?._id ?? index;
                const idKey = String(idRaw);
                const isSelected =
                  selectedSnippetId !== undefined && selectedSnippetId !== null
                    ? String(selectedSnippetId) === idKey
                    : false;

                return (
                  <div
                    key={idKey}
                    ref={(el) => {
                      menuRefs.current[idKey] = el;
                    }}
                    className={`group relative z-0 origin-top rounded-xl p-6 min-h-[140px] transition transform-gpu will-change-transform cursor-pointer border
                      ${
                        isSelected
                          ? "bg-gradient-to-r from-[#18191F] via-[#1E1F28] to-[#14151C] border-indigo-500"
                          : "bg-gradient-to-r from-[#222633] via-[#1C1F29] to-[#15171F] border-transparent hover:border-indigo-500 hover:scale-[1.01] hover:z-30"
                      }`}
                    role="button"
                    aria-pressed={isSelected}
                    tabIndex={0}
                    onKeyDown={(e) => handleCardKey(e, snip)}
                    onClick={() => onSelectSnippet(snip)}
                  >
                    {/* Kebab menu */}
                    <div className="absolute right-4 top-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpenId(menuOpenId === Number(idKey) ? null : Number(idKey));
                        }}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white p-1 rounded focus:outline-none"
                      >
                        <FaEllipsisV size={14} />
                      </button>

                      {menuOpenId === Number(idKey) && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="mt-2 w-36 bg-[#2A2D3A] rounded shadow-lg text-sm z-10 right-0 absolute"
                        >
                          <button
                            onClick={() => handleEdit(snip)}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-indigo-600 w-full text-left"
                          >
                            <FaEdit size={12} /> Edit
                          </button>
                          <button
                            onClick={() => openDeleteModal(snip)}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-red-600 w-full text-left"
                          >
                            <FaTrash size={12} /> Delete
                          </button>
                        </div>
                      )}
                    </div>

                    {/* snippet content */}
                    <div className="pr-8">
                      <div className="flex items-center gap-2">
                        {getLanguageIcon(snip.language)}
                        <h3
                          className={`font-semibold text-lg ${
                            isSelected ? "text-white" : "text-gray-100"
                          }`}
                        >
                          {snip.title}
                        </h3>
                      </div>

                      {snip.description && (
                        <p
                          className={`mt-2 text-sm ${
                            isSelected ? "text-indigo-100" : "text-gray-300"
                          } line-clamp-2`}
                        >
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
                              isSelected
                                ? "bg-purple-500/30 text-purple-200"
                                : "bg-purple-600/20 text-purple-400"
                            }`}
                          >
                            {tag.name ?? tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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

      {editingSnippet && (
        <EditSnippetModal
          isOpen={!!editingSnippet}
          onClose={() => setEditingSnippet(null)}
          snippet={editingSnippet}
          onUpdated={handleUpdatedSnippet}
        />
      )}
    </>
  );
}
