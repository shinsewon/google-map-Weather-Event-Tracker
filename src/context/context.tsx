import React, { useContext, useState, createContext } from 'react';

export type Main = {
  eventData: any[];
  selectedEvent: any | null;
  reRenderMarkers: any | null;
  setEventData: any | null;
  setSelectedEvent: any | null;
  setReRenderMarkers: any | null;
};

const MainContext = createContext<Main | null>(null);

export function useMainContext() {
  const context = useContext(MainContext);
  if (!context) throw new Error('MainContext not found');
  return context;
}

export function ContextProvider({ children }: { children: React.ReactNode }) {
  const [eventData, setEventData] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [reRenderMarkers, setReRenderMarkers] = useState(null);

  const value = {
    eventData,
    setEventData,
    selectedEvent,
    setSelectedEvent,
    reRenderMarkers,
    setReRenderMarkers,
  };

  return <MainContext.Provider value={value}>{children}</MainContext.Provider>;
}
