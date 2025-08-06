"use client";

import React from "react";
import { Marker, Popup } from "react-leaflet";
import { DivIcon } from "leaflet";
import { useGeolocation } from "@uidotdev/usehooks";
import "leaflet/dist/leaflet.css";
import styles from "./LocationMarker.module.css";

export default function LocationMarker() {
  const state = useGeolocation({
    enableHighAccuracy: true,
  });

  if (state.error) {
    return;
  }

  if (state.loading) {
    return;
  }

  if (state.latitude && state.longitude)
    return (
      <Marker position={[state.latitude, state.longitude]} icon={icon}>
        <Popup>Here</Popup>
      </Marker>
    );
}

const icon: DivIcon = new DivIcon({
  className: styles.icon,
  html: `<div></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -10],
});
