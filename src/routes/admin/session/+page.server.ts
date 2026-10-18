import type { PageServerLoad } from "./$types";
import { SessionFetcher } from "$lib/fetchers";
import { BACKEND_DOMAIN } from "$lib";

export const load: PageServerLoad = async ({ fetch, url }) => {
  const sessionFetcher = SessionFetcher(fetch, url);
  const sessions = await sessionFetcher.FindAllUpcoming({});

  return { sessions };
};
