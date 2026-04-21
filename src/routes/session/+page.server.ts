import type { PageServerLoad } from "./$types";
import { SessionFetcher } from "$lib/fetchers";
import { BACKEND_DOMAIN } from "$lib";

export const load: PageServerLoad = async ({ fetch, params }) => {
  const sessionFetcher = new SessionFetcher(fetch);
  const sessions = await sessionFetcher.findAllUpcoming([]);

  return { sessions };
};
