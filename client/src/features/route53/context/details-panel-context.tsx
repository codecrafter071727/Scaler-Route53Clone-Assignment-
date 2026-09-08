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
  selectedZoneId: string | null;
  detailsOpen: boolean;
  selectZone: (hostedZoneId: string) => void;
  setSelectedZoneId: (
    id: string | null | ((prev: string | null) => string | null),
  ) => void;
  setDetailsOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  toggleDetails: () => void;
};

const DetailsPanelContext = createContext<DetailsPanelContextValue | null>(null);

export function DetailsPanelProvider({ children }: { children: ReactNode }) {
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const selectZone = useCallback((hostedZoneId: string) => {
    setSelectedZoneId(hostedZoneId);
    setDetailsOpen(true);
  }, []);

  const toggleDetails = useCallback(() => {
    setDetailsOpen((open) => !open);
  }, []);

  const value = useMemo(
    () => ({
      selectedZoneId,
      detailsOpen,
      selectZone,
      setSelectedZoneId,
      setDetailsOpen,
      toggleDetails,
    }),
    [selectedZoneId, detailsOpen, selectZone, toggleDetails],
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
