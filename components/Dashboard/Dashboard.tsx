"use client";

import { useEffect, useState } from "react";
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

  const [showWorkspaces, setShowWorkspaces] = useState(false);
  const [showCollections, setShowCollections] = useState(false);

  const [workspaceLoading, setWorkspaceLoading] = useState(false);

  // normalize helper
  const normalizeId = (id: any): number | null => {
    if (id === null || id === undefined) return null;
    if (typeof id === "number") return id;
    const n = Number(id);
    return Number.isNaN(n) ? null : n;
  };

  // fetch collections + initial snippets
  const fetchCollectionsAndInitialSnippets = async (
    workspaceIdNum: number | null,
    signal?: AbortSignal
  ) => {
    if (workspaceIdNum === null) {
      setCollections([]);
      setSelectedCollection(null);
      setSnippets([]);
      setSelectedSnippet(null);
      return;
    }

    try {
      setWorkspaceLoading(true);

      const colRes = await fetch(`/api/collections?workspaceId=${workspaceIdNum}`, { signal });
      if (!colRes.ok) throw new Error("Failed to fetch collections");
      const colData = await colRes.json();
      const cols = Array.isArray(colData) ? colData : [];
      setCollections(cols);

      const firstCollectionId = cols.length > 0 ? normalizeId(cols[0].id) : null;
      setSelectedCollection(firstCollectionId);

      if (firstCollectionId !== null) {
        const snipRes = await fetch(`/api/snippets?collectionId=${firstCollectionId}`, { signal });
        if (!snipRes.ok) throw new Error("Failed to fetch snippets for collection");
        const snipData = await snipRes.json();
        const snips = Array.isArray(snipData) ? snipData : [];
        setSnippets(snips);
        setSelectedSnippet(snips.length > 0 ? snips[0] : null);
      } else {
        setSnippets([]);
        setSelectedSnippet(null);
      }
    } catch (err) {
      if ((err as any)?.name !== "AbortError") {
        console.error("Failed to load collections/snippets for workspace:", err);
      }
    } finally {
      setWorkspaceLoading(false);
    }
  };

  // load workspaces on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/workspaces");
        const data = await res.json();
        if (cancelled) return;

        const list = Array.isArray(data) ? data : [];
        setWorkspaces(list);

        if (list.length > 0) {
          const id = normalizeId(list[0].id);
          setSelectedWorkspace(id);
        } else {
          setSelectedWorkspace(null);
        }
      } catch (err) {
        if ((err as any)?.name !== "AbortError") {
          console.error("Failed to load workspaces:", err);
          setWorkspaces([]);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // fetch collections when workspace changes
  useEffect(() => {
    if (selectedWorkspace === null) {
      setCollections([]);
      setSelectedCollection(null);
      setSnippets([]);
      setSelectedSnippet(null);
      return;
    }

    const controller = new AbortController();
    fetchCollectionsAndInitialSnippets(selectedWorkspace, controller.signal);

    return () => controller.abort();
  }, [selectedWorkspace]);

  // fetch snippets when collection changes
  useEffect(() => {
    if (selectedCollection === null) {
      setSnippets([]);
      setSelectedSnippet(null);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    const fetchSnippetsForCollection = async (collectionIdNum: number) => {
      try {
        const res = await fetch(`/api/snippets?collectionId=${collectionIdNum}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Failed to fetch snippets");
        const data = await res.json();
        if (cancelled) return;
        const arr = Array.isArray(data) ? data : [];
        setSnippets(arr);
        setSelectedSnippet(arr.length > 0 ? arr[0] : null);
      } catch (err) {
        if ((err as any)?.name !== "AbortError") {
          console.error("Failed to load snippets:", err);
        }
      }
    };

    fetchSnippetsForCollection(selectedCollection);

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [selectedCollection]);

  // handlers
  const handleSelectWorkspace = (workspaceId: number | null) => {
    const idNum = normalizeId(workspaceId);
    if (idNum !== null && idNum === selectedWorkspace) {
      fetchCollectionsAndInitialSnippets(idNum);
      return;
    }
    setSelectedWorkspace(idNum);
  };

  const handleWorkspaceCreated = (ws: any) => {
    setWorkspaces((prev) => {
      if (ws?.deleted) {
        return prev.filter((w) => String(w.id) !== String(ws.id));
      }

      const idx = prev.findIndex((w) => String(w.id) === String(ws.id));
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], ...ws };
        return copy;
      }

      return [ws, ...prev];
    });

    if (ws?.deleted) {
      setSelectedWorkspace((cur) => {
        if (String(cur) === String(ws.id)) {
          const remaining = workspaces.filter((w) => String(w.id) !== String(ws.id));
          return normalizeId(remaining[0]?.id);
        }
        return cur;
      });
    } else {
      setSelectedWorkspace(normalizeId(ws.id));
    }
  };

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
      const id = normalizeId(snippetToDelete?.id);
      if (id === null) throw new Error("Invalid snippet id");
      const res = await fetch(`/api/snippets/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSnippets((prev: any[]) => prev.filter((s) => String(s.id) !== String(id)));
        if (selectedSnippet?.id === id) setSelectedSnippet(null);
      } else {
        console.error("Failed to delete snippet:", await res.text());
      }
    } catch (error) {
      console.error("Error deleting snippet:", error);
    }
  };

  const handleAddSnippet = async (title: string) => {
    if (!title || selectedCollection === null) return;
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
        setSnippets((prev: any[]) => [newSnippet, ...prev]);
        setSelectedSnippet(newSnippet);
      } else {
        console.error("Failed to create snippet:", await res.text());
      }
    } catch (err) {
      console.error("Error creating snippet:", err);
    }
  };

  return (
    <div className="relative flex h-screen bg-[#0E1116] text-white flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="flex md:hidden justify-between items-center p-2 bg-[#1A1D24]">
        <button
          onClick={() => setShowWorkspaces(true)}
          className="px-3 py-1 bg-gray-700 rounded-lg"
        >
          Workspaces
        </button>
        <button
          onClick={() => setShowCollections(true)}
          className="px-3 py-1 bg-gray-700 rounded-lg"
        >
          Collections
        </button>
      </div>

      {/* Desktop Workspaces */}
      <div className="hidden md:block w-[70px] min-w-[70px]">
        <Workspaces
          workspaces={workspaces}
          selectedWorkspace={selectedWorkspace}
          onSelectWorkspace={handleSelectWorkspace}
          onAddWorkspace={() => {}}
          onWorkspaceCreated={handleWorkspaceCreated}
        />
      </div>

      {/* Desktop Collections */}
      <div className="hidden md:block w-[240px] min-w-[240px]">
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

      {/* Main Content */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Snippets */}
        <div className="flex-1 overflow-y-auto border-r border-gray-800">
          <SnippetsPreview
            snippets={snippets}
            onSelectSnippet={setSelectedSnippet}
            onEditSnippet={handleUpdateSnippet}
            onDeleteSnippet={handleDeleteSnippet}
            selectedSnippetId={selectedSnippet?.id}
            workspaceLoading={workspaceLoading}
          />
        </div>

        {/* Code */}
         {/* Code */}
  {selectedSnippet && (
    <div className="flex-[1.2] overflow-y-auto">
      <CodePreview
        key={previewVersion}
        snippet={selectedSnippet}
        onUpdated={(updated: any) => {
          const uId = String(updated.id);
          setSelectedSnippet(updated);
          setSnippets((prev: any[]) =>
            prev.some((s) => String(s.id) === uId)
              ? prev.map((s) => (String(s.id) === uId ? updated : s))
              : [updated, ...prev]
          );
          setPreviewVersion((v) => v + 1);
        }}
      />
    </div>
  )}
      </div>

      {/* Create Snippet Modal */}
      <CreateSnippetModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        collectionId={selectedCollection}
        onCreated={handleSnippetCreated}
      />

      {/* Mobile Workspaces Drawer */}
      {showWorkspaces && (
        <div className="fixed inset-0 bg-gray-900 z-50 flex justify-start md:hidden">
          <div className="w-3/4 max-w-xs bg-gray-900 h-full shadow-lg">
            <Workspaces
              workspaces={workspaces}
              selectedWorkspace={selectedWorkspace}
              onSelectWorkspace={(id) => {
                handleSelectWorkspace(id);
                setShowWorkspaces(false);
              }}
              onWorkspaceCreated={handleWorkspaceCreated}
              onAddWorkspace={() => {}}
            />
          </div>
          <button onClick={() => setShowWorkspaces(false)} className="flex-1"></button>
        </div>
      )}

      {/* Mobile Collections Drawer */}
      {showCollections && (
        <div className="absolute inset-0 bg-black bg-opacity-70 z-50 flex">
          <div className="w-3/4 bg-[#0E1116] p-4 overflow-auto">
            <CollectionSidebar
              collections={collections}
              selectedCollection={selectedCollection}
              onSelectCollection={(id: number | null) => {
                setSelectedCollection(id);
                setShowCollections(false);
              }}
              setCollections={setCollections}
              selectedWorkspaceId={selectedWorkspace}
              onAddSnippet={handleAddSnippet}
              onSnippetCreated={handleSnippetCreated}
            />
          </div>
          <button onClick={() => setShowCollections(false)} className="flex-1"></button>
        </div>
      )}
    </div>
  );
}
