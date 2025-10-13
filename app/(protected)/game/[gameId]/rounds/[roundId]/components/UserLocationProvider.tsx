"use client";

import React, { ReactNode } from "react";
import { useUpdateMyPresence } from "@liveblocks/react/suspense";
import { GeolocationState, useGeolocation } from "@uidotdev/usehooks";

export type UserLocation = {
  latitude: number;
  longitude: number;
};

const UserLocationContext = React.createContext<{ userLocation: GeolocationState } | null>(null);

export default function UserLocationProvider({ children }: { children: ReactNode }) {
  const updateMyPresence = useUpdateMyPresence();
  const userLocation = useGeolocation({
    enableHighAccuracy: true,
  });

  React.useEffect(() => {
    navigator.geolocation.watchPosition((pos) => {
      const location: UserLocation = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      };
      updateMyPresence(location);
    });
  }, []);

  return (
    <UserLocationContext.Provider value={{ userLocation }}>{children}</UserLocationContext.Provider>
  );
}

export function useUserLocationContext() {
  const context = React.useContext(UserLocationContext);

  if (!context) {
    throw new Error("No user location context.");
  }

  return context;
}
