import type { Actions, PageServerLoad } from "./$types";
import { StudentFetcher, ClientFetcher } from "$lib/fetchers";
import { BACKEND_DOMAIN } from "$lib";

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
    const studentFetcher = StudentFetcher(fetch, url);

    const data = await request.formData();
    const name = data.get("name") as string;
    const client_id = data.get("client_id") as string;
    const active = data.get("active") == "on";

    if (name == null || client_id == null) {
      return;
    }

    const response = await studentFetcher.Create({
      body: {
        name,
        active,
        client_id: +client_id,
      },
    });
  },
};
