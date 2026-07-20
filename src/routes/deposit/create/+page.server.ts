import type { Actions, PageServerLoad } from "./$types";
import { DepositFetcher, ClientFetcher } from "$lib/fetchers";

export const load: PageServerLoad = async ({ fetch, url }) => {
  const clientFetcher = ClientFetcher(fetch, url);
  const clients = await clientFetcher
    .FindAll({})
    .then((data) => data.filter((s) => s.active));

  return {
    clients,
  };
};

export const actions: Actions = {
  default: async ({ request, fetch, url }) => {
    const depositFetcher = DepositFetcher(fetch, url);

    const data = await request.formData();
    const client_id = data.get("client_id") as string;
    const date = data.get("date") as string;
    const cents = data.get("cents") as string;

    if (client_id == null || date == null || cents == null) {
      return;
    }

    const response = await depositFetcher.Create({
      body: {
        client_id: +client_id,
        date: new Date(date),
        cents: +cents,
      },
    });
    console.log(response);
  },
};
