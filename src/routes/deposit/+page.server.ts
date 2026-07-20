import type { PageServerLoad } from "./$types";
import { DepositFetcher } from "$lib/fetchers";
import { BACKEND_DOMAIN, SIGNIN_URL } from "$lib";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ fetch, url }) => {
  const depositFetcher = DepositFetcher(fetch, url);
  const deposits = await depositFetcher.FindAll({});

  return { deposits };
};
