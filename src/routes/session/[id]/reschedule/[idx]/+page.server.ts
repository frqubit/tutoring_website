import type { Actions, PageServerLoad } from "./$types";
import { SessionFetcher } from "$lib/fetchers";
import { BACKEND_DOMAIN, MS_PER_WEEK } from "$lib";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ fetch, url, params }) => {
  const { id, idx } = params;

  const sessionFetcher = SessionFetcher(fetch, url);
  const session = await sessionFetcher.FindOne([id]);

  if (!session) {
    throw error(404, "Does not exist");
  }

  session.date = new Date(
    session.date.getTime() + MS_PER_WEEK * session.every * +idx,
  );

  return {
    session,
    id: +id,
    idx: +idx,
  };
};
