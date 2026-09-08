import { siteById, type SiteId } from "@/lib/data";
import { useMilo } from "@/lib/store";

export function ParkMap({ siteId }: { siteId: SiteId }) {
  const walkActive = useMilo((s) => s.walkActive);
  const walkProgress = useMilo((s) => s.walkProgress);
  const nightMode = useMilo((s) => s.nightMode);
  const site = siteById(siteId);
  const dash = 420;
  const offset = dash * (1 - walkProgress);
  const ground = nightMode ? "#1c241e" : "#d8e0d2";
  const field = nightMode ? "#24302a" : "#c4d0ba";
  const ink = nightMode ? "#e6decc" : "#2f4a3c";
  const pond = nightMode ? "#3a5560" : "#7f9aa8";

  return (
    <div className="relative overflow-hidden rounded-lg bg-surface-2">
      <svg viewBox="0 0 360 240" className="block h-auto w-full" role="img" aria-label={`Map of ${site.name}`}>
        <rect width="360" height="240" fill={nightMode ? "#121614" : "#e6decc"} />
        <rect x="12" y="12" width="336" height="216" rx="10" fill={ground} stroke={ink} strokeWidth="1.5" />
        {site.mapKind === "pond" ? (
          <>
            <rect x="24" y="24" width="92" height="72" rx="8" fill={field} stroke={ink} strokeOpacity="0.45" />
            <rect x="128" y="24" width="208" height="128" rx="8" fill={field} stroke={ink} strokeOpacity="0.45" />
            <ellipse cx="232" cy="108" rx="62" ry="32" fill={pond} />
            <path
              d="M168 108 C168 72 296 72 296 108 C296 144 168 144 168 108"
              fill="none"
              stroke={ink}
              strokeWidth="3"
              strokeDasharray="6 5"
              opacity="0.4"
            />
            {walkActive ? (
              <path
                d="M168 108 C168 72 296 72 296 108 C296 144 168 144 168 108"
                fill="none"
                stroke={nightMode ? "#f3efe6" : "#2f4a3c"}
                strokeWidth="3"
                strokeDasharray={dash}
                strokeDashoffset={offset}
                strokeLinecap="round"
              />
            ) : null}
          </>
        ) : null}
        {site.mapKind === "agility" ? (
          <>
            <rect x="24" y="28" width="200" height="120" rx="8" fill={field} stroke={ink} strokeOpacity="0.45" />
            <rect x="236" y="28" width="88" height="70" rx="8" fill={field} stroke={ink} strokeOpacity="0.45" />
            <rect x="236" y="108" width="88" height="40" rx="8" fill={field} stroke={ink} strokeOpacity="0.45" />
            {walkActive ? (
              <rect x="24" y="28" width={200 * walkProgress} height="6" fill={nightMode ? "#f3efe6" : "#2f4a3c"} />
            ) : null}
          </>
        ) : null}
        {site.mapKind === "trail" ? (
          <>
            <ellipse cx="180" cy="100" rx="88" ry="48" fill={pond} />
            <path
              d="M80 100 C80 40 280 40 280 100 C280 160 80 160 80 100"
              fill="none"
              stroke={ink}
              strokeWidth="3"
              strokeDasharray="6 5"
              opacity="0.45"
            />
            {walkActive ? (
              <path
                d="M80 100 C80 40 280 40 280 100 C280 160 80 160 80 100"
                fill="none"
                stroke={nightMode ? "#f3efe6" : "#2f4a3c"}
                strokeWidth="3"
                strokeDasharray={dash}
                strokeDashoffset={offset}
                strokeLinecap="round"
              />
            ) : null}
          </>
        ) : null}
        <rect x="24" y="168" width="120" height="44" rx="6" fill={nightMode ? "#2a2620" : "#cfc6b4"} />
      </svg>
      <p className="absolute bottom-2 left-2 rounded-md bg-surface/90 px-2 py-1 text-xs text-muted">
        {walkActive ? "On the loop" : nightMode ? "Night preview" : "Schematic — not to scale"}
      </p>
    </div>
  );
}
