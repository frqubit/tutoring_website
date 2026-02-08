import type { Actions, PageServerLoad } from "./$types";
import { StudentFetcher } from "$lib/backend/modules/student/Student.controller";
import { BACKEND_DOMAIN } from "$lib";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ fetch, params }) => {
  const studentFetcher = new StudentFetcher(BACKEND_DOMAIN, fetch);
  const student = await studentFetcher.findOne(+params.id);
  const deposits = student
    ? await studentFetcher.findAllDepositsOf(+params.id)
    : null;
  const sessions = deposits
    ? await studentFetcher.findAllSessionsOf(+params.id)
    : null;

  return { student, deposits, sessions };
};

export const actions: Actions = {
  delete: async ({ fetch, params }) => {
    const studentFetcher = new StudentFetcher(BACKEND_DOMAIN, fetch);

    await studentFetcher.remove(+params.id);

    throw redirect(303, "/student");
  },
};
