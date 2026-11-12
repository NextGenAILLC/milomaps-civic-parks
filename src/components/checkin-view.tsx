import { useEffect, useState } from "react";
import { Accessibility, Footprints, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ParkMap } from "@/components/park-map";
import { haversineM, siteById } from "@/lib/data";
import { PRODUCT } from "@/lib/product";
import { useMilo } from "@/lib/store";
import { toast } from "@/lib/toast";

export function CheckinView() {
  const siteId = useMilo((s) => s.siteId);
  const visit = useMilo((s) => s.visit);
  const reportAccess = useMilo((s) => s.reportAccess);
  const startWalk = useMilo((s) => s.startWalk);
  const tickWalk = useMilo((s) => s.tickWalk);
  const finishWalk = useMilo((s) => s.finishWalk);
  const cancelWalk = useMilo((s) => s.cancelWalk);
  const walkActive = useMilo((s) => s.walkActive);
  const walkProgress = useMilo((s) => s.walkProgress);
  const [note, setNote] = useState("");
  const [geo, setGeo] = useState<"idle" | "looking" | "on" | "off" | "denied">("idle");
  const site = siteById(siteId);

  useEffect(() => {
    if (!walkActive) return;
    let last = performance.now();
    let raf = 0;
    const loop = (t: number) => {
      const dt = (t - last) / 1000;
      last = t;
      tickWalk(dt / 12);
      if (useMilo.getState().walkProgress >= 1) {
        finishWalk();
        toast("Loop complete. +12 PawSteps.");
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [walkActive, tickWalk, finishWalk]);

  function locate() {
    if (!navigator.geolocation) {
      setGeo("denied");
      toast("Location is not available on this device. You can still check in.");
      return;
    }
    setGeo("looking");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const m = haversineM(pos.coords.latitude, pos.coords.longitude, site.lat, site.lng);
        if (m <= site.radiusM) {
          setGeo("on");
          toast(visit(true).message);
        } else {
          setGeo("off");
          toast(`About ${Math.round(m)} m from ${site.name}. Check in still works.`);
        }
      },
      () => {
        setGeo("denied");
        toast("Location blocked. Check in without the on-site bonus.");
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-medium tracking-tight">Check in</h1>
        <p className="text-muted">Show up at {site.name}, walk the loop, or file a barrier.</p>
      </header>
      <ParkMap siteId={siteId} />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="size-4" />
            Park visit
          </CardTitle>
          <CardDescription>
            Eight {PRODUCT.token}, plus four if the phone is on site. One credit every four hours.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Button className="w-full" onClick={() => toast(visit(geo === "on").message)}>
            Check in here
          </Button>
          <Button variant="secondary" className="w-full" onClick={locate} disabled={geo === "looking"}>
            {geo === "looking" ? "Reading location…" : "Confirm I am on site"}
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Footprints className="size-4" />
            Loop walk
          </CardTitle>
          <CardDescription>Twelve {PRODUCT.token} and 18 health minutes when the loop closes.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {walkActive ? (
            <>
              <Progress value={walkProgress * 100} />
              <p className="text-xs tabular-nums text-subtle">{Math.round(walkProgress * 100)}% around</p>
              <Button variant="secondary" onClick={cancelWalk}>
                Stop walk
              </Button>
            </>
          ) : (
            <Button onClick={startWalk} className="w-full">
              Start loop
            </Button>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Accessibility className="size-4" />
            Access report
          </CardTitle>
          <CardDescription>Lighting, ruts, gates, seating. First report is 15 {PRODUCT.token}.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="w-full resize-none rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Uneven ground at the east gate after rain"
          />
          <Button
            className="w-full"
            onClick={() => {
              const r = reportAccess(note);
              toast(r.message);
              if (r.ok) setNote("");
            }}
          >
            File report
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
