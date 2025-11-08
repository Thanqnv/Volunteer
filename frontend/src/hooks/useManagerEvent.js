import { useRouter } from "next/router";
import { useMemo } from "react";
import { getManagerEventByRouteId } from "@/data/managerEvents";

const normalizeRouteParam = (value) => {
  if (value === undefined) return null;
  return Array.isArray(value) ? value[0] : value;
};

export const useManagerEvent = () => {
  const router = useRouter();
  const rawId = normalizeRouteParam(router.query.id);

  const event = useMemo(() => {
    if (!router.isReady) return null;
    return getManagerEventByRouteId(rawId);
  }, [rawId, router.isReady]);

  return { event, eventId: rawId, isReady: router.isReady };
};
