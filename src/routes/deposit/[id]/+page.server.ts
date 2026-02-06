import type { Actions, PageServerLoad } from "./$types";
import { DepositFetcher } from "$lib/backend/modules/deposit/Deposit.controller";
import { BACKEND_DOMAIN } from "$lib";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ fetch, params }) => {
  const depositFetcher = new DepositFetcher(BACKEND_DOMAIN, fetch);
  const deposit = await depositFetcher.findOne(+params.id);

  return { deposit };
};

export const actions: Actions = {
  delete: async ({ fetch, params }) => {
    const depositFetcher = new DepositFetcher(BACKEND_DOMAIN, fetch);

    await depositFetcher.remove(+params.id);

    throw redirect(303, "/deposit");
  },
};
