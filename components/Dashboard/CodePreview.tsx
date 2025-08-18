"use client";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { useState } from "react";
import { FiCopy, FiEdit } from "react-icons/fi";

export default function CodePreview({ snippet }: { snippet: any | null }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!snippet?.code) return;
    await navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!snippet) {
    return (
      <section className="h-full p-6 overflow-y-auto bg-[#141820] flex items-center justify-center">
        <p className="text-gray-400">Select a snippet to view details</p>
      </section>
    );
  }

  return (
    <section className="h-full p-6 overflow-y-auto bg-[#141820]">
      <h2 className="text-xl font-bold">{snippet.title}</h2>
      <p className="text-gray-400 text-sm">{snippet.description}</p>

      <div className="mt-3 flex gap-2 flex-wrap">
        {(snippet.tags ?? []).map((tag: any) => (
          <span
            key={tag.id ?? tag.name}
            className="px-2 py-0.5 text-xs bg-purple-600/20 text-purple-400 rounded"
          >
            {tag.name}
          </span>
        ))}
      </div>

      {/* Code block with header */}
      <div className="mt-4 rounded-lg bg-[#0f131a] overflow-hidden">
        {/* header */}
        <div className="flex items-center justify-between px-4 py-2 text-xs font-mono text-gray-400">
          <span className="lowercase tracking-wide">
            {snippet.language || "plaintext"}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/5 transition"
            >
              <FiCopy size={14} />
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              onClick={() => alert("Edit feature coming soon!")}
              className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/5 transition"
            >
              <FiEdit size={14} />
              Edit
            </button>
          </div>
        </div>

        {/* scrollable code area */}
        <div className="max-h-[400px] overflow-auto clean-syntax">
          <SyntaxHighlighter
            language={snippet.language}
            style={oneDark}
            showLineNumbers={false}
            wrapLongLines={false} // keep horizontal scrollbar if long lines
            customStyle={{
              margin: 0,
              padding: "1rem 1.2rem",
              background: "transparent",
              boxShadow: "none",
              border: "none",
              fontSize: "0.9rem",
              lineHeight: "1.55",
              minWidth: "100%",
            }}
            codeTagProps={{
              style: {
                background: "transparent",
                boxShadow: "none",
                border: "none",
                tabSize: 2 as unknown as string,
              },
            }}
            lineProps={() => ({
              style: {
                background: "transparent",
                border: "none",
                boxShadow: "none",
              },
            })}
          >
            {snippet.code}
          </SyntaxHighlighter>
        </div>
      </div>

      {/* force remove unwanted grey borders but keep scrollbar */}
      <style jsx>{`
        .clean-syntax :global(pre) {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
      `}</style>
    </section>
  );
}
