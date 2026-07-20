import { BACKEND_DOMAIN } from "$lib";
import { SessionFetcher } from "$lib/fetchers";
import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ fetch, params, url }) => {
  const sessionFetcher = SessionFetcher(fetch, url);
  const pagestudent = url.searchParams.get("pagestudent");

  const studentid = pagestudent
    ? await sessionFetcher
        .FindOne({ params: { id: +params.id } })
        .then((res) => res!.students[0].id)
    : null;

  const result = await sessionFetcher.RemoveOneInSeries({
    params: { id: +params.id, index: +params.idx },
  });

  if (studentid) throw redirect(307, `/student/${studentid}`);
  else if (+params.idx == 0) {
    throw redirect(307, "/session");
  } else {
    throw redirect(307, `/session/${params.id}`);
  }
};
