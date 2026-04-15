import type { Actions, PageServerLoad } from "./$types";
import { DepositFetcher } from "$lib/fetchers";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ fetch, params }) => {
  const depositFetcher = new DepositFetcher(fetch);
  const deposit = await depositFetcher.findOne(undefined, [+params.id]);

  return { deposit };
};

export const actions: Actions = {
  delete: async ({ fetch, params }) => {
    const depositFetcher = new DepositFetcher(fetch);

    await depositFetcher.remove(undefined, [+params.id]);

    throw redirect(303, "/deposit");
  },
};
