import type { PageServerLoad } from "./$types";
import { SessionFetcher } from "$lib/backend/modules/session/Session.controller";
import { BACKEND_DOMAIN } from "$lib";

export const load: PageServerLoad = async ({ fetch, params }) => {
  const sessionFetcher = new SessionFetcher(BACKEND_DOMAIN, fetch);
  const session = await sessionFetcher.findOne(+params.id);

  return { session };
};
