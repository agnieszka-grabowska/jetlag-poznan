"use client";
import React from "react";
import { MapContainer, Popup, TileLayer, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { DISTRICTS } from "@/app/districts";
import LocationMarker from "./LocationMarker/LocationMarker";

export default function Map() {
  // Coordinates for Poznań, Poland
  const latitude = 52.407775;
  const longitude = 16.912451;

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
