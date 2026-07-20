import { ClientFetcher } from "$lib/fetchers";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch, url }) => {
  const clientFetcher = ClientFetcher(fetch, url);
  const clients = await clientFetcher
    .FindAll({})
    .then((data) => data.filter((c) => c.active));

  return {
    clients,
  };
};
