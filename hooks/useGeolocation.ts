"use client";

import { useEffect, useState } from "react";
import { getRandomFallbackCenter, type LatLng } from "@/lib/geo";

export type GeolocationStatus = "loading" | "granted" | "denied" | "error";

export interface GeolocationResult {
  status: GeolocationStatus;
  position: LatLng | null;
  usedFallback: boolean;
}

export function useGeolocation(): GeolocationResult {
  const [result, setResult] = useState<GeolocationResult>({
    status: "loading",
    position: null,
    usedFallback: false,
  });

  useEffect(() => {
    let cancelled = false;

    const applyResult = (next: GeolocationResult) => {
      if (!cancelled) setResult(next);
    };

    if (!navigator.geolocation) {
      applyResult({
        status: "error",
        position: getRandomFallbackCenter(),
        usedFallback: true,
      });
      return () => {
        cancelled = true;
      };
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        applyResult({
          status: "granted",
          position: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          },
          usedFallback: false,
        });
      },
      () => {
        applyResult({
          status: "denied",
          position: getRandomFallbackCenter(),
          usedFallback: true,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );

    return () => {
      cancelled = true;
    };
  }, []);

  return result;
}
