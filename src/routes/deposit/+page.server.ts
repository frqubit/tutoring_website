import type { PageServerLoad } from "./$types";
import { DepositFetcher } from "$lib/fetchers";
import { BACKEND_DOMAIN, SIGNIN_URL } from "$lib";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ fetch, params }) => {
  const depositFetcher = new DepositFetcher(fetch);
  const deposits = await depositFetcher.findAll([]);

  return { deposits };
};
