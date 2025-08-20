"use client";

import { useState, useEffect } from "react";
import Workspaces from "./Workspaces";
import CollectionSidebar from "./CollectionSidebar";
import SnippetsPreview from "./SnippetsPreview";
import CodePreview from "./CodePreview";
import CreateSnippetModal from "./Cards/CreateSnippetModal";

export default function Dashboard() {
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [snippets, setSnippets] = useState<any[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<number | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<number | null>(null);
  const [selectedSnippet, setSelectedSnippet] = useState<any | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [previewVersion, setPreviewVersion] = useState(0);

  // Load workspaces on mount
  useEffect(() => {
    fetch("/api/workspaces")
      .then((r) => r.json())
      .then((data) => {
        setWorkspaces(data);
        if (Array.isArray(data) && data.length > 0) setSelectedWorkspace(data[0].id);
      })
      .catch((err) => console.error("Failed to load workspaces:", err));
  }, []);

  // Fetch collections whenever workspace changes
  useEffect(() => {
    if (!selectedWorkspace) return;

    fetch(`/api/collections?workspaceId=${selectedWorkspace}`)
      .then((r) => r.json())
      .then((data) => {
        setCollections(data);
        setSelectedCollection(Array.isArray(data) && data.length > 0 ? data[0].id : null);
      })
      .catch((err) => console.error("Failed to load collections:", err));
  }, [selectedWorkspace]);

  // Fetch snippets whenever collection changes
  useEffect(() => {
    if (!selectedCollection) {
      setSnippets([]);
      setSelectedSnippet(null);
      return;
    }

    fetch(`/api/snippets?collectionId=${selectedCollection}`)
      .then((r) => r.json())
      .then((data) => {
        setSnippets(data);
        setSelectedSnippet(Array.isArray(data) && data.length > 0 ? data[0] : null);
      })
      .catch((err) => console.error("Failed to load snippets:", err));
  }, [selectedCollection]);

  // --- Workspace selection ---
  const handleSelectWorkspace = (workspaceId: number) => {
    if (workspaceId === selectedWorkspace) {
      // Force refetch of collections even if same workspace
      fetch(`/api/collections?workspaceId=${workspaceId}`)
        .then((r) => r.json())
        .then((data) => {
          setCollections(data);
          setSelectedCollection(Array.isArray(data) && data.length > 0 ? data[0].id : null);
        });
      return;
    }
    setSelectedWorkspace(workspaceId);
  };

  // --- Workspace creation / update / deletion handler ---
  const handleWorkspaceCreated = (ws: any) => {
    setWorkspaces((prev) => {
      if (ws.deleted) {
        // Remove deleted workspace
        return prev.filter((w) => w.id !== ws.id);
      }

      const index = prev.findIndex((w) => w.id === ws.id);
      if (index !== -1) {
        // Update existing workspace (e.g., rename)
        const updated = [...prev];
        updated[index] = ws;
        return updated;
      }

      // Add new workspace
      return [...prev, ws];
    });

    // Handle selection
    if (ws.deleted) {
      setSelectedWorkspace((cur) => {
        if (cur === ws.id) {
          const remaining = workspaces.filter((w) => w.id !== ws.id);
          return remaining[0]?.id ?? null;
        }
        return cur;
      });
    } else {
      setSelectedWorkspace(ws.id);
    }
  };

  // --- Snippet handlers ---
  const handleSnippetCreated = (newSnippet: any) => {
    setSnippets((prev: any[]) => [newSnippet, ...prev]);
    setSelectedSnippet(newSnippet);
  };

  const handleUpdateSnippet = (updatedSnippet: any) => {
    const uId = String(updatedSnippet.id);
    setSnippets((prev: any[]) =>
      prev.some((s) => String(s.id) === uId)
        ? prev.map((s) => (String(s.id) === uId ? updatedSnippet : s))
        : [updatedSnippet, ...prev]
    );
    setSelectedSnippet((cur: any) => (cur && String(cur.id) === uId ? updatedSnippet : cur));
  };

  const handleDeleteSnippet = async (snippetToDelete: any) => {
    try {
      const res = await fetch(`/api/snippets/${snippetToDelete.id}`, { method: "DELETE" });
      if (res.ok) {
        setSnippets((prev: any[]) => prev.filter((s) => String(s.id) !== String(snippetToDelete.id)));
        if (selectedSnippet?.id === snippetToDelete.id) setSelectedSnippet(null);
      } else {
        console.error("Failed to delete snippet:", await res.text());
      }
    } catch (error) {
      console.error("Error deleting snippet:", error);
    }
  };

  const handleAddSnippet = async (title: string) => {
    if (!title || !selectedCollection) return;
    try {
      const res = await fetch("/api/snippets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description: "", code: "", language: "javascript", collectionId: selectedCollection }),
      });
      if (res.ok) {
        const newSnippet = await res.json();
        setSnippets((prev: any[]) => [newSnippet, ...prev]);
        setSelectedSnippet(newSnippet);
      } else console.error("Failed to create snippet:", await res.text());
    } catch (err) {
      console.error("Error creating snippet:", err);
    }
  };

  return (
    <div className="flex h-screen bg-[#0E1116] text-white flex-col md:flex-row">
      {/* Workspaces */}
      <div className="hidden md:block basis-0 min-w-0" style={{ flex: "0.8 1 0%" }}>
        <Workspaces
          workspaces={workspaces}
          selectedWorkspace={selectedWorkspace}
          onSelectWorkspace={handleSelectWorkspace}
          onAddWorkspace={() => {}}
          onWorkspaceCreated={handleWorkspaceCreated}
        />
      </div>

      {/* Collections */}
      <div className="hidden md:block basis-0 min-w-0" style={{ flex: "2.5 1 0%" }}>
        <CollectionSidebar
          collections={collections}
          selectedCollection={selectedCollection}
          onSelectCollection={setSelectedCollection}
          setCollections={setCollections}
          selectedWorkspaceId={selectedWorkspace}
          onAddSnippet={handleAddSnippet}
          onSnippetCreated={handleSnippetCreated}
        />
      </div>

      {/* Snippets */}
      <div className="basis-0 min-w-0" style={{ flex: "4.5 1 0%" }}>
        <SnippetsPreview
          snippets={snippets}
          onSelectSnippet={setSelectedSnippet}
          onEditSnippet={handleUpdateSnippet}
          onDeleteSnippet={handleDeleteSnippet}
          selectedSnippetId={selectedSnippet?.id}
        />
      </div>

      {/* Code */}
      <div className="basis-0 min-w-0" style={{ flex: "6 1 0%" }}>
        <CodePreview
          key={previewVersion}
          snippet={selectedSnippet}
          onUpdated={(updated: any) => {
            const uId = String(updated.id);
            setSelectedSnippet(updated);
            setSnippets((prev: any[]) =>
              prev.some((s) => String(s.id) === uId) ? prev.map((s) => (String(s.id) === uId ? updated : s)) : [updated, ...prev]
            );
            setPreviewVersion((v) => v + 1);
          }}
        />
      </div>

      {/* Create Snippet Modal */}
      <CreateSnippetModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        collectionId={selectedCollection}
        onCreated={handleSnippetCreated}
      />
    </div>
  );
}
