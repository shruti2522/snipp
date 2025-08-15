"use client";
import { AiOutlineSearch } from "react-icons/ai";

export default function Snippets({
  snippets,
  onSelectSnippet,
}: {
  snippets: any[];
  onSelectSnippet: (snippet: any) => void;
}) {
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
        {snippets.map((snip) => (
          <div
            key={snip.id}
            className="bg-[#1A1D29] p-4 rounded border border-transparent hover:border-indigo-500 hover:scale-[1.01] transition cursor-pointer"
            onClick={() => onSelectSnippet(snip)}
          >
            <h3 className="font-semibold">{snip.title}</h3>
            <div className="mt-2 flex gap-2 flex-wrap">
              {snip.tags.map((tag: any) => (
                <span
                  key={tag.id}
                  className="px-2 py-0.5 text-xs bg-purple-600/20 text-purple-400 rounded"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
