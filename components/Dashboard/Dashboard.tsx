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

  // NEW: workspace-level loading state
  const [workspaceLoading, setWorkspaceLoading] = useState(false);

  // Helper: normalize id values to number | null
  const normalizeId = (id: any): number | null => {
    if (id === null || id === undefined) return null;
    if (typeof id === "number") return id;
    const n = Number(id);
    return Number.isNaN(n) ? null : n;
  };

  // Fetch collections + initial snippets for a workspace (used in effect & manual re-fetch)
  const fetchCollectionsAndInitialSnippets = async (workspaceIdNum: number | null, signal?: AbortSignal) => {
    if (workspaceIdNum === null) {
      setCollections([]);
      setSelectedCollection(null);
      setSnippets([]);
      setSelectedSnippet(null);
      return;
    }

    try {
      setWorkspaceLoading(true);

      // parallelize collection fetch and (optionally) initial snippet fetch once we know first collection
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
      if ((err as any)?.name === "AbortError") {
        // fetch was aborted; ignore
      } else {
        console.error("Failed to load collections/snippets for workspace:", err);
      }
    } finally {
      setWorkspaceLoading(false);
    }
  };

  // Load workspaces on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/workspaces");
        const data = await res.json();
        if (cancelled) return;

        const list = Array.isArray(data) ? data : [];
        setWorkspaces(list);

        // select first workspace if none selected
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

  // Fetch collections + initial snippets whenever workspace changes (shows workspaceLoading)
  useEffect(() => {
    // if selectedWorkspace is null -> clear
    if (selectedWorkspace === null) {
      setCollections([]);
      setSelectedCollection(null);
      setSnippets([]);
      setSelectedSnippet(null);
      return;
    }

    const controller = new AbortController();
    fetchCollectionsAndInitialSnippets(selectedWorkspace, controller.signal);

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWorkspace]);

  // Fetch snippets whenever collection changes (not workspaceLoading — this is collection-level)
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
        const res = await fetch(`/api/snippets?collectionId=${collectionIdNum}`, { signal: controller.signal });
        if (!res.ok) throw new Error("Failed to fetch snippets");
        const data = await res.json();
        if (cancelled) return;
        const arr = Array.isArray(data) ? data : [];
        setSnippets(arr);
        setSelectedSnippet(arr.length > 0 ? arr[0] : null);
      } catch (err) {
        if ((err as any)?.name === "AbortError") {
          // ignore
        } else {
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

  // --- Workspace selection ---
  const handleSelectWorkspace = (workspaceId: number | null) => {
    const idNum = normalizeId(workspaceId);
    // If same workspace clicked, force refetch of collections + initial snippets
    if (idNum !== null && idNum === selectedWorkspace) {
      fetchCollectionsAndInitialSnippets(idNum);
      return;
    }
    setSelectedWorkspace(idNum);
  };

  // --- Workspace creation / update / deletion handler ---
  const handleWorkspaceCreated = (ws: any) => {
    setWorkspaces((prev) => {
      // deletion signal: { id, deleted: true }
      if (ws?.deleted) {
        return prev.filter((w) => String(w.id) !== String(ws.id));
      }

      // update existing
      const idx = prev.findIndex((w) => String(w.id) === String(ws.id));
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], ...ws };
        return copy;
      }

      // add new workspace (push to front)
      return [ws, ...prev];
    });

    // selection behavior
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

  // --- Snippet handlers ---
  const handleSnippetCreated = (newSnippet: any) => {
    setSnippets((prev: any[]) => [newSnippet, ...prev]);
    setSelectedSnippet(newSnippet);
  };

  const handleUpdateSnippet = (updatedSnippet: any) => {
    const uId = String(updatedSnippet.id);
    setSnippets((prev: any[]) =>
      prev.some((s) => String(s.id) === uId) ? prev.map((s) => (String(s.id) === uId ? updatedSnippet : s)) : [updatedSnippet, ...prev]
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
          workspaceLoading={workspaceLoading} // <-- NEW PROP
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
