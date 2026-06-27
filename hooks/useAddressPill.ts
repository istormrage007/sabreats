"use client";

import { useEffect, useState } from "react";
import {
  addressPillLabel,
  addressPillLoadingLabel,
} from "@/copy/layout_Copy";
import { fetchAddressPillLabel } from "@/lib/locationLabel";

export function useAddressPill(): string {
  const [label, setLabel] = useState(addressPillLoadingLabel);

  useEffect(() => {
    let cancelled = false;

    fetchAddressPillLabel(addressPillLabel).then((resolved) => {
      if (!cancelled) setLabel(resolved);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return label;
}
