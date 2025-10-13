"use client";

import React from "react";
import { Marker, Popup } from "react-leaflet";
import { DivIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./LocationMarker.module.css";
import {
  UserLocation,
  useUserLocationContext,
} from "@/app/(protected)/game/[gameId]/rounds/[roundId]/components/UserLocationProvider";
import { useRoundContext } from "@/app/(protected)/game/[gameId]/rounds/[roundId]/components/RoundProvider";

export default function LocationMarker() {
  const { userLocation } = useUserLocationContext();

  if (userLocation.error) {
    return;
  }

  if (userLocation.loading) {
    return;
  }

  if (userLocation.latitude && userLocation.longitude)
    return (
      <Marker position={[userLocation.latitude, userLocation.longitude]} icon={icon}>
        <Popup>You are here!</Popup>
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

export function UserMarker({ location, userId }: { location: UserLocation; userId: string }) {
  const { round } = useRoundContext();

  const userTeam = round.teams.find((team) => team.members.find((member) => member.id === userId));

  if (!userTeam) {
    throw Error(`There is no team with user of id ${userId}`);
  }

  const user = userTeam.members.find((member) => member.id === userId);

  if (!user) {
    throw Error(`There is no team with user of id ${userId}`);
  }

  const icon2: DivIcon = new DivIcon({
    className: styles.icon2,
    html: `<div>${userTeam.name[0].toUpperCase()}</div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  });

  return (
    <Marker position={[location.latitude, location.longitude]} icon={icon2}>
      <Popup>
        {user.username}, {userTeam.name}
      </Popup>{" "}
    </Marker>
  );
}
