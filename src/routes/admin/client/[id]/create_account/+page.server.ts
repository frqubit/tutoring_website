import type { Actions, PageServerLoad } from "./$types";
import { StudentFetcher, ClientFetcher } from "$lib/fetchers";
import { BACKEND_DOMAIN } from "$lib";

export const load: PageServerLoad = async ({ fetch, url, params }) => {
  const clientFetcher = ClientFetcher(fetch, url);
  const client = await clientFetcher.FindOne({ params: { id: +params.id } });

  return {
    client,
  };
};
