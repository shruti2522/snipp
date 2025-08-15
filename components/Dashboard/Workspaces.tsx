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
    <aside className="w-16 flex flex-col items-center py-4 bg-[#141820] border-r border-gray-800">
      <div className="flex flex-col gap-3 flex-1">
        {workspaces.map((ws) => (
          <div
            key={ws.id}
            className={`h-10 w-10 rounded-lg flex items-center justify-center uppercase cursor-pointer ${
              selectedWorkspace === ws.id
                ? "bg-indigo-600"
                : "bg-gray-700 hover:opacity-80"
            }`}
            onClick={() => onSelectWorkspace(ws.id)}
          >
            {ws.name[0]}
          </div>
        ))}
      </div>
      <button
        className="h-10 w-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600"
        onClick={onAddWorkspace}
      >
        <FaPlus />
      </button>
    </aside>
  );
}
