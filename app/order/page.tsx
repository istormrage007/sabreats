"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getTrackingOrdersSnapshot } from "@/lib/order";

export default function OrderIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const tracking = getTrackingOrdersSnapshot();
    if (tracking.length > 0) {
      router.replace(`/order/${tracking[0].orderNumber}`);
    } else {
      router.replace("/");
    }
  }, [router]);

  return null;
}
