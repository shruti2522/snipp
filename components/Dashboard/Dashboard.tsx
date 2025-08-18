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

  const [previewVersion, setPreviewVersion] = useState(0);


  useEffect(() => {
    fetch("/api/workspaces")
      .then((r) => r.json())
      .then((data) => {
        setWorkspaces(data);
        if (Array.isArray(data) && data.length > 0) setSelectedWorkspace(data[0].id);
      })
      .catch((err) => console.error("Failed to load workspaces:", err));
  }, []);

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

  useEffect(() => {
    if (!selectedCollection) return;
    fetch(`/api/snippets?collectionId=${selectedCollection}`)
      .then((r) => r.json())
      .then((data) => {
        setSnippets(data);
        setSelectedSnippet(Array.isArray(data) && data.length > 0 ? data[0] : null);
      })
      .catch((err) => console.error("Failed to load snippets:", err));
  }, [selectedCollection]);

  // Listen for snippet-updated window event as a fallback (dispatched by CodePreview)
  useEffect(() => {
    const handler = (e: any) => {
      const updated = e?.detail;
      if (!updated) return;
      const uId = String(updated.id);
      console.debug("[Dashboard] snippet-updated event received:", updated);

      setSnippets((prev: any[]) => {
        const found = prev.some((s: any) => String(s.id) === uId);
        if (found) return prev.map((s: any) => (String(s.id) === uId ? updated : s));
        return [updated, ...prev];
      });

      setSelectedSnippet((cur: any) => {
        if (!cur) return cur;
        return String(cur.id) === uId ? updated : cur;
      });
    };

    // also listen for postMessage for extra redundancy
    const pmHandler = (msg: any) => {
      try {
        if (msg?.data?.type === "snippet-updated") {
          console.debug("[Dashboard] postMessage received snippet-updated:", msg.data.payload);
          const updated = msg.data.payload;
          const uId = String(updated.id);
          setSnippets((prev: any[]) => {
            const found = prev.some((s: any) => String(s.id) === uId);
            if (found) return prev.map((s: any) => (String(s.id) === uId ? updated : s));
            return [updated, ...prev];
          });
          setSelectedSnippet((cur: any) => (cur && String(cur.id) === uId ? updated : cur));
        }
      } catch (e) {
        // ignore
      }
    };

    window.addEventListener("snippet-updated", handler as EventListener);
    window.addEventListener("message", pmHandler as EventListener);

    return () => {
      window.removeEventListener("snippet-updated", handler as EventListener);
      window.removeEventListener("message", pmHandler as EventListener);
    };
  }, []);

  // Handler for creating snippets (used by CreateSnippetModal)
  const handleSnippetCreated = (newSnippet: any) => {
    console.debug("[Dashboard] handleSnippetCreated:", newSnippet);
    setSnippets((prev: any[]) => [newSnippet, ...prev]);
    setSelectedSnippet(newSnippet);
  };

  // Handler for updating snippets AFTER modal's PATCH succeeds
  const handleUpdateSnippet = (updatedSnippet: any) => {
    console.debug("[Dashboard] handleUpdateSnippet called:", updatedSnippet);
    const uId = String(updatedSnippet.id);

    setSnippets((prev: any[]) => {
      const found = prev.some((s: any) => String(s.id) === uId);
      if (found) return prev.map((s: any) => (String(s.id) === uId ? updatedSnippet : s));
      return [updatedSnippet, ...prev];
    });

    setSelectedSnippet((cur: any) => (cur && String(cur.id) === uId ? updatedSnippet : cur));
  };

  // Handler for deleting snippets — Dashboard performs DELETE
  const handleDeleteSnippet = async (snippetToDelete: any) => {
    try {
      const res = await fetch(`/api/snippets/${snippetToDelete.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSnippets((prev: any[]) => prev.filter((snippet: any) => String(snippet.id) !== String(snippetToDelete.id)));
        if (selectedSnippet?.id === snippetToDelete.id) {
          setSelectedSnippet(null);
        }
      } else {
        console.error("Failed to delete snippet:", await res.text());
      }
    } catch (error) {
      console.error("Error deleting snippet:", error);
    }
  };

  // Helper to create a snippet programmatically (kept, but the modal handles create flow)
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
        console.debug("[Dashboard] created snippet:", newSnippet);
        setSnippets((prev: any[]) => [newSnippet, ...prev]);
        setSelectedSnippet(newSnippet);
      } else {
        console.error("Failed to create snippet:", await res.text());
      }
    } catch (error) {
      console.error("Error creating snippet:", error);
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
        <div className="text-sm text-gray-300">{selectedSnippet ? selectedSnippet.title : "No snippet selected"}</div>
      </div>

      {/* Desktop layout (md+): four columns with fixed ratios */}
      {/* Workspace */}
      <div className="hidden md:block basis-0 min-w-0" style={{ flex: "0.8 1 0%" }}>
        <Workspaces workspaces={workspaces} selectedWorkspace={selectedWorkspace} onSelectWorkspace={setSelectedWorkspace} onAddWorkspace={() => {}} />
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
  key={previewVersion}              // <--- force remount when previewVersion changes
  snippet={selectedSnippet}
  onUpdated={(updated: any) => {
    console.debug("[Dashboard] CodePreview.onUpdated callback received:", updated);
    const uId = String(updated.id);

    // update selectedSnippet and snippets list
    setSelectedSnippet(updated);
    setSnippets((prev: any[]) => {
      const found = prev.some((s: any) => String(s.id) === uId);
      if (found) return prev.map((s: any) => (String(s.id) === uId ? updated : s));
      return [updated, ...prev];
    });

    // force remount of preview so it immediately renders merged data
    setPreviewVersion((v) => v + 1);
  }}
/>
      </div>

      {/* Create Snippet Modal */}
      <CreateSnippetModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} collectionId={selectedCollection} onCreated={handleSnippetCreated} />

      {/* ----- Mobile Left Drawer: Workspaces + Collections ----- */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition ${leftOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!leftOpen}
      >
        {/* backdrop */}
        <div className={`absolute inset-0 bg-black/50 transition-opacity ${leftOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setLeftOpen(false)} />
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
              <Workspaces workspaces={workspaces} selectedWorkspace={selectedWorkspace} onSelectWorkspace={(id) => setSelectedWorkspace(id)} onAddWorkspace={() => {}} />
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
                onSnippetCreated={handleSnippetCreated}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
