// app/dashboard/page.tsx
"use client";
import { FaPlus, FaCog } from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

export default function Dashboard() {
  const [selectedSnippet] = useState({
    title: "Routing",
    description: "this is a next routing",
    tags: ["searchparams", "updateURL"],
    code: `const updateURL = (snippet: any) => {
  const currentUrl = new URL(window.location.href);
  const searchParams = new URLSearchParams(currentUrl.search);

  searchParams.set("workspace", snippet.workspace_id);
  searchParams.set("collection", snippet.category_id);
  searchParams.set("snippet", snippet._id);

  const newUrl = \`\${currentUrl.origin}\${currentUrl.pathname}?\${searchParams.toString()}\`;

  // Update the URL in the browser
  window.history.replaceState({}, "", newUrl);
  handleClose();
};`,
    language: "javascript"
  });

  return (
    <div className="flex h-screen bg-[#0E1116] text-white">
      {/* Sidebar */}
      <aside className="w-60 flex flex-col bg-[#141820] border-r border-gray-800">
        <div className="flex items-center justify-center h-16 border-b border-gray-800">
          <img src="/logo.svg" alt="Logo" className="h-8" />
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {[
            { name: "FrontEnd", color: "bg-green-500" },
            { name: "Backend", color: "bg-yellow-500" },
            { name: "React Buttons", color: "bg-red-500" },
            { name: "React Hooks", color: "bg-purple-500" },
            { name: "UI Things", color: "bg-blue-500" },
            { name: "Authentication", color: "bg-pink-500" }
          ].map((ws, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-2 hover:bg-gray-800/50 rounded cursor-pointer"
            >
              <span className={`h-3 w-3 rounded-full ${ws.color}`} />
              <span className="truncate">{ws.name}</span>
            </div>
          ))}
        </div>

        <div className="p-3 mt-auto border-t border-gray-800 flex items-center justify-between">
          <button className="p-2 hover:bg-gray-800 rounded">
            <FaPlus />
          </button>
          <button className="p-2 hover:bg-gray-800 rounded">
            <FaCog />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex flex-1">
        {/* Snippet List */}
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
            {[
              { title: "Button", tags: ["button", "react"], code: "<Button>...", language: "jsx" },
              { title: "UI theme", tags: ["input", "button"], code: "<input>...", language: "jsx" },
              selectedSnippet
            ].map((snip, idx) => (
              <div
                key={idx}
                className="bg-[#1A1D29] p-4 rounded border border-transparent hover:border-indigo-500 hover:scale-[1.01] transition cursor-pointer"
              >
                <h3 className="font-semibold">{snip.title}</h3>
                <div className="mt-2 flex gap-2 flex-wrap">
                  {snip.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 text-xs bg-purple-600/20 text-purple-400 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Code Preview */}
        <section className="w-[50%] p-6 overflow-y-auto bg-[#141820]">
          <h2 className="text-xl font-bold">{selectedSnippet.title}</h2>
          <p className="text-gray-400 text-sm">{selectedSnippet.description}</p>

          <div className="mt-3 flex gap-2 flex-wrap">
            {selectedSnippet.tags.map((tag, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-xs bg-purple-600/20 text-purple-400 rounded"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Syntax Highlighted Code */}
          <div className="mt-4 rounded overflow-hidden border border-gray-700">
            <SyntaxHighlighter
  language={selectedSnippet.language}
  style={oneDark}
  customStyle={{
    margin: 0,
    padding: "1rem",
    background: "transparent",  // removes the grey background
    fontSize: "0.85rem"
  }}
  codeTagProps={{
    style: { background: "transparent" } // also make sure the <code> tag has no bg
  }}
  wrapLongLines
>
  {selectedSnippet.code}
</SyntaxHighlighter>

          </div>
        </section>
      </main>
    </div>
  );
}
