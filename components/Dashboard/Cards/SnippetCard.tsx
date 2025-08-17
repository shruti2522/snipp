"use client";
import { FaEllipsisV, FaEdit, FaTrash } from "react-icons/fa";
import {
  SiJavascript,
  SiTypescript,
  SiPython,
  SiCplusplus,
  SiHtml5,
  SiCss3,
} from "react-icons/si";

export default function SnippetCard({
  snippet,
  isMenuOpen,
  onSelect,
  onToggleMenu,
  onEdit,
  onDelete,
}: {
  snippet: any;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onSelect: (snip: any) => void;
  onEdit?: (snip: any) => void;
  onDelete?: (snip: any) => void;
}) {
  // map languages to icons
  const getLanguageIcon = (lang: string) => {
    switch (lang.toLowerCase()) {
      case "javascript":
        return <SiJavascript className="text-yellow-400" size={22} />;
      case "typescript":
        return <SiTypescript className="text-blue-500" size={22} />;
      case "python":
        return <SiPython className="text-green-400" size={22} />;
      case "c++":
        return <SiCplusplus className="text-blue-400" size={22} />;
      case "html":
        return <SiHtml5 className="text-orange-500" size={22} />;
      case "css":
        return <SiCss3 className="text-blue-400" size={22} />;
      default:
        return <SiJavascript className="text-gray-400" size={22} />;
    }
  };

  return (
    <div
      className="relative group cursor-pointer rounded-xl p-5 border border-gray-700/60 bg-gradient-to-br from-[#1E2230] via-[#1C1F29] to-[#181B24] hover:from-indigo-600/20 hover:to-purple-600/20 transition"
      onClick={onSelect}
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-black/40">
            {getLanguageIcon(snippet.language)}
          </div>
          <h3 className="text-lg font-semibold text-white">{snippet.title}</h3>
        </div>

        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleMenu();
            }}
            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white p-1 rounded"
          >
            <FaEllipsisV size={14} />
          </button>

          {isMenuOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 mt-2 w-36 bg-[#2A2D3A] rounded-lg shadow-lg text-sm z-10"
            >
              <button
                onClick={onEdit}
                className="flex items-center gap-2 px-3 py-2 hover:bg-indigo-600 w-full text-left"
              >
                <FaEdit size={12} /> Edit
              </button>
              <button
                onClick={onDelete}
                className="flex items-center gap-2 px-3 py-2 hover:bg-red-600 w-full text-left"
              >
                <FaTrash size={12} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      <div className="mt-3 flex gap-2 flex-wrap">
        {snippet.tags?.map((tag: any) => (
          <span
            key={tag.id}
            className="px-2 py-0.5 text-xs bg-purple-600/20 text-purple-400 rounded"
          >
            {tag.name}
          </span>
        ))}
      </div>
    </div>
  );
}
