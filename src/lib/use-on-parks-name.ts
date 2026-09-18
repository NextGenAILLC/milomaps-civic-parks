import { useEffect, useState } from "react";
import { DOMAIN_LAUNCH } from "@/lib/product";

export function useOnParksName() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const host = window.location.hostname.replace(/^www\./, "");
    setOn(host === DOMAIN_LAUNCH.canonicalHost || host === DOMAIN_LAUNCH.alternateHost);
  }, []);
  return on;
}
