import { BACKEND_DOMAIN } from "$lib";
import { SessionFetcher } from "$lib/backend/modules/session/Session.controller";
import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ fetch, params }) => {
  const sessionFetcher = new SessionFetcher(BACKEND_DOMAIN, fetch);
  const result = await sessionFetcher.markCompleted(+params.sessionId);

  throw redirect(307, `/student/${params.id}`);
};
