import { createServerFn } from "@tanstack/react-start";
import type {
  AdminDashboard,
  AdminPasswordInput,
  PublicActivityInput,
  PublicSponsor,
  SponsorUpdateInput,
} from "@/lib/civic.server";
import type { SiteId } from "@/lib/data";

export type {
  AdminActivityRow,
  AdminDashboard,
  AdminParticipantRow,
  AdminPasswordInput,
  AdminVoteTally,
  PublicActivityInput,
  PublicActivityKind,
  PublicSponsor,
  SponsorUpdateInput,
} from "@/lib/civic.server";

export const getPublicSponsors = createServerFn({ method: "POST" })
  .validator((data: { siteId?: SiteId }) => data)
  .handler(async ({ data }): Promise<PublicSponsor[]> => {
    const { publicListSponsors } = await import("./civic.server");
    return publicListSponsors(data ?? {});
  });

export const recordPublicActivity = createServerFn({ method: "POST" })
  .validator((data: PublicActivityInput) => data)
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const { publicRecordActivity } = await import("./civic.server");
    return publicRecordActivity(data);
  });

export const getAdminDashboard = createServerFn({ method: "POST" })
  .validator((data: AdminPasswordInput) => data)
  .handler(async ({ data }): Promise<AdminDashboard> => {
    const { adminGetDashboard } = await import("./civic.server");
    return adminGetDashboard(data);
  });

export const saveSponsor = createServerFn({ method: "POST" })
  .validator((data: SponsorUpdateInput) => data)
  .handler(async ({ data }): Promise<AdminDashboard> => {
    const { adminSaveSponsor } = await import("./civic.server");
    return adminSaveSponsor(data);
  });
