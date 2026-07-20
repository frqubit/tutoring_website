import { BACKEND_DOMAIN } from "$lib";
import { SessionFetcher } from "$lib/fetchers";
import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ fetch, params, url }) => {
  const sessionFetcher = SessionFetcher(fetch, url);
  const result = await sessionFetcher.MarkCompleted({
    params: { id: +params.sessionId },
  });

  throw redirect(307, `/student/${params.id}`);
};
