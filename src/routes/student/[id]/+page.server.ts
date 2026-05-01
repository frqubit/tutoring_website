import type { Actions, PageServerLoad } from "./$types";
import { StudentFetcher } from "$lib/fetchers";
import { BACKEND_DOMAIN } from "$lib";
import { redirect } from "@sveltejs/kit";

interface SessionsAndDeposits {
  completed_sessions: Awaited<
    ReturnType<StudentFetcher["findAllCompletedSessionsOf"]>
  >;
  future_sessions: Awaited<
    ReturnType<StudentFetcher["findAllFutureSessionsOf"]>
  >;
  deposits: Awaited<ReturnType<StudentFetcher["findAllDepositsOf"]>>;
}

async function find_sessions_and_deposits(
  fetcher: StudentFetcher,
  id: number,
): Promise<SessionsAndDeposits | null> {
  const deposits = await fetcher.findAllDepositsOf([id]);

  if (!deposits) return null;

  const completed_sessions = await fetcher.findAllCompletedSessionsOf([id]);

  if (!completed_sessions) return null;

  const future_sessions = await fetcher.findAllFutureSessionsOf([id]);

  if (!future_sessions) return null;

  return {
    deposits,
    completed_sessions,
    future_sessions,
  };
}

export const load: PageServerLoad = async ({ fetch, params, url }) => {
  const studentFetcher = new StudentFetcher(fetch, url);
  const student = await studentFetcher.findOne([+params.id]);

  if (!student) {
    return { student };
  }

  const sessions_and_deposits = await find_sessions_and_deposits(
    studentFetcher,
    +params.id,
  );

  return { student, ...sessions_and_deposits };
};

export const actions: Actions = {
  delete: async ({ fetch, params, url }) => {
    const studentFetcher = new StudentFetcher(fetch, url);

    await studentFetcher.remove([+params.id]);

    throw redirect(303, "/student");
  },
  toggleActive: async ({ fetch, params, url }) => {
    const studentFetcher = new StudentFetcher(fetch, url);

    await studentFetcher.toggleActive([+params.id]);

    throw redirect(303, `/student/${params.id}`);
  },
};
