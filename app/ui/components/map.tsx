"use client";
import React from "react";
import { MapContainer, Popup, TileLayer, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { DISTRICTS } from "@/app/districts";
import LocationMarker, { UserMarker } from "./LocationMarker/LocationMarker";
import { useOthers } from "@liveblocks/react/suspense";
import { UserLocation } from "@/app/(protected)/game/[gameId]/rounds/[roundId]/components/UserLocationProvider";

export default function Map() {
  // Coordinates for Poznań, Poland
  const latitude = 52.407775;
  const longitude = 16.912451;

  const others = useOthers();

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {DISTRICTS.map(({ name, positions }, index) => {
        return (
          <District
            key={name}
            name={name}
            color={`oklch(from oklch(0.7056 0.1504 0) l c ${(360 / DISTRICTS.length) * index})`}
            positions={positions}
          />
        );
      })}
      {others.map(({ presence, id }) => {
        const location = presence as UserLocation | undefined;
        if (!location?.latitude || !id) {
          return;
        }
        return <UserMarker location={location} key={id} userId={id} />;
      })}
      <LocationMarker />
    </MapContainer>
  );
}

function District({
  name,
  positions,
  color,
}: {
  name: string;
  positions: [number, number][];
  color: string;
}) {
  return (
    <Polygon pathOptions={{ color, fillOpacity: 0.4 }} positions={positions}>
      <Popup>{name}</Popup>
    </Polygon>
  );
}
