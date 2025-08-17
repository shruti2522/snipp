"use client";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

export default function CodePreview({ snippet }: { snippet: any | null }) {
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

      <div className="mt-4 rounded overflow-hidden border border-gray-700">
        <SyntaxHighlighter
          language={snippet.language}
          style={oneDark}
          customStyle={{
            margin: 0,
            padding: "1rem",
            background: "transparent",
            fontSize: "0.85rem",
          }}
          wrapLongLines
        >
          {snippet.code}
        </SyntaxHighlighter>
      </div>
    </section>
  );
}
