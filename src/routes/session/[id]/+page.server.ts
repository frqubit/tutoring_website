import type { Actions, PageServerLoad } from "./$types";
import { SessionFetcher } from "$lib/fetchers";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ fetch, params }) => {
  const sessionFetcher = new SessionFetcher(fetch);
  const session = await sessionFetcher.findOne([+params.id]);

  if (session && session.occurrences > 0 && !session.completed) {
    const future_dates = await sessionFetcher.findFutureDatesOf([+params.id]);

    return { session, future_dates };
  } else {
    return { session };
  }
};

export const actions: Actions = {
  delete: async ({ fetch, params }) => {
    const sessionFetcher = new SessionFetcher(fetch);

    await sessionFetcher.remove([+params.id]);

    throw redirect(303, `/session`);
  },
};
