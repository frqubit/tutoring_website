import type { Actions, PageServerLoad } from "./$types";
import { DepositFetcher } from "$lib/fetchers";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ fetch, params, url }) => {
  const depositFetcher = new DepositFetcher(fetch, url);
  const deposit = await depositFetcher.findOne([+params.id]);

  return { deposit };
};

export const actions: Actions = {
  delete: async ({ fetch, params, url }) => {
    const depositFetcher = new DepositFetcher(fetch, url);

    await depositFetcher.remove([+params.id]);

    throw redirect(303, "/deposit");
  },
};
