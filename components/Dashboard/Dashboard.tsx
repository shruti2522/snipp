"use client";

import { useState, useEffect } from "react";
import { FaPlus, FaCog } from "react-icons/fa";
import Workspaces from "./Workspaces";
import Snippets from "./SnippetPreview";
import SnippetPreview from "./CodePreview";
import CollectionSidebar from "./CollectionSidebar";

export default function Dashboard() {
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [snippets, setSnippets] = useState<any[]>([]);

  const [selectedWorkspace, setSelectedWorkspace] = useState<number | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<number | null>(null);
  const [selectedSnippet, setSelectedSnippet] = useState<any | null>(null);

  // Fetch workspaces
  useEffect(() => {
    fetch("/api/workspaces")
      .then(res => res.json())
      .then(data => {
        setWorkspaces(data);
        if (data.length > 0) setSelectedWorkspace(data[0].id);
      });
  }, []);

  // Fetch collections for workspace
  useEffect(() => {
    if (selectedWorkspace) {
      fetch(`/api/collections?workspaceId=${selectedWorkspace}`)
        .then(res => res.json())
        .then(data => {
          setCollections(data);
          setSelectedCollection(data.length > 0 ? data[0].id : null);
        });
    }
  }, [selectedWorkspace]);

  // Fetch snippets for collection
  useEffect(() => {
    if (selectedCollection) {
      fetch(`/api/snippets?collectionId=${selectedCollection}`)
        .then(res => res.json())
        .then(data => {
          setSnippets(data);
          setSelectedSnippet(data.length > 0 ? data[0] : null);
        });
    }
  }, [selectedCollection]);

  // === Handlers ===
  const handleAddCollection = async (name: string) => {
    if (!name.trim() || !selectedWorkspace) return;
    const res = await fetch("/api/collections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, workspaceId: selectedWorkspace })
    });
    if (res.ok) {
      const updated = await fetch(`/api/collections?workspaceId=${selectedWorkspace}`).then(r => r.json());
      setCollections(updated);
    }
  };

  const handleAddSnippet = async (title: string) => {
    if (!title.trim() || !selectedCollection) return;
    const res = await fetch("/api/snippets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description: "",
        code: "",
        language: "javascript",
        collectionId: selectedCollection
      })
    });
    if (res.ok) {
      const updated = await fetch(`/api/snippets?collectionId=${selectedCollection}`).then(r => r.json());
      setSnippets(updated);
    }
  };

  return (
    <div className="flex h-screen bg-[#0E1116] text-white">
      {/* Workspace selector */}
      <Workspaces
        workspaces={workspaces}
        selectedWorkspace={selectedWorkspace}
        onSelectWorkspace={setSelectedWorkspace} onAddWorkspace={function (): void {
          throw new Error("Function not implemented.");
        } }      />

      {/* Collections Sidebar */}
     <CollectionSidebar
      collections={collections}
      selectedCollection={selectedCollection}
      onSelectCollection={setSelectedCollection}
      onAddSnippet={handleAddSnippet}
      setCollections={setCollections}
      selectedWorkspaceId={selectedWorkspace} // <-- pass the workspace ID
    />

      {/* Main content */}
      <main className="flex flex-1">
        <Snippets
          snippets={snippets}
          onSelectSnippet={setSelectedSnippet}
        />
        <SnippetPreview snippet={selectedSnippet} />
      </main>
    </div>
  );
}