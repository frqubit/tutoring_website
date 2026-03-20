import type { Actions, PageServerLoad } from "./$types";
import { SessionFetcher } from "$lib/backend/modules/session/Session.controller";
import { BACKEND_DOMAIN } from "$lib";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ fetch, params }) => {
  const sessionFetcher = new SessionFetcher(BACKEND_DOMAIN, fetch);
  const session = await sessionFetcher.findOne(+params.id);

  if (session && session.weeks > 0 && !session.completed) {
    const future_dates = await sessionFetcher.findFutureDatesOf(+params.id);

    return { session, future_dates };
  } else {
    return { session };
  }
};

export const actions: Actions = {
  delete: async ({ fetch, params }) => {
    const sessionFetcher = new SessionFetcher(BACKEND_DOMAIN, fetch);

    await sessionFetcher.remove(+params.id);

    throw redirect(303, `/student`);
  },
};
