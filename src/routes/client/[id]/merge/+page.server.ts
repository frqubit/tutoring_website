import type { Actions, PageServerLoad } from "./$types";
import { StudentFetcher, ClientFetcher } from "$lib/fetchers";
import { BACKEND_DOMAIN } from "$lib";

export const load: PageServerLoad = async ({ fetch, url, params }) => {
  const clientFetcher = ClientFetcher(fetch, url);
  const clients = await clientFetcher
    .FindAll([])
    .then((data) => data.filter((s) => s.active));

  return {
    clients: clients.filter((c) => c.id != +params.id),
    this_client: clients.find((c) => c.id == +params.id),
  };
};
