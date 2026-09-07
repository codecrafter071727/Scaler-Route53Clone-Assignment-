"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type DetailsPanelContextValue = {
  selectedId: number | null;
  detailsOpen: boolean;
  selectZone: (id: number) => void;
  setSelectedId: (
    id: number | null | ((prev: number | null) => number | null),
  ) => void;
  setDetailsOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  toggleDetails: () => void;
};

const DetailsPanelContext = createContext<DetailsPanelContextValue | null>(null);

export function DetailsPanelProvider({ children }: { children: ReactNode }) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const selectZone = useCallback((id: number) => {
    setSelectedId(id);
    setDetailsOpen(true);
  }, []);

  const toggleDetails = useCallback(() => {
    setDetailsOpen((open) => !open);
  }, []);

  const value = useMemo(
    () => ({
      selectedId,
      detailsOpen,
      selectZone,
      setSelectedId,
      setDetailsOpen,
      toggleDetails,
    }),
    [selectedId, detailsOpen, selectZone, toggleDetails],
  );

  return (
    <DetailsPanelContext.Provider value={value}>
      {children}
    </DetailsPanelContext.Provider>
  );
}

export function useDetailsPanel() {
  const ctx = useContext(DetailsPanelContext);
  if (!ctx) {
    throw new Error("useDetailsPanel must be used within DetailsPanelProvider");
  }
  return ctx;
}
