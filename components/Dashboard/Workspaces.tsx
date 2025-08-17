"use client";
import { FaPlus } from "react-icons/fa";

export default function Workspaces({
  workspaces,
  selectedWorkspace,
  onSelectWorkspace,
  onAddWorkspace,
}: {
  workspaces: any[];
  selectedWorkspace: number | null;
  onSelectWorkspace: (id: number) => void;
  onAddWorkspace: () => void;
}) {
  return (
    <aside className="h-full flex flex-col items-center py-4 bg-[#141820] border-r border-gray-800">
      <div className="flex flex-col gap-3 flex-1 w-full items-center">
        {workspaces.map((ws) => (
          <div
            key={ws.id}
            className={`aspect-square w-1/2 rounded-lg flex items-center justify-center uppercase cursor-pointer select-none
              ${
                selectedWorkspace === ws.id
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-700 text-gray-200 hover:opacity-80"
              }`}
            onClick={() => onSelectWorkspace(ws.id)}
            title={ws.name}
          >
            {typeof ws.name === "string" && ws.name.length > 0 ? ws.name[0] : "W"}
          </div>
        ))}
      </div>

      <button
        className="aspect-square w-1/2 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600 mt-3"
        onClick={onAddWorkspace}
        aria-label="Add workspace"
        title="Add workspace"
      >
        <FaPlus />
      </button>
    </aside>
  );
}
