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
  const gradients = [
    "from-indigo-500 via-purple-500 to-pink-500",
    "from-purple-500 via-pink-500 to-indigo-400",
    "from-pink-500 via-indigo-500 to-purple-500",
    "from-indigo-400 via-purple-400 to-pink-400",
  ];

  return (
    <aside className="h-full flex flex-col items-center py-4 bg-[#141820] border-r border-gray-800">
      <div className="flex flex-col gap-3 flex-1 w-full items-center">
        {workspaces.map((ws, i) => (
          <div
            key={ws.id}
            className={`aspect-square w-1/2 rounded-xl flex items-center justify-center uppercase cursor-pointer select-none transition-all duration-300
              ${
                selectedWorkspace === ws.id
                  ? `bg-gradient-to-r ${gradients[i % gradients.length]} text-white shadow-[0_0_15px_rgba(147,51,234,0.6)] scale-105`
                  : `bg-gray-800 text-gray-200 hover:scale-105 hover:brightness-110 hover:shadow-[0_0_10px_rgba(99,102,241,0.4)]`
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
        <FaPlus className="text-white" />
      </button>
    </aside>
  );
}
