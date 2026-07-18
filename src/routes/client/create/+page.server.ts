import type { Actions } from "./$types";
import { ClientFetcher } from "$lib/fetchers";
import { BACKEND_DOMAIN } from "$lib";

export const actions: Actions = {
  default: async ({ request, fetch, url }) => {
    const clientFetcher = ClientFetcher(fetch, url);

    const data = await request.formData();
    const name = data.get("name") as string;
    const active = data.get("active") == "on";

    if (name == null) {
      return;
    }

    const response = await clientFetcher.Create(
      {
        name,
        active,
      },
      [],
    );
  },
};
