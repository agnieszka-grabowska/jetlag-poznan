"use client";
import React, { useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { DivIcon, LatLng } from "leaflet";

const s: DivIcon = new DivIcon({
  className: "custom-icon",
  html: `<div style="background-color: #f00; width: 20px; height: 20px; border-radius: 50%;"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -10],
});

export default function Map() {
  // Coordinates for Poznań, Poland
  const latitude = 52.407775;
  const longitude = 16.912451;

  const position: [number, number] = [52.43580661629394, 16.840996206520686];

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

      <Marker position={[52.417392124896494, 16.88560011724876]} icon={s}>
        <Popup>HERE</Popup>
      </Marker>

      <LocationMarker></LocationMarker>
    </MapContainer>
  );
}

function LocationMarker() {
  const [position, setPosition] = useState<LatLng | null>(null);
  const map = useMapEvents({
    click() {
      map.locate();
    },
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={s}>
      <Popup>You are here</Popup>
    </Marker>
  );
}
