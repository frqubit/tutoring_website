import type { Actions, PageServerLoad } from "./$types";
import { DepositFetcher } from "$lib/fetchers";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ fetch, params, url }) => {
  const depositFetcher = DepositFetcher(fetch, url);
  const deposit = await depositFetcher.FindOne({ params: { id: +params.id } });

  return { deposit };
};

export const actions: Actions = {
  delete: async ({ fetch, params, url }) => {
    const depositFetcher = DepositFetcher(fetch, url);

    await depositFetcher.Remove({ params: { id: +params.id } });

    throw redirect(303, "/deposit");
  },
};
