import type { Actions, PageServerLoad } from "./$types";
import { SessionFetcher, StudentFetcher } from "$lib/fetchers";
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

async function find_sessions(
  student_fetcher: ReturnType<typeof StudentFetcher>,
  session_fetcher: ReturnType<typeof SessionFetcher>,
  id: number,
) {
  const completed_sessions = await student_fetcher.FindAllCompletedSessionsOf({
    params: {
      id: id,
    },
  });

  if (!completed_sessions) return null;

  const future_sessions = await session_fetcher.FindAllByFilter({
    body: {
      student_id: id,
      client_id: undefined,
      start: undefined,
      end: undefined,
      completed: false,
    },
  });

  if (!future_sessions) return null;

  return {
    completed_sessions,
    future_sessions,
  };
}

export const load: PageServerLoad = async ({ fetch, params, url }) => {
  const studentFetcher = StudentFetcher(fetch, url);
  const sessionFetcher = SessionFetcher(fetch, url);
  const student = await studentFetcher.FindOne({ params: { id: +params.id } });

  if (!student) {
    return { student };
  }

  const sessions_and_deposits = await find_sessions(
    studentFetcher,
    sessionFetcher,
    +params.id,
  );

  return { student, ...sessions_and_deposits };
};

export const actions: Actions = {
  delete: async ({ fetch, params, url }) => {
    const studentFetcher = StudentFetcher(fetch, url);

    await studentFetcher.Remove({ params: { id: +params.id } });

    throw redirect(303, "/student");
  },
  toggleActive: async ({ fetch, params, url }) => {
    const studentFetcher = StudentFetcher(fetch, url);

    await studentFetcher.ToggleActive({ params: { id: +params.id } });

    throw redirect(303, `/student/${params.id}`);
  },
};
