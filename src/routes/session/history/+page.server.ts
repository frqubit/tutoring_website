import type { PageServerLoad } from "./$types";
import { SessionFetcher } from "$lib/fetchers";

export const load: PageServerLoad = async ({ fetch, url }) => {
  const sessionFetcher = SessionFetcher(fetch, url);
  const sessions = await sessionFetcher.FindAll([]);

  return { sessions };
};
