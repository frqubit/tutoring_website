import type { PageServerLoad } from "./$types";
import { DepositFetcher } from "$lib/backend/modules/deposit/Deposit.controller";
import { BACKEND_DOMAIN } from "$lib";

export const load: PageServerLoad = async ({ fetch, params }) => {
  const depositFetcher = new DepositFetcher(BACKEND_DOMAIN, fetch);
  const deposit = await depositFetcher.findOne(+params.id);

  return { deposit };
};
