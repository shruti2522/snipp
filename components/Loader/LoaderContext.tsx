// context/LoaderContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import Loader from "@/components/Loader/Loader";

type LoaderContextType = {
  showLoader: () => void;
  hideLoader: () => void;
};

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export function LoaderProvider({ children }: { children: ReactNode }) {
  const [loadingCount, setLoadingCount] = useState(0);

  const showLoader = () => setLoadingCount((c) => c + 1);
  const hideLoader = () => setLoadingCount((c) => Math.max(0, c - 1));

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader }}>
      {children}
      {loadingCount > 0 && <Loader />}
    </LoaderContext.Provider>
  );
}

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) throw new Error("useLoader must be used within LoaderProvider");
  return context;
};
