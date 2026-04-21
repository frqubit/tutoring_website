import type { PageServerLoad } from "./$types";
import { SessionFetcher } from "$lib/fetchers";

export const load: PageServerLoad = async ({ fetch, params }) => {
  const sessionFetcher = new SessionFetcher(fetch);
  const sessions = await sessionFetcher.findAll([]);

  return { sessions };
};
