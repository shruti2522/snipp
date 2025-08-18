"use client";

import { useState, useEffect, SetStateAction } from "react";
import Workspaces from "./Workspaces";
import CollectionSidebar from "./CollectionSidebar";
import SnippetsPreview from "./SnippetsPreview";
import CodePreview from "./CodePreview";
import CreateSnippetModal from "./Cards/CreateSnippetModal";
import { FaBars } from "react-icons/fa";

export default function Dashboard() {
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);

  const [snippets, setSnippets] = useState<any[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<number | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<number | null>(null);
  const [selectedSnippet, setSelectedSnippet] = useState<any | null>(null);

  // modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // mobile drawer state
  const [leftOpen, setLeftOpen] = useState(false);

  useEffect(() => {
    fetch("/api/workspaces")
      .then((r) => r.json())
      .then((data) => {
        setWorkspaces(data);
        if (data.length > 0) setSelectedWorkspace(data[0].id);
      });
  }, []);

  useEffect(() => {
    if (!selectedWorkspace) return;
    fetch(`/api/collections?workspaceId=${selectedWorkspace}`)
      .then((r) => r.json())
      .then((data) => {
        setCollections(data);
        setSelectedCollection(data.length > 0 ? data[0].id : null);
      });
  }, [selectedWorkspace]);

  useEffect(() => {
    if (!selectedCollection) return;
    fetch(`/api/snippets?collectionId=${selectedCollection}`)
      .then((r) => r.json())
      .then((data) => {
        setSnippets(data);
        setSelectedSnippet(data.length > 0 ? data[0] : null);
      });
  }, [selectedCollection]);

  // Updated handleAddSnippet that adds to state immediately
  const handleAddSnippet = async (title: string) => {
    if (!title || !selectedCollection) return;
    
    try {
      const res = await fetch("/api/snippets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: "",
          code: "",
          language: "javascript",
          collectionId: selectedCollection,
        }),
      });
      
      if (res.ok) {
        const newSnippet = await res.json();
        // Add the new snippet to the beginning of the list immediately
        setSnippets(prev => [newSnippet, ...prev]);
        // Optionally select the new snippet
        setSelectedSnippet(newSnippet);
      }
    } catch (error) {
      console.error('Error creating snippet:', error);
    }
  };

  // Handler for when a snippet is created via the modal
  const handleSnippetCreated = (newSnippet: any) => {
    // Add the new snippet to the beginning of the list immediately
    setSnippets(prev => [newSnippet, ...prev]);
    // Select the new snippet
    setSelectedSnippet(newSnippet);
  };

  // Handler for editing snippets
  const handleEditSnippet = async (updatedSnippet: any) => {
    try {
      const res = await fetch(`/api/snippets/${updatedSnippet.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSnippet),
      });
      
      if (res.ok) {
        const updated = await res.json();
        // Update the snippet in state immediately
        setSnippets(prev => 
          prev.map(snippet => 
            snippet.id === updatedSnippet.id ? updated : snippet
          )
        );
        // Update selected snippet if it was the one being edited
        if (selectedSnippet?.id === updatedSnippet.id) {
          setSelectedSnippet(updated);
        }
      }
    } catch (error) {
      console.error('Error updating snippet:', error);
    }
  };

  // Handler for deleting snippets
  const handleDeleteSnippet = async (snippetToDelete: any) => {
    
    try {
      const res = await fetch(`/api/snippets/${snippetToDelete.id}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        // Remove from state immediately
        setSnippets(prev => prev.filter(snippet => snippet.id !== snippetToDelete.id));
        // Clear selection if the deleted snippet was selected
        if (selectedSnippet?.id === snippetToDelete.id) {
          setSelectedSnippet(null);
        }
      }
    } catch (error) {
      console.error('Error deleting snippet:', error);
    }
  };

  return (
    <div className="flex h-screen bg-[#0E1116] text-white flex-col md:flex-row">
      {/* Mobile top bar */}
      <div className="flex items-center justify-between md:hidden p-3 border-b border-gray-800">
        <button
          className="inline-flex items-center gap-2 px-3 py-2 rounded bg-[#1A1D29] border border-gray-800"
          onClick={() => setLeftOpen(true)}
          aria-label="Open sidebar"
        >
          <FaBars /> Menu
        </button>
        <div className="text-sm text-gray-300">
          {selectedSnippet ? selectedSnippet.title : "No snippet selected"}
        </div>
      </div>

      {/* Desktop layout (md+): four columns with fixed ratios */}
      {/* Workspace */}
      <div className="hidden md:block basis-0 min-w-0" style={{ flex: "0.8 1 0%" }}>
        <Workspaces
          workspaces={workspaces}
          selectedWorkspace={selectedWorkspace}
          onSelectWorkspace={setSelectedWorkspace}
          onAddWorkspace={() => {}}
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
          onSnippetCreated={handleSnippetCreated} // Add this new prop
        />
      </div>

      {/* Snippets */}
      <div className="basis-0 min-w-0" style={{ flex: "4 1 0%" }}>
        <SnippetsPreview
          snippets={snippets}
          onSelectSnippet={setSelectedSnippet}
          onEditSnippet={handleEditSnippet}
          onDeleteSnippet={handleDeleteSnippet}
          selectedSnippetId={selectedSnippet?.id}
        />
      </div>

      {/* Code */}
      <div className="basis-0 min-w-0" style={{ flex: "6 1 0%" }}>
        <CodePreview snippet={selectedSnippet} />
      </div>

      {/* Create Snippet Modal */}
      <CreateSnippetModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        collectionId={selectedCollection}
        onCreated={handleSnippetCreated}
      />

      {/* ----- Mobile Left Drawer: Workspaces + Collections ----- */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition ${
          leftOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!leftOpen}
      >
        {/* backdrop */}
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity ${leftOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setLeftOpen(false)}
        />
        {/* panel */}
        <div
          className={`absolute left-0 top-0 h-full w-[85%] max-w-[360px] bg-[#0E1116] border-r border-gray-800 translate-x-0 transition-transform ${
            leftOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
        >
          <div className="h-full flex">
            <div className="basis-0 min-w-0" style={{ flex: "1 1 0%" }}>
              <Workspaces
                workspaces={workspaces}
                selectedWorkspace={selectedWorkspace}
                onSelectWorkspace={(id) => {
                  setSelectedWorkspace(id);
                }}
                onAddWorkspace={() => {}}
              />
            </div>
            <div className="basis-0 min-w-0" style={{ flex: "2 1 0%" }}>
              <CollectionSidebar
                collections={collections}
                selectedCollection={selectedCollection}
                onSelectCollection={(id: SetStateAction<number | null>) => {
                  setSelectedCollection(id);
                  // close drawer after choosing a collection
                  setLeftOpen(false);
                }}
                setCollections={setCollections}
                selectedWorkspaceId={selectedWorkspace}
                onAddSnippet={handleAddSnippet}
                onSnippetCreated={handleSnippetCreated} // for dynamic rendering of newly created snippets
              />
            </div>
          </div>
        </div>
      </div>
      {/* ----- /Mobile Left Drawer ----- */}
    </div>
  );
}
