import type { Actions, PageServerLoad } from "./$types";
import { SessionFetcher, ClientFetcher } from "$lib/fetchers";
import { BACKEND_DOMAIN } from "$lib";
import { redirect } from "@sveltejs/kit";

// interface SessionsAndDeposits {
//   completed_sessions: Awaited<
//     ReturnType<StudentFetcher["findAllCompletedSessionsOf"]>
//   >;
//   future_sessions: Awaited<
//     ReturnType<StudentFetcher["findAllFutureSessionsOf"]>
//   >;
//   deposits: Awaited<ReturnType<StudentFetcher["findAllDepositsOf"]>>;
// }

async function find_sessions_and_deposits(
  client_fetcher: ReturnType<typeof ClientFetcher>,
  session_fetcher: ReturnType<typeof SessionFetcher>,
  id: number,
) {
  const deposits = await client_fetcher.FindAllDepositsOf([id]);

  if (!deposits) return null;

  const completed_sessions = await client_fetcher.FindAllCompletedSessionsOf([
    id,
  ]);

  if (!completed_sessions) return null;

  const future_sessions = await session_fetcher.FindAllByFilter(
    {
      student_id: undefined,
      client_id: id,
      start: undefined,
      end: undefined,
      completed: false,
    },
    [],
  );

  if (!future_sessions) return null;

  return {
    deposits,
    completed_sessions,
    future_sessions,
  };
}

export const load: PageServerLoad = async ({ fetch, params, url }) => {
  const clientFetcher = ClientFetcher(fetch, url);
  const sessionFetcher = SessionFetcher(fetch, url);
  const client = await clientFetcher.FindOne([+params.id]);

  if (!client) {
    return { client };
  }

  const sessions_and_deposits = await find_sessions_and_deposits(
    clientFetcher,
    sessionFetcher,
    +params.id,
  );

  return { client, ...sessions_and_deposits };
};

export const actions: Actions = {
  delete: async ({ fetch, params, url }) => {
    const clientFetcher = ClientFetcher(fetch, url);

    await clientFetcher.Remove([+params.id]);

    throw redirect(303, "/student");
  },
  toggleActive: async ({ fetch, params, url }) => {
    const clientFetcher = ClientFetcher(fetch, url);

    await clientFetcher.ToggleActive([+params.id]);

    throw redirect(303, `/student/${params.id}`);
  },
};
