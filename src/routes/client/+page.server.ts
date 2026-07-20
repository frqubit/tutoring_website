import type { PageServerLoad } from "./$types";
import { ClientFetcher } from "$lib/fetchers";
import { BACKEND_DOMAIN } from "$lib";

export const load: PageServerLoad = async ({ fetch, url }) => {
  const clientFetcher = ClientFetcher(fetch, url);
  const clients = await clientFetcher.FindAll({});

  return { clients };
};
