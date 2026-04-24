import { BACKEND_DOMAIN } from "$lib";
import { SessionFetcher } from "$lib/fetchers";
import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ fetch, params }) => {
  const sessionFetcher = new SessionFetcher(fetch);
  const result = await sessionFetcher.removeOneInSeries([
    +params.id,
    +params.idx,
  ]);

  if (+params.idx == 0) {
    throw redirect(307, "/session");
  } else {
    throw redirect(307, `/session/${params.id}`);
  }
};
